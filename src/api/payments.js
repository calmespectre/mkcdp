import { api } from "./client";

export function getPaymentStatus(reference) {
  return api(`/payments/status/${encodeURIComponent(reference)}/`);
}

export function listPayments(params = "") {
  return api(`/payments/${params}`);
}

export function verifyBankTransfer(reference, payload) {
  return api(`/payments/bank/${encodeURIComponent(reference)}/verify/`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPendingBankTransfers() {
  return api("/payments/bank/pending/");
}