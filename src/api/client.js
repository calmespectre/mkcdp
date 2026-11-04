const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://mkcdp-backend.onrender.com/api";

const ACCESS_KEY = "mkcdp.access";
const REFRESH_KEY = "mkcdp.refresh";

let accessToken = "";
let refreshToken = "";

function syncTokens() {
  if (typeof window === "undefined") return;

  accessToken = localStorage.getItem(ACCESS_KEY) || "";
  refreshToken = localStorage.getItem(REFRESH_KEY) || "";
}

export function setTokens({ access, refresh }) {
  if (access !== undefined) {
    accessToken = access || "";

    if (accessToken) {
      localStorage.setItem(ACCESS_KEY, accessToken);
    } else {
      localStorage.removeItem(ACCESS_KEY);
    }
  }

  if (refresh !== undefined) {
    refreshToken = refresh || "";

    if (refreshToken) {
      localStorage.setItem(REFRESH_KEY, refreshToken);
    } else {
      localStorage.removeItem(REFRESH_KEY);
    }
  }
}

export function clearTokens() {
  accessToken = "";
  refreshToken = "";

  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
}

export function getAccessToken() {
  syncTokens();
  return accessToken;
}

async function tryRefresh() {
  syncTokens();

  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (!res.ok) return false;

    const data = await res.json();

    if (!data.access) return false;

    setTokens({
      access: data.access,
      refresh: data.refresh || refreshToken,
    });

    return true;
  } catch {
    return false;
  }
}

export async function apiFetch(path, options = {}) {
  syncTokens();

  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body) {
    if (!(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    const refreshed = await tryRefresh();

    if (refreshed) {
      headers.set("Authorization", `Bearer ${accessToken}`);

      res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
      });
    }
  }

  return res;
}

function extractError(data) {
  if (!data) return "Request failed";

  const errors =
    data.errors && typeof data.errors === "object"
      ? data.errors
      : data;

  if (typeof errors.detail === "string") {
    return errors.detail;
  }

  if (Array.isArray(errors.detail) && errors.detail.length) {
    return String(errors.detail[0]);
  }

  if (typeof errors.message === "string") {
    return errors.message;
  }

  for (const value of Object.values(errors)) {
    if (typeof value === "string" && value) {
      return value;
    }

    if (Array.isArray(value) && value.length) {
      return String(value[0]);
    }
  }

  return data.message || "Request failed";
}

export async function api(path, options = {}) {
  const res = await apiFetch(path, options);

  const isJson = (
    res.headers.get("content-type") || ""
  ).includes("application/json");

  const data = isJson
    ? await res.json().catch(() => ({}))
    : {};

  if (!res.ok || data?.success === false) {
    const err = new Error(extractError(data));

    err.status = res.status;
    err.errors = data?.errors || {};

    throw err;
  }

  return data &&
    typeof data === "object" &&
    "data" in data
    ? data.data
    : data;
}

export const API_BASE_URL = API_BASE;