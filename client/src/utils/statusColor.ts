export function getStatusColor(
  status: string
) {
  switch (status) {
    case "NEW":
      return "bg-slate-100 text-slate-700";

    case "CONTACTED":
      return "bg-blue-100 text-blue-700";

    case "QUALIFIED":
      return "bg-yellow-100 text-yellow-700";

    case "PROPOSAL_SENT":
      return "bg-purple-100 text-purple-700";

    case "WON":
      return "bg-green-100 text-green-700";

    case "LOST":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}