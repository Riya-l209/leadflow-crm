import { useState } from "react";

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

      await updateLead(lead.id, {
        status,
      });

      setNote("");
      setFollowUpAt("");

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
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {lead.name}
            </h2>

            <p className="text-slate-500 mt-1">
              {lead.company ||
                "No company"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        {/* DISCUSSIONS */}
        <div className="p-6 max-h-[400px] overflow-y-auto bg-slate-50 space-y-4">
          {lead.discussions &&
          lead.discussions.length >
            0 ? (
            [...lead.discussions]
              .reverse()
              .map((discussion) => (
                <div
                  key={discussion.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4"
                >
                  <p className="text-slate-800">
                    {discussion.note}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(
                      discussion.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              ))
          ) : (
            <div className="text-center text-slate-500 py-10">
              No discussions yet
            </div>
          )}
        </div>

        {/* FORM */}
        <div className="border-t border-slate-200 p-6 space-y-4">
          
          <textarea
            value={note}
            onChange={(e) =>
              setNote(
                e.target.value
              )
            }
            placeholder="Add discussion note..."
            className="w-full min-h-[120px] border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <input
              type="datetime-local"
              value={followUpAt}
              onChange={(e) =>
                setFollowUpAt(
                  e.target.value
                )
              }
              className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target
                    .value as typeof statuses[number]
                )
              }
              className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statuses.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item.replaceAll(
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
            className="w-full bg-black text-white rounded-xl py-3 font-medium hover:opacity-90 disabled:opacity-50"
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