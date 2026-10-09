const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

let accessToken = typeof window !== "undefined" ? localStorage.getItem("mkcdp.access") || "" : "";
let refreshToken = typeof window !== "undefined" ? localStorage.getItem("mkcdp.refresh") || "" : "";

export function setTokens({ access, refresh }) {
  if (access !== undefined) {
    accessToken = access || "";
    if (typeof window !== "undefined") {
      if (accessToken) localStorage.setItem("mkcdp.access", accessToken);
      else localStorage.removeItem("mkcdp.access");
    }
  }
  if (refresh !== undefined) {
    refreshToken = refresh || "";
    if (typeof window !== "undefined") {
      if (refreshToken) localStorage.setItem("mkcdp.refresh", refreshToken);
      else localStorage.removeItem("mkcdp.refresh");
    }
  }
}

export function clearTokens() {
  accessToken = "";
  refreshToken = "";
  if (typeof window !== "undefined") {
    localStorage.removeItem("mkcdp.access");
    localStorage.removeItem("mkcdp.refresh");
  }
}

export function getAccessToken() {
  return accessToken;
}

async function tryRefresh() {
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (!data.access) return false;
    setTokens({ access: data.access, refresh: data.refresh || refreshToken });
    return true;
  } catch {
    return false;
  }
}

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && (await tryRefresh())) {
    headers.set("Authorization", `Bearer ${accessToken}`);
    res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  }
  return res;
}

function extractError(data) {
  if (!data) return "Request failed";
  const errors = data.errors && typeof data.errors === "object" ? data.errors : data;
  if (typeof errors.detail === "string") return errors.detail;
  if (Array.isArray(errors.detail) && errors.detail.length) return String(errors.detail[0]);
  if (typeof errors.message === "string") return errors.message;
  for (const value of Object.values(errors)) {
    if (typeof value === "string" && value) return value;
    if (Array.isArray(value) && value.length) return String(value[0]);
  }
  if (typeof data.message === "string") return data.message;
  return "Request failed";
}

export async function api(path, options = {}) {
  const res = await apiFetch(path, options);
  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json().catch(() => ({})) : {};

  if (!res.ok || data?.success === false) {
    const err = new Error(extractError(data));
    err.status = res.status;
    err.errors = data?.errors || {};
    throw err;
  }
  return data && typeof data === "object" && "data" in data ? data.data : data;
}

export const API_BASE_URL = API_BASE;