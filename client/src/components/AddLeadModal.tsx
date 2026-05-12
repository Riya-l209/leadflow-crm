import { useState } from "react";
import { createLead } from "../services/api";

interface Props {
  onCreated: () => void;
}

export function AddLeadModal({
  onCreated,
}: Props) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      setLoading(true);

      await createLead({
        name,
        company,
        phone,
      });

      setName("");
      setCompany("");
      setPhone("");

      setOpen(false);

      onCreated();
    } catch (error) {
      console.error(error);
      alert("Failed to create lead");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-black text-white px-4 py-2 rounded-xl"
      >
        + Add Lead
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Add New Lead
          </h2>

          <button
            onClick={() => setOpen(false)}
            className="text-slate-500"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm mb-1">
              Name *
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Company
            </label>

            <input
              value={company}
              onChange={(e) =>
                setCompany(e.target.value)
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Phone
            </label>

            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full border border-slate-300 rounded-xl px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-xl"
          >
            {loading
              ? "Creating..."
              : "Create Lead"}
          </button>
        </form>
      </div>
    </div>
  );
}