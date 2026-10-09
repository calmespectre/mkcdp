import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const ACCESS_KEY = "mkcdp.access";
const REFRESH_KEY = "mkcdp.refresh";
const USER_KEY = "mkcdp.user";
const ACCOUNTS_KEY = "mkcdp.accounts";
const ACTIVE_EMAIL_KEY = "mkcdp.activeAccount";

const API_BASE = import.meta.env?.VITE_API_URL || "http://127.0.0.1:8000/api/auth";

const AuthContext = createContext(null);

function safeLocalGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeLocalSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

function safeLocalRemove(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {}
}

function readTokens() {
  if (typeof window === "undefined") {
    return { access: null, refresh: null, user: null };
  }
  const access = safeLocalGet(ACCESS_KEY);
  const refresh = safeLocalGet(REFRESH_KEY);
  let user = null;
  const rawUser = safeLocalGet(USER_KEY);
  if (rawUser) {
    try {
      user = JSON.parse(rawUser);
    } catch {
      user = null;
    }
  }
  return { access, refresh, user };
}

function writeTokens({ access, refresh, user }) {
  if (typeof window === "undefined") return;
  if (access) safeLocalSet(ACCESS_KEY, access);
  else safeLocalRemove(ACCESS_KEY);

  if (refresh) safeLocalSet(REFRESH_KEY, refresh);
  else safeLocalRemove(REFRESH_KEY);

  if (user) safeLocalSet(USER_KEY, JSON.stringify(user));
  else safeLocalRemove(USER_KEY);
}

