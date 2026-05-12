import {
  formatDistanceToNow,
  isPast,
  isToday,
} from "date-fns";

import type { Lead } from "../types/lead";

interface Props {
  lead: Lead;
  onClick: () => void;
}

const statusColors: Record<
  string,
  string
> = {
  NEW: "bg-green-100 text-green-700",

  CONTACTED:
    "bg-yellow-100 text-yellow-700",

  QUALIFIED:
    "bg-blue-100 text-blue-700",

  PROPOSAL_SENT:
    "bg-purple-100 text-purple-700",

  WON: "bg-slate-200 text-slate-700",

  LOST: "bg-red-100 text-red-700",
};

export default function LeadCard({
  lead,
  onClick,
}: Props) {
  const latestDiscussion =
    lead.discussions?.[
      lead.discussions.length - 1
    ];

  const overdue =
    lead.followUpAt &&
    isPast(
      new Date(lead.followUpAt)
    ) &&
    !isToday(
      new Date(lead.followUpAt)
    );

  const todayFollowUp =
    lead.followUpAt &&
    isToday(
      new Date(lead.followUpAt)
    );

  return (
    <div
      onClick={onClick}
      className={`
        bg-white
        border
        rounded-3xl
        p-6
        cursor-pointer
        transition-all
        hover:-translate-y-1
        hover:shadow-xl
        ${
          overdue
            ? "border-red-300"
            : todayFollowUp
            ? "border-blue-300"
            : "border-slate-200"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-slate-900 truncate">
            {lead.name}
          </h2>

          {lead.company && (
            <p className="text-slate-500 mt-2 text-sm truncate">
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
            ${
              statusColors[
                lead.status
              ]
            }
          `}
        >
          {lead.status.replaceAll(
            "_",
            " "
          )}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-sm text-slate-700 line-clamp-2">
          <span className="font-semibold">
            Last Note:
          </span>{" "}
          {latestDiscussion?.note ||
            "No discussions yet"}
        </p>

        {latestDiscussion?.createdAt && (
          <p className="text-xs text-slate-400 mt-2">
            {formatDistanceToNow(
              new Date(
                latestDiscussion.createdAt
              ),
              {
                addSuffix: true,
              }
            )}
          </p>
        )}

        {todayFollowUp && (
          <div className="mt-4 text-sm font-medium text-blue-600">
            🔔 Follow-up Today
          </div>
        )}

        {overdue && (
          <div className="mt-4 text-sm font-medium text-red-600">
            ⚠ Overdue Follow-up
          </div>
        )}
      </div>
    </div>
  );
}