import { api } from "./client";

export function listOpportunities(params = "") {
  return api(`/volunteers/opportunities/${params}`);
}

export function getOpportunity(id) {
  return api(`/volunteers/opportunities/${encodeURIComponent(id)}/`);
}

export function createOpportunity(payload) {
  return api("/volunteers/opportunities/", { method: "POST", body: JSON.stringify(payload) });
}

export function updateOpportunity(id, payload) {
  return api(`/volunteers/opportunities/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteOpportunity(id) {
  return api(`/volunteers/opportunities/${encodeURIComponent(id)}/`, { method: "DELETE" });
}

export function submitApplication(payload) {
  return api("/volunteers/applications/submit/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listApplications(params = "") {
  return api(`/volunteers/applications/${params}`);
}

export function getApplication(id) {
  return api(`/volunteers/applications/${encodeURIComponent(id)}/`);
}

export function updateApplication(id, payload) {
  return api(`/volunteers/applications/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}