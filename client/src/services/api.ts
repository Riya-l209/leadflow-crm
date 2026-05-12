import type { Lead } from "../types/lead";

const API_URL =
  "http://localhost:4000/api";

export async function getLeads(): Promise<
  Lead[]
> {
  const response = await fetch(
    `${API_URL}/leads`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch leads"
    );
  }

  return response.json();
}

export async function createLead(data: {
  name: string;
  company?: string;
  phone?: string;
}) {
  const response = await fetch(
    `${API_URL}/leads`,
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

export async function addDiscussion(
  leadId: string,
  data: {
    note: string;
    followUpAt?: string;
  }
) {
  const response = await fetch(
    `${API_URL}/leads/${leadId}/discussions`,
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
      "Failed to add discussion"
    );
  }

  return response.json();
}

export async function updateLeadStatus(
  leadId: string,
  status: string
) {
  const response = await fetch(
    `${API_URL}/leads/${leadId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update lead"
    );
  }

  return response.json();
}