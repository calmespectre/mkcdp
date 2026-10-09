import { api } from "./client";

export function loadContent(prefix = "") {
  const q = prefix ? `?prefix=${encodeURIComponent(prefix)}` : "";
  return api(`/content/bulk/${q}`);
}

export function getContent(key) {
  return api(`/content/${encodeURIComponent(key)}/`);
}

export function updateContent(key, value) {
  return api(`/content/${encodeURIComponent(key)}/`, {
    method: "PATCH",
    body: JSON.stringify({ value }),
  });
}

export function bulkUpdateContent(payload) {
  return api("/content/bulk-update/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listContentRevisions(params = "") {
  return api(`/content/revisions/${params}`);
}