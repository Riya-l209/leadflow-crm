import type { LeadStatus } from "../types/lead";

export function getStatusColor(status: LeadStatus) {
  switch (status) {
    case "NEW":
      return "bg-gray-200 text-gray-800";

    case "CONTACTED":
      return "bg-blue-100 text-blue-700";

    case "QUALIFIED":
      return "bg-purple-100 text-purple-700";

    case "PROPOSAL_SENT":
      return "bg-yellow-100 text-yellow-700";

    case "WON":
      return "bg-green-100 text-green-700";

    case "LOST":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-200 text-gray-800";
  }
}