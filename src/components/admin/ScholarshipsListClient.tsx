"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteScholarship } from "@/app/admin/(dashboard)/scholarships/actions";
import { FiSearch, FiEdit2, FiTrash2, FiMapPin, FiCalendar, FiDollarSign } from "react-icons/fi";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Scholarship {
  id: string;
  title: string;
  institution: string;
  amount: string;
  deadline: string;
  category: string[];
}

export default function ScholarshipsListClient({
  initialScholarships,
}: {
  initialScholarships: Scholarship[];
}) {
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialScholarships);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: "" });

  const filteredScholarships = scholarships.filter((s) => {
    const term = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(term) ||
      s.institution.toLowerCase().includes(term) ||
      s.category.some((c) => c.toLowerCase().includes(term))
    );
  });

  const handleConfirmDelete = () => {
    const id = confirmModal.id;
    setConfirmModal({ isOpen: false, id: "" });
    if (!id) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteScholarship(id);
        setScholarships((prev) => prev.filter((s) => s.id !== id));
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete scholarship.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      const dateObj = new Date(dateStr);
      // Check if it's a valid date
      if (isNaN(dateObj.getTime())) return dateStr;
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      {/* Search Header */}
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <FiSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search scholarships by title, provider, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary placeholder-gray-400"
          />
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">
          Total: {filteredScholarships.length} scholarship(s)
        </div>
      </div>

      {/* Scholarships List */}
      {filteredScholarships.length === 0 ? (
        <div className="p-16 text-center text-gray-400 font-bold">
          No scholarships found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="py-4 px-6">Scholarship / Provider</th>
                <th className="py-4 px-6">Funding Amount</th>
                <th className="py-4 px-6">Deadline</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredScholarships.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-bold text-primary">{s.title}</div>
                    <div className="text-xs text-gray-400 font-semibold">{s.institution}</div>
                    {s.category && s.category.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {s.category.map((cat, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px] font-black uppercase tracking-wider"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-bold">
                    <span className="flex items-center gap-1 text-xs">
                      <FiDollarSign />
                      {s.amount}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400 font-bold">
                    <span className="flex items-center gap-1.5 text-xs">
                      <FiCalendar />
                      {formatDate(s.deadline)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/scholarships/${s.id}`}
                        className="p-2 hover:bg-primary/5 text-gray-400 hover:text-primary rounded-xl transition-colors"
                        title="Edit Scholarship"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button
                        onClick={() => setConfirmModal({ isOpen: true, id: s.id })}
                        disabled={deletingId === s.id}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-colors disabled:opacity-50"
                        title="Delete Scholarship"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Scholarship"
        message="Are you sure you want to delete this scholarship? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, id: "" })}
      />
    </div>
  );
}
