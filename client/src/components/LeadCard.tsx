import { formatDistanceToNow } from "date-fns";

import type { Lead } from "../types/lead";

import { getStatusColor } from "../utils/statusColor";

interface Props {
  lead: Lead;
  onClick: () => void;
  isTodayFollowUp?: boolean;
  isOverdue?: boolean;
}

export function LeadCard({
  lead,
  onClick,
  isTodayFollowUp,
  isOverdue,
}: Props) {
  const latestDiscussion =
    lead.discussions[0];

  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-xl p-4 shadow-sm border transition text-left hover:shadow-md ${
        isOverdue
          ? "border-red-500"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg">
              {lead.name}
            </h2>

            {isTodayFollowUp && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Today
              </span>
            )}

            {isOverdue && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                Overdue
              </span>
            )}
          </div>

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
          {lead.status.replace(
            "_",
            " "
          )}
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
                new Date(
                  latestDiscussion.createdAt
                ),
                {
                  addSuffix: true,
                }
              )
            : "Just added"}
        </p>

        {lead.followUpAt && (
          <p className="text-xs text-slate-500 mt-2">
            Follow-up:{" "}
            {new Date(
              lead.followUpAt
            ).toLocaleString()}
          </p>
        )}
      </div>
    </button>
  );
}