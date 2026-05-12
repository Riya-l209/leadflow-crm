import type { Lead } from "../types/lead";

const API_BASE = "/api";

export async function getLeads(): Promise<Lead[]> {
  const response = await fetch(`${API_BASE}/leads`);

  if (!response.ok) {
    throw new Error("Failed to fetch leads");
  }

  return response.json();
}