function readAccounts() {
  if (typeof window === "undefined") return [];
  const raw = safeLocalGet(ACCOUNTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts) {
  if (typeof window === "undefined") return;
  try {
    safeLocalSet(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {}
}

function readActiveEmail() {
  if (typeof window === "undefined") return null;
  return safeLocalGet(ACTIVE_EMAIL_KEY) || null;
}

function writeActiveEmail(email) {
  if (typeof window === "undefined") return;
  if (email) safeLocalSet(ACTIVE_EMAIL_KEY, email);
  else safeLocalRemove(ACTIVE_EMAIL_KEY);
}

export function initialsOf(account) {
  if (!account) return "?";
  const name = (account.full_name || account.username || "").trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  const email = account.email || "";
  return (email.slice(0, 2) || "?").toUpperCase();
}

const AVATAR_COLORS = [
  "#14532D",
  "#1C6B4B",
  "#7FB069",
  "#E2703A",
  "#F2B33D",
  "#2E5E4E",
  "#8B4513",
  "#0F3D2E",
];

export function colorForEmail(email) {
  if (!email) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < email.length; i += 1) {
    hash = (hash * 31 + email.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

async function unwrap(res) {
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    return { ok: res.ok, status: res.status, data: body.data, errors: body.errors || null, body };
  }
  return { ok: res.ok, status: res.status, data: body, errors: null, body };
}

export function AuthProvider({ children }) {
  const initial = readTokens();
  const [access, setAccess] = useState(initial.access);
  const [refresh, setRefresh] = useState(initial.refresh);
  const [user, setUser] = useState(initial.user);
  const [accounts, setAccounts] = useState(() => readAccounts());
  const [activeEmail, setActiveEmail] = useState(() => readActiveEmail());
  const [booting, setBooting] = useState(Boolean(initial.refresh));
  const refreshingRef = useRef(false);

  useEffect(() => {
    writeTokens({ access, refresh, user });
  }, [access, refresh, user]);

  useEffect(() => {
    writeAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    writeActiveEmail(activeEmail);
  }, [activeEmail]);

  const upsertAccount = useCallback((entry) => {
    if (!entry?.email) return;
    setAccounts((prev) => {
      const idx = prev.findIndex((a) => a.email.toLowerCase() === entry.email.toLowerCase());
      const nextEntry = {
        email: entry.email,
        username: entry.username || "",
        full_name: entry.full_name || "",
        is_superuser: Boolean(entry.is_superuser),
        access: entry.access || "",
        refresh: entry.refresh || "",
        user: entry.user || null,
        lastUsed: Date.now(),
      };
      if (idx === -1) return [nextEntry, ...prev];
      const next = [...prev];
      next[idx] = { ...prev[idx], ...nextEntry };
      return next;
    });
  }, []);

  const patchAccountTokens = useCallback((email, tokens) => {
    if (!email) return;
    setAccounts((prev) =>
      prev.map((a) =>
        a.email.toLowerCase() === email.toLowerCase()
          ? { ...a, ...tokens, lastUsed: Date.now() }
          : a
      )
    );
  }, []);

  const doRefresh = useCallback(async () => {
    const currentRefresh =
      typeof window !== "undefined" ? safeLocalGet(REFRESH_KEY) : refresh;
    if (!currentRefresh || refreshingRef.current) return null;
    refreshingRef.current = true;
    try {
      const res = await fetch(`${API_BASE}/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: currentRefresh }),
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setAccess(null);
          setRefresh(null);
          setUser(null);
          setActiveEmail(null);
          writeTokens({ access: null, refresh: null, user: null });
        }
        return null;
      }
      const data = await res.json();
      const nextAccess = data.access;
      const nextRefresh = data.refresh || currentRefresh;
      setAccess(nextAccess);
      if (data.refresh) setRefresh(data.refresh);
      if (activeEmail) {
        patchAccountTokens(activeEmail, { access: nextAccess, refresh: nextRefresh });
      }
      return nextAccess;
    } catch {
      return null;
    } finally {
      refreshingRef.current = false;
    }
  }, [refresh, activeEmail, patchAccountTokens]);

  useEffect(() => {
    if (!refresh) return undefined;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") doRefresh();
    }, 20 * 60 * 1000);
    return () => window.clearInterval(id);
  }, [refresh, doRefresh]);

  useEffect(() => {
    if (!refresh) return undefined;
    const onVisible = () => {
      if (document.visibilityState === "visible") doRefresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [refresh, doRefresh]);

  const fetchMe = useCallback(
    async (token) => {
      if (!token) return null;
      const res = await fetch(`${API_BASE}/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { ok, data } = await unwrap(res);
      if (!ok) return null;
      return data;
    },
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const stored = readTokens();
      if (!stored.refresh) {
        if (!cancelled) setBooting(false);
        return;
      }
      let token = stored.access;
      if (!token) token = await doRefresh();
      if (!token) {
        if (!cancelled) setBooting(false);
        return;
      }
      const me = await fetchMe(token);
      if (cancelled) return;
      if (me) {
        setUser(me);
        if (me.email) {
          setActiveEmail(me.email);
          upsertAccount({
            email: me.email,
            username: me.username,
            full_name: me.full_name,
            is_superuser: me.is_superuser,
            access: token,
            refresh: stored.refresh,
            user: me,
          });
        }
      }
      if (!cancelled) setBooting(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [doRefresh, fetchMe, upsertAccount]);

  const signInWithTokens = useCallback(
    (payload) => {
      if (!payload) return;
      if (payload.access) setAccess(payload.access);
      if (payload.refresh) setRefresh(payload.refresh);
      if (payload.user) setUser(payload.user);
      if (payload.user?.email) {
        setActiveEmail(payload.user.email);
        upsertAccount({
          email: payload.user.email,
          username: payload.user.username,
          full_name: payload.user.full_name,
          is_superuser: payload.user.is_superuser,
          access: payload.access,
          refresh: payload.refresh,
          user: payload.user,
        });
      }
    },
    [upsertAccount]
  );

  const signOut = useCallback(async () => {
    const currentAccess = typeof window !== "undefined" ? safeLocalGet(ACCESS_KEY) : access;
    const currentRefresh = typeof window !== "undefined" ? safeLocalGet(REFRESH_KEY) : refresh;

    try {
      if (currentAccess) {
        await fetch(`${API_BASE}/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentAccess}`,
          },
          body: JSON.stringify({ refresh: currentRefresh }),
        });
      }
    } catch {}

    if (activeEmail) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.email.toLowerCase() === activeEmail.toLowerCase()
            ? { ...a, access: "", refresh: "", lastUsed: Date.now() }
            : a
        )
      );
    }

    setAccess(null);
    setRefresh(null);
    setUser(null);
    setActiveEmail(null);
    writeTokens({ access: null, refresh: null, user: null });
  }, [access, refresh, activeEmail]);

  const switchToAccount = useCallback(
    async (email) => {
      if (!email) return false;
      const target = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (!target) return false;

      if (!target.refresh) {
        setActiveEmail(null);
        writeTokens({ access: null, refresh: null, user: null });
        setAccess(null);
        setRefresh(null);
        setUser(null);
        return false;
      }

      setActiveEmail(target.email);
      setAccess(target.access || null);
      setRefresh(target.refresh);
      setUser(target.user || null);
      writeTokens({
        access: target.access || null,
        refresh: target.refresh,
        user: target.user || null,
      });

      let token = target.access;
      let me = token ? await fetchMe(token) : null;

      if (!me) {
        const refreshedAccess = await fetch(`${API_BASE}/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: target.refresh }),
        })
          .then(async (r) => (r.ok ? (await r.json()).access : null))
          .catch(() => null);

        if (refreshedAccess) {
          token = refreshedAccess;
          setAccess(refreshedAccess);
          writeTokens({
            access: refreshedAccess,
            refresh: target.refresh,
            user: target.user || null,
          });
          patchAccountTokens(target.email, {
            access: refreshedAccess,
            refresh: target.refresh,
          });
          me = await fetchMe(refreshedAccess);
        }
      }

      if (me) {
        setUser(me);
        upsertAccount({
          email: me.email,
          username: me.username,
          full_name: me.full_name,
          is_superuser: me.is_superuser,
          access: token,
          refresh: target.refresh,
          user: me,
        });
      }
      return true;
    },
    [accounts, patchAccountTokens, upsertAccount, fetchMe]
  );

  const removeAccount = useCallback(
    (email) => {
      if (!email) return;
      setAccounts((prev) => prev.filter((a) => a.email.toLowerCase() !== email.toLowerCase()));
      if (activeEmail && activeEmail.toLowerCase() === email.toLowerCase()) {
        setAccess(null);
        setRefresh(null);
        setUser(null);
        setActiveEmail(null);
        writeTokens({ access: null, refresh: null, user: null });
      }
    },
    [activeEmail]
  );

  const forgetAllAccounts = useCallback(() => {
    setAccounts([]);
    setAccess(null);
    setRefresh(null);
    setUser(null);
    setActiveEmail(null);
    writeTokens({ access: null, refresh: null, user: null });
    safeLocalRemove(ACCOUNTS_KEY);
    safeLocalRemove(ACTIVE_EMAIL_KEY);
  }, []);

  const authedFetch = useCallback(
    async (path, options = {}) => {
      const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

      let token = typeof window !== "undefined" ? safeLocalGet(ACCESS_KEY) : access;
      if (!token) token = await doRefresh();

      const buildHeaders = (t) => {
        const h = new Headers(options.headers || {});
        if (t) h.set("Authorization", `Bearer ${t}`);
        return h;
      };

      let res = await fetch(url, { ...options, headers: buildHeaders(token) });

      if (res.status === 401) {
        token = await doRefresh();
        if (token) {
          res = await fetch(url, { ...options, headers: buildHeaders(token) });
        }
      }
      return res;
    },
    [access, doRefresh]
  );

  const value = {
    access,
    refresh,
    user,
    accounts,
    activeEmail,
    booting,
    isAuthenticated: Boolean(access || refresh),
    isSuperuser: Boolean(user?.is_superuser),
    signInWithTokens,
    signOut,
    switchToAccount,
    removeAccount,
    forgetAllAccounts,
    authedFetch,
    setUser,
    refreshNow: doRefresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}