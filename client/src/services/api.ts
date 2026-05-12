import type { Lead } from "../types/lead";

const BASE_URL =
  "http://localhost:4000/api";
export async function getLeads(): Promise<Lead[]> {
  const response = await fetch(
    `${BASE_URL}/leads`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch leads"
    );
  }

  return response.json();
}

export async function createLead(
  data: {
    name: string;
    company?: string;
    phone?: string;
  }
) {
  const response = await fetch(
    `${BASE_URL}/leads`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create lead"
    );
  }

  return response.json();
}


export async function updateLead(
  id: string,
  data: {
    status?: string;
    followUpAt?: string;
  }
) {
  const response = await fetch(
    `${BASE_URL}/leads/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update lead");
  }

  return response.json();
}

export async function addDiscussion(
  leadId: string,
  data: {
    note: string;
    followUpAt?: string;
  }
) {
  const response = await fetch(
    `${BASE_URL}/leads/${leadId}/discussions`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to save discussion"
    );
  }

  return response.json();
}