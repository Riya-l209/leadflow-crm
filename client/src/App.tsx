import { useEffect, useState } from "react";
import type { Lead } from "./types/lead";
import { getLeads } from "./services/api";
import { LeadCard } from "./components/LeadCard";

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeads() {
      try {
        const data = await getLeads();
        setLeads(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLeads();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            LeadFlow
          </h1>

          <p className="text-slate-500 mt-1">
            Lightweight lead management CRM
          </p>
        </div>

        {loading ? (
          <p>Loading leads...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;