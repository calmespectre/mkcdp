import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../api/client";
import { getPaymentStatus } from "../api/payments";

function wsUrl(path) {
  try {
    const base = new URL(API_BASE_URL);
    const protocol = base.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${base.host}${path}`;
  } catch {
    return null;
  }
}

export function usePaymentStatus(reference) {
  const [payment, setPayment] = useState(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const retryRef = useRef(0);

  useEffect(() => {
    if (!reference) return;
    let cancelled = false;

    getPaymentStatus(reference)
      .then((data) => {
        if (!cancelled) setPayment(data);
      })
      .catch(() => {});

    const url = wsUrl(`/ws/payments/${encodeURIComponent(reference)}/`);
    if (!url) return;

    function connect() {
      if (cancelled) return;
      let ws;
      try {
        ws = new WebSocket(url);
      } catch {
        scheduleReconnect();
        return;
      }
      wsRef.current = ws;
      ws.onopen = () => {
        setConnected(true);
        retryRef.current = 0;
      };
      ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === "payment.status") {
            setPayment((p) => ({ ...(p || {}), ...data }));
          }
        } catch {}
      };
      ws.onclose = () => {
        setConnected(false);
        scheduleReconnect();
      };
      ws.onerror = () => {
        try { ws.close(); } catch {}
      };
    }

    function scheduleReconnect() {
      if (cancelled) return;
      retryRef.current = Math.min(retryRef.current + 1, 6);
      const delay = Math.min(1000 * 2 ** retryRef.current, 30000);
      setTimeout(connect, delay);
    }

    connect();

    return () => {
      cancelled = true;
      try { wsRef.current && wsRef.current.close(); } catch {}
    };
  }, [reference]);

  return { payment, connected };
}