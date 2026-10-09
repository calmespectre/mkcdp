import { api } from "./client";

export function getDashboardStats() {
  return api("/dashboard/stats/");
}