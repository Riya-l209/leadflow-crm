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
        group
        bg-white
        border
        border-slate-200
        rounded-3xl
        p-6
        cursor-pointer
        transition-all
        duration-300
        hover:shadow-xl
        hover:-translate-y-1
        ${
          todayFollowUp
            ? "border-blue-300 bg-blue-50"
            : ""
        }
      `}
    >
      {/* TOP */}
      <div className="flex items-start justify-between gap-4">
        
        <div>
          <h2 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {lead.name}
          </h2>

          {lead.company && (
            <p className="text-slate-500 mt-2 text-sm">
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

      {/* CONTENT */}
      <div className="mt-6">
        
        <p className="text-sm text-slate-700 leading-relaxed">
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

        {lead.followUpAt && (
          <div
            className={`
              mt-5
              text-sm
              font-medium
              ${
                overdue
                  ? "text-red-600"
                  : todayFollowUp
                  ? "text-blue-600"
                  : "text-slate-600"
              }
            `}
          >
            {overdue &&
              "⚠ Overdue Follow-up"}

            {todayFollowUp &&
              "🔔 Follow-up Today"}
          </div>
        )}
      </div>
    </div>
  );
}