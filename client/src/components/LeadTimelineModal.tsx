import { useState } from "react";
import { format } from "date-fns";

import type { Lead } from "../types/lead";
import {
  addDiscussion,
  updateLead,
} from "../services/api";

interface Props {
  lead: Lead;
  onClose: () => void;
  onUpdated: () => Promise<void>;
}

const statuses = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
] as const;

export function LeadTimelineModal({
  lead,
  onClose,
  onUpdated,
}: Props) {
  const [note, setNote] =
    useState("");

  const [followUpAt, setFollowUpAt] =
    useState("");

  const [status, setStatus] =
    useState(lead.status);

  const [loading, setLoading] =
    useState(false);

  async function handleSave() {
    if (!note.trim()) return;

    try {
      setLoading(true);

      await addDiscussion(
        lead.id,
        {
          note,
          followUpAt:
            followUpAt || undefined,
        }
      );

      await updateLead(
        lead.id,
        { status }
      );

      await onUpdated();
      onClose();
    } catch (error) {
      console.error(error);
      alert(
        "Failed to save discussion"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">
              {lead.name}
            </h2>
            <p className="text-slate-500">
              {lead.company ||
                "No company"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-xl"
          >
            ✕
          </button>
        </div>

        {/* Timeline */}
        <div className="max-h-[350px] overflow-y-auto p-6 bg-slate-50 space-y-4">
          {lead.discussions?.length ? (
            [...lead.discussions]
              .reverse()
              .map((d) => (
                <div
                  key={d.id}
                  className="flex gap-4"
                >
                  <div className="w-3 h-3 mt-2 rounded-full bg-blue-500" />

                  <div className="bg-white border rounded-2xl p-4 flex-1">
                    <p className="text-slate-800">
                      {d.note}
                    </p>

                    <p className="text-xs text-slate-400 mt-2">
                      {format(
                        new Date(
                          d.createdAt
                        ),
                        "dd MMM yyyy, hh:mm a"
                      )}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              No discussions yet
            </div>
          )}
        </div>

        {/* Form */}
        <div className="p-6 border-t border-slate-200 space-y-4">

          <textarea
            placeholder="Add discussion note..."
            value={note}
            onChange={(e) =>
              setNote(
                e.target.value
              )
            }
            className="w-full min-h-[120px] border rounded-2xl px-4 py-3"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="datetime-local"
              value={followUpAt}
              onChange={(e) =>
                setFollowUpAt(
                  e.target.value
                )
              }
              className="border rounded-xl px-4 py-3"
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target
                    .value as typeof statuses[number]
                )
              }
              className="border rounded-xl px-4 py-3"
            >
              {statuses.map(
                (s) => (
                  <option
                    key={s}
                    value={s}
                  >
                    {s.replaceAll(
                      "_",
                      " "
                    )}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-black text-white rounded-xl py-3"
          >
            {loading
              ? "Saving..."
              : "Save Discussion"}
          </button>
        </div>
      </div>
    </div>
  );
}