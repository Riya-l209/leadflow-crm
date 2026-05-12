import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

import type { Lead } from "../types/lead";

import {
  addDiscussion,
  updateLeadStatus,
} from "../services/api";

interface Props {
  lead: Lead;
  onClose: () => void;
  onUpdated: () => void;
}

export function LeadTimelineModal({
  lead,
  onClose,
  onUpdated,
}: Props) {
  const [note, setNote] = useState("");

  const [followUpAt, setFollowUpAt] =
    useState("");

  const [status, setStatus] = useState<
    Lead["status"]
  >(lead.status);

  const [loading, setLoading] =
    useState(false);

  async function handleAddDiscussion(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!note.trim()) return;

    try {
      setLoading(true);

      // STEP 1: SAVE DISCUSSION
      await addDiscussion(lead.id, {
        note,
        followUpAt:
          followUpAt || undefined,
      });

      // STEP 2: TRY STATUS UPDATE
      try {
        await updateLeadStatus(
          lead.id,
          status
        );
      } catch (error) {
        console.error(
          "Status update failed:",
          error
        );
      }

      // RESET FORM
      setNote("");
      setFollowUpAt("");

      // REFRESH UI
      await onUpdated();
    } catch (error) {
      console.error(error);

      alert("Failed to save discussion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
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
            className="text-slate-500 text-xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {lead.discussions.length ===
          0 ? (
            <p className="text-slate-500">
              No discussions yet
            </p>
          ) : (
            lead.discussions.map(
              (discussion) => (
                <div
                  key={discussion.id}
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <p className="text-slate-800">
                    {discussion.note}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    {formatDistanceToNow(
                      new Date(
                        discussion.createdAt
                      ),
                      {
                        addSuffix: true,
                      }
                    )}
                  </p>
                </div>
              )
            )
          )}
        </div>

        <form
          onSubmit={
            handleAddDiscussion
          }
          className="border-t border-slate-200 p-6 space-y-4"
        >
          <div>
            <label className="block text-sm mb-1">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target
                    .value as Lead["status"]
                )
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
            >
              <option value="NEW">
                New
              </option>

              <option value="CONTACTED">
                Contacted
              </option>

              <option value="QUALIFIED">
                Qualified
              </option>

              <option value="PROPOSAL_SENT">
                Proposal Sent
              </option>

              <option value="WON">
                Won
              </option>

              <option value="LOST">
                Lost
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">
              Discussion Note
            </label>

            <textarea
              value={note}
              onChange={(e) =>
                setNote(
                  e.target.value
                )
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2 min-h-[100px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Follow-up Date &
              Time
            </label>

            <input
              type="datetime-local"
              value={followUpAt}
              onChange={(e) =>
                setFollowUpAt(
                  e.target.value
                )
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            {loading
              ? "Saving..."
              : "Save Discussion"}
          </button>
        </form>
      </div>
    </div>
  );
}