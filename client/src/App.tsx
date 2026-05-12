import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  isToday,
  isPast,
} from "date-fns";

import type { Lead } from "./types/lead";

import { getLeads } from "./services/api";

import LeadCard from "./components/LeadCard";

import { LeadTimelineModal } from "./components/LeadTimelineModal";

import { AddLeadModal } from "./components/AddLeadModal";

const statuses = [
  "ALL",
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
];

export default function App() {
  const [leads, setLeads] =
    useState<Lead[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedLead, setSelectedLead] =
    useState<Lead | null>(null);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  async function fetchLeads() {
    try {
      const data =
        await getLeads();

      setLeads(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

 useEffect(() => {
  const loadLeads = async () => {
    await fetchLeads();
  };

  loadLeads();
}, []);

  const filteredLeads =
    useMemo(() => {
      return leads.filter(
        (lead) => {
          const matchesSearch =
            lead.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesStatus =
            statusFilter ===
            "ALL"
              ? true
              : lead.status ===
                statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      leads,
      search,
      statusFilter,
    ]);

  const todayFollowUps =
    filteredLeads.filter(
      (lead) =>
        lead.followUpAt &&
        isToday(
          new Date(
            lead.followUpAt
          )
        )
    );

  const overdueLeads =
    filteredLeads.filter(
      (lead) =>
        lead.followUpAt &&
        isPast(
          new Date(
            lead.followUpAt
          )
        ) &&
        !isToday(
          new Date(
            lead.followUpAt
          )
        )
    );

  const remainingLeads =
    filteredLeads.filter(
      (lead) => {
        const today =
          todayFollowUps.some(
            (item) =>
              item.id ===
              lead.id
          );

        const overdue =
          overdueLeads.some(
            (item) =>
              item.id ===
              lead.id
          );

        return !today && !overdue;
      }
    );

  return (
    <div className="min-h-screen bg-slate-100">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          
          <div>
            <h1 className="text-4xl font-black text-slate-900">
              LeadFlow CRM
            </h1>

            <p className="text-slate-500 mt-2">
              Lightweight Lead Management Dashboard
            </p>
          </div>

          <AddLeadModal
            onCreated={
              fetchLeads
            }
          />
        </div>
      </div>

      {/* FILTERS */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col md:flex-row gap-4 shadow-sm">
          
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="
              flex-1
              border border-slate-300
              rounded-2xl
              px-5 py-4
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="
              border border-slate-300
              rounded-2xl
              px-5 py-4
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            {statuses.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status.replaceAll(
                    "_",
                    " "
                  )}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        
        {/* TODAY FOLLOW UPS */}
        {todayFollowUps.length >
          0 && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-3 w-3 rounded-full bg-blue-500" />

              <h2 className="text-2xl font-bold text-slate-900">
                Today's Follow-ups
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {todayFollowUps.map(
                (lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onClick={() =>
                      setSelectedLead(
                        lead
                      )
                    }
                  />
                )
              )}
            </div>
          </section>
        )}

        {/* OVERDUE */}
        {overdueLeads.length >
          0 && (
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-3 w-3 rounded-full bg-red-500" />

              <h2 className="text-2xl font-bold text-red-600">
                Overdue Follow-ups
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {overdueLeads.map(
                (lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onClick={() =>
                      setSelectedLead(
                        lead
                      )
                    }
                  />
                )
              )}
            </div>
          </section>
        )}

        {/* ALL LEADS */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-3 w-3 rounded-full bg-slate-400" />

            <h2 className="text-2xl font-bold text-slate-900">
              All Leads
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-20 text-slate-500">
              Loading leads...
            </div>
          ) : remainingLeads.length ===
            0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 py-20 text-center">
              <h2 className="text-xl font-semibold text-slate-700">
                No leads found
              </h2>

              <p className="text-slate-500 mt-2">
                Try changing filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {remainingLeads.map(
                (lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onClick={() =>
                      setSelectedLead(
                        lead
                      )
                    }
                  />
                )
              )}
            </div>
          )}
        </section>
      </div>

      {/* MODAL */}
      {selectedLead && (
        <LeadTimelineModal
          lead={selectedLead}
          onClose={() =>
            setSelectedLead(null)
          }
          onUpdated={
            fetchLeads
          }
        />
      )}
    </div>
  );
}