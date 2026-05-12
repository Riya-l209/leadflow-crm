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
      className={`
        group
        bg-white
        rounded-2xl
        p-5
        border
        text-left
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-200
        ${
          isOverdue
            ? "border-red-400"
            : "border-slate-200"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold text-slate-800">
              {lead.name}
            </h2>

            {isTodayFollowUp && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Today
              </span>
            )}

            {isOverdue && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                Overdue
              </span>
            )}
          </div>

          {lead.company && (
            <p className="text-sm text-slate-500 mt-1">
              {lead.company}
            </p>
          )}
        </div>

        <span
          className={`
            px-3 py-1
            rounded-full
            text-xs
            font-semibold
            whitespace-nowrap
            ${getStatusColor(
              lead.status
            )}
          `}
        >
          {lead.status.replaceAll(
            "_",
            " "
          )}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-sm text-slate-700 line-clamp-2">
          {latestDiscussion
            ? latestDiscussion.note
            : "No discussions yet"}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
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
            <p className="text-xs font-medium text-slate-500">
              Follow-up:
              {" "}
              {new Date(
                lead.followUpAt
              ).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}