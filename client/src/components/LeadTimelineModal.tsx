import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

import type { Lead } from "../types/lead";

import {
  addDiscussion,
  updateLeadStatus,
} from "../services/api";

import { getStatusColor } from "../utils/statusColor";

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
  const [note, setNote] =
    useState("");

  const [followUpAt, setFollowUpAt] =
    useState("");

  const [status, setStatus] =
    useState<Lead["status"]>(
      lead.status
    );

  const [loading, setLoading] =
    useState(false);

  async function handleAddDiscussion(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!note.trim()) return;

    try {
      setLoading(true);

      await addDiscussion(lead.id, {
        note,
        followUpAt:
          followUpAt || undefined,
      });

      try {
        await updateLeadStatus(
          lead.id,
          status
        );
      } catch (error) {
        console.error(error);
      }

      setNote("");
      setFollowUpAt("");

      await onUpdated();
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* HEADER */}
        <div className="border-b border-slate-200 p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-slate-800">
                {lead.name}
              </h2>

              <span
                className={`
                  px-3 py-1 rounded-full text-xs font-semibold
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

            <div className="mt-2 text-sm text-slate-500 space-y-1">
              {lead.company && (
                <p>
                  Company:
                  {" "}
                  {lead.company}
                </p>
              )}

              {lead.phone && (
                <p>
                  Phone:
                  {" "}
                  {lead.phone}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              h-10 w-10
              rounded-full
              bg-slate-100
              hover:bg-slate-200
              text-slate-600
              text-lg
              flex items-center justify-center
            "
          >
            ✕
          </button>
        </div>

        {/* DISCUSSIONS */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="space-y-4">
            {lead.discussions.length ===
            0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center">
                <p className="text-slate-500">
                  No discussions yet
                </p>
              </div>
            ) : (
              lead.discussions.map(
                (discussion) => (
                  <div
                    key={discussion.id}
                    className="
                      bg-white
                      border border-slate-200
                      rounded-2xl
                      p-4
                      shadow-sm
                    "
                  >
                    <p className="text-slate-700 leading-relaxed">
                      {
                        discussion.note
                      }
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-slate-400">
                        {formatDistanceToNow(
                          new Date(
                            discussion.createdAt
                          ),
                          {
                            addSuffix: true,
                          }
                        )}
                      </p>

                      {discussion.followUpAt && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Follow-up scheduled
                        </span>
                      )}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={
            handleAddDiscussion
          }
          className="border-t border-slate-200 bg-white p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Lead Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target
                    .value as Lead["status"]
                )
              }
              className="
                w-full
                rounded-xl
                border border-slate-300
                px-4 py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
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
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Discussion Note
            </label>

            <textarea
              value={note}
              onChange={(e) =>
                setNote(
                  e.target.value
                )
              }
              placeholder="Write discussion details..."
              required
              className="
                w-full
                min-h-[120px]
                rounded-xl
                border border-slate-300
                px-4 py-3
                outline-none
                resize-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700">
              Follow-up Date & Time
            </label>

            <input
              type="datetime-local"
              value={followUpAt}
              onChange={(e) =>
                setFollowUpAt(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border border-slate-300
                px-4 py-3
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-black
              text-white
              py-3
              font-medium
              hover:opacity-90
              disabled:opacity-50
            "
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