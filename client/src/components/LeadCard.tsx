import { formatDistanceToNow } from "date-fns";
import type { Lead } from "../types/lead";
import { getStatusColor } from "../utils/statusColor";

interface Props {
  lead: Lead;
}

export function LeadCard({ lead }: Props) {
  const latestDiscussion = lead.discussions[0];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-lg">
            {lead.name}
          </h2>

          {lead.company && (
            <p className="text-sm text-slate-500">
              {lead.company}
            </p>
          )}
        </div>

        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            lead.status
          )}`}
        >
          {lead.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-sm text-slate-700">
          {latestDiscussion
            ? latestDiscussion.note
            : "No discussions yet"}
        </p>

        <p className="text-xs text-slate-400 mt-2">
          {latestDiscussion
            ? formatDistanceToNow(
                new Date(latestDiscussion.createdAt),
                { addSuffix: true }
              )
            : "Just added"}
        </p>
      </div>
    </div>
  );
}