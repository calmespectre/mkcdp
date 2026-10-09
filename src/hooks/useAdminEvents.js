import { useEffect, useRef } from "react";
import { API_BASE_URL, getAccessToken } from "../api/client";

function wsUrl(path) {
  try {
    const base = new URL(API_BASE_URL);
    const protocol = base.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${base.host}${path}`;
  } catch {
    return null;
  }
}

export function useAdminEvents(onEvent) {
  const wsRef = useRef(null);
  const retryRef = useRef(0);
  const handlerRef = useRef(onEvent);
  handlerRef.current = onEvent;

  useEffect(() => {
    let cancelled = false;
    const token = getAccessToken() || "";
    const base = wsUrl(`/ws/admin/events/`);
    if (!base) return;

    function connect() {
      if (cancelled) return;
      const url = `${base}?token=${encodeURIComponent(token)}`;
      let ws;
      try {
        ws = new WebSocket(url);
      } catch {
        scheduleReconnect();
        return;
      }
      wsRef.current = ws;
      ws.onopen = () => { retryRef.current = 0; };
      ws.onmessage = (e) => {
        try { handlerRef.current?.(JSON.parse(e.data)); } catch {}
      };
      ws.onclose = () => scheduleReconnect();
      ws.onerror = () => { try { ws.close(); } catch {} };
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
  }, []);
}