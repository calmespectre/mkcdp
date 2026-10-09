import { api } from "./client";

export function listNeeds(params = "") {
  return api(`/gifts/needs/${params}`);
}

export function getNeed(id) {
  return api(`/gifts/needs/${encodeURIComponent(id)}/`);
}

export function createNeed(payload) {
  return api("/gifts/needs/", { method: "POST", body: JSON.stringify(payload) });
}

export function updateNeed(id, payload) {
  return api(`/gifts/needs/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteNeed(id) {
  return api(`/gifts/needs/${encodeURIComponent(id)}/`, { method: "DELETE" });
}

export function createGiftOrder(payload) {
  return api("/gifts/orders/create/", { method: "POST", body: JSON.stringify(payload) });
}

export function listGiftOrders(params = "") {
  return api(`/gifts/orders/${params}`);
}

export function getGiftOrder(id) {
  return api(`/gifts/orders/${encodeURIComponent(id)}/`);
}