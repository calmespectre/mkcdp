const AUTH_API =
  import.meta.env.VITE_API_URL ||
  "https://mkcdp-backend.onrender.com/api/auth";

const API_BASE = AUTH_API.replace(/\/auth\/?$/, "");

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
    const response = await fetch(`${AUTH_API.replace(/\/$/, "")}/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearTokens();
      }

      return false;
    }

    const data = await response.json();

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

  let response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const refreshed = await tryRefresh();

    if (refreshed) {
      syncTokens();

      headers.set("Authorization", `Bearer ${accessToken}`);

      response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
      });
    }
  }

  return response;
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
  const response = await apiFetch(path, options);

  const isJson = (
    response.headers.get("content-type") || ""
  ).includes("application/json");

  const data = isJson
    ? await response.json().catch(() => ({}))
    : {};

  if (!response.ok || data?.success === false) {
    const error = new Error(extractError(data));

    error.status = response.status;
    error.errors = data?.errors || {};

    throw error;
  }

  return data && typeof data === "object" && "data" in data
    ? data.data
    : data;
}

export const API_BASE_URL = API_BASE;