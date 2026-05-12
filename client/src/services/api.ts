import type { Lead } from "../types/lead";

export async function getLeads(): Promise<Lead[]> {
  const response = await fetch(
    "http://localhost:4000/api/leads"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch leads");
  }

  return response.json();
}

export async function createLead(data: {
  name: string;
  company?: string;
  phone?: string;
}) {
  const response = await fetch(
    "http://localhost:4000/api/leads",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create lead");
  }

  return response.json();
}