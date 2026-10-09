import { api } from "./client";

export function createPartnershipEnquiry(payload) {
  return api("/partnerships/", { method: "POST", body: JSON.stringify(payload) });
}

export function listPartnershipEnquiries(params = "") {
  return api(`/partnerships/${params}`);
}

export function getPartnershipEnquiry(id) {
  return api(`/partnerships/${encodeURIComponent(id)}/`);
}

export function updatePartnershipEnquiry(id, payload) {
  return api(`/partnerships/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}