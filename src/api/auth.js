import { api, setTokens, clearTokens } from "./client";

export async function signup(payload) {
  const data = await api("/auth/signup/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
}

export async function signin(email, password) {
  const data = await api("/auth/signin/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data;
}

export async function verify(email, code) {
  const data = await api("/auth/verify/", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
  if (data?.tokens) setTokens(data.tokens);
  return data;
}

export function resend(email, purpose = "signin") {
  return api("/auth/resend/", {
    method: "POST",
    body: JSON.stringify({ email, purpose }),
  });
}

export async function logout() {
  try {
    await api("/auth/logout/", { method: "POST" });
  } catch {}
  clearTokens();
}

export function me() {
  return api("/auth/me/");
}

export function updateMe(payload) {
  return api("/auth/me/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}