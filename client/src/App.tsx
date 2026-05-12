import { useEffect, useState } from "react";
import type { Lead } from "./types/lead";

import { getLeads } from "./services/api";

import { LeadCard } from "./components/LeadCard";
import { AddLeadModal } from "./components/AddLeadModal";
import { LeadTimelineModal } from "./components/LeadTimelineModal";

function App() {
  const [leads, setLeads] = useState<Lead[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  const [selectedLead, setSelectedLead] =
    useState<Lead | null>(null);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  async function refreshLeads() {
    try {
      const data = await getLeads();

      setLeads(data);

      if (selectedLead) {
        const updatedLead = data.find(
          (lead) =>
            lead.id === selectedLead.id
        );

        if (updatedLead) {
          setSelectedLead(updatedLead);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function fetchLeads() {
      try {
        const data = await getLeads();

        if (!mounted) return;

        setLeads(data);
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchLeads();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredLeads = leads.filter(
    (lead) => {
      const matchesSearch = lead.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL"
          ? true
          : lead.status === statusFilter;

      return (
        matchesSearch && matchesStatus
      );
    }
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              LeadFlow
            </h1>

            <p className="text-slate-500 mt-1">
              Lightweight lead management CRM
            </p>
          </div>

          <AddLeadModal
            onCreated={refreshLeads}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 px-4 py-2 rounded-xl border border-slate-300 bg-white"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white"
          >
            <option value="ALL">
              All Statuses
            </option>

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

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() =>
                  setSelectedLead(lead)
                }
              />
            ))}
          </div>
        )}
      </div>

      {selectedLead && (
        <LeadTimelineModal
          lead={selectedLead}
          onClose={() =>
            setSelectedLead(null)
          }
          onUpdated={refreshLeads}
        />
      )}
    </div>
  );
}

export default App;