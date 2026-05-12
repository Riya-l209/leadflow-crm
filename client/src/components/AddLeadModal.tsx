import { useState } from "react";
import { createLead } from "../services/api";

interface Props {
  onCreated: () => void;
}

export function AddLeadModal({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      setLoading(true);

      await createLead({ name, company, phone });

      setName("");
      setCompany("");
      setPhone("");

      setOpen(false);
      await onCreated();
    } catch (error) {
      console.error(error);
      alert("Failed to create lead");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="bg-black text-white px-5 py-3 rounded-xl font-medium hover:opacity-90"
      >
        + Add Lead
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-sm">
          
          {/* POSITION WRAPPER (pushes modal down) */}
          <div className="w-full flex justify-center mt-32 px-4">
            
            {/* MODAL BOX */}
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl">
              
              {/* HEADER */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">
                  Add New Lead
                </h2>

                <button
                  onClick={() => setOpen(false)}
                  className="text-lg"
                >
                  ✕
                </button>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="p-4 space-y-4"
              >
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <input
                  type="text"
                  placeholder="Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <input
                  type="text"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border p-2 rounded"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-2 rounded"
                >
                  {loading ? "Creating..." : "Create Lead"}
                </button>
              </form>

            </div>
          </div>
        </div>
      )}
    </>
  );
}