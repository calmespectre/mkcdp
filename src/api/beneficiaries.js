import { api } from "./client";

export function listBeneficiaries(params = "") {
  return api(`/beneficiaries/${params}`);
}

export function getBeneficiary(id) {
  return api(`/beneficiaries/${encodeURIComponent(id)}/`);
}

export function createBeneficiary(payload) {
  return api("/beneficiaries/", { method: "POST", body: JSON.stringify(payload) });
}

export function updateBeneficiary(id, payload) {
  return api(`/beneficiaries/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteBeneficiary(id) {
  return api(`/beneficiaries/${encodeURIComponent(id)}/`, { method: "DELETE" });
}

export function listSponsorships(params = "") {
  return api(`/beneficiaries/sponsorships/${params}`);
}

export function createSponsorship(payload) {
  return api("/beneficiaries/sponsorships/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}