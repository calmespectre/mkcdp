import { api } from "./client";

export function createDonation(payload) {
  return api("/donations/create/", { method: "POST", body: JSON.stringify(payload) });
}

export function listDonations(params = "") {
  return api(`/donations/${params}`);
}

export function getMyDonations() {
  return api("/donations/mine/");
}

export function getDonationStatus(reference) {
  return api(`/payments/status/${encodeURIComponent(reference)}/`);
}