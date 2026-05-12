import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
    const load = async () => {
      await fetchLeads();
    };

    load();
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

  return (
    <div className="min-h-screen bg-slate-100">
      
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              LeadFlow CRM
            </h1>

            <p className="text-slate-500 mt-1">
              Lightweight Lead
              Management Dashboard
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
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4">
          
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
              rounded-xl
              px-4 py-3
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
              rounded-xl
              px-4 py-3
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

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            Loading leads...
          </div>
        ) : filteredLeads.length ===
          0 ? (
          <div className="bg-white border border-dashed border-slate-300 rounded-3xl py-20 text-center">
            <h2 className="text-xl font-semibold text-slate-700">
              No leads found
            </h2>

            <p className="text-slate-500 mt-2">
              Try adjusting search
              or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredLeads.map(
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