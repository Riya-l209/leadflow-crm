import { useState } from "react";

import { createLead } from "../services/api";

interface Props {
  onCreated: () => void;
}

export function AddLeadModal({
  onCreated,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const [name, setName] =
    useState("");

  const [company, setCompany] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [loading, setLoading] =
    useState(false);

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
      {/* OPEN BUTTON */}
      <button
        onClick={() =>
          setOpen(true)
        }
        className="
          bg-black
          text-white
          px-5 py-3
          rounded-xl
          font-medium
          hover:opacity-90
        "
      >
        + Add Lead
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
            
            {/* HEADER */}
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Add New Lead
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Create a new lead for your pipeline
                </p>
              </div>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="
                  h-10 w-10
                  rounded-full
                  bg-slate-100
                  hover:bg-slate-200
                  flex items-center justify-center
                  text-slate-600
                "
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={
                handleSubmit
              }
              className="p-6 space-y-5"
            >
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Lead Name *
                </label>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  placeholder="John Doe"
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

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Company
                </label>

                <input
                  type="text"
                  value={company}
                  onChange={(e) =>
                    setCompany(
                      e.target.value
                    )
                  }
                  placeholder="Acme Inc."
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

              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">
                  Phone
                </label>

                <input
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  placeholder="+91 9876543210"
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
                  ? "Creating..."
                  : "Create Lead"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}