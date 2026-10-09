import { api } from "./client";

export function submitSafeguardingReport(payload) {
  return api("/safeguarding/submit/", { method: "POST", body: JSON.stringify(payload) });
}

export function listSafeguardingReports(params = "") {
  return api(`/safeguarding/reports/${params}`);
}

export function getSafeguardingReport(id) {
  return api(`/safeguarding/reports/${encodeURIComponent(id)}/`);
}

export function updateSafeguardingReport(id, payload) {
  return api(`/safeguarding/reports/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function listSafeguardingNotes(params = "") {
  return api(`/safeguarding/notes/${params}`);
}

export function createSafeguardingNote(payload) {
  return api("/safeguarding/notes/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}