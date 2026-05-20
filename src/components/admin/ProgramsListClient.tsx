"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteProgram } from "@/app/admin/(dashboard)/programs/actions";
import { FiSearch, FiEdit2, FiTrash2, FiClock, FiFileText } from "react-icons/fi";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Program {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  duration?: string | null;
  image_url?: string | null;
}

export default function ProgramsListClient({
  initialPrograms,
}: {
  initialPrograms: Program[];
}) {
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: "" });

  const filteredPrograms = programs.filter((p) => {
    const term = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  });

  const handleConfirmDelete = () => {
    const id = confirmModal.id;
    setConfirmModal({ isOpen: false, id: "" });
    if (!id) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteProgram(id);
        setPrograms((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete program.");
      } finally {
        setDeletingId(null);
      }
    });
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
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary placeholder-gray-400"
          />
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">
          Total: {filteredPrograms.length} program(s)
        </div>
      </div>

      {/* Programs List */}
      {filteredPrograms.length === 0 ? (
        <div className="p-16 text-center text-gray-400 font-bold">
          No programs found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="py-4 px-6">Program Info</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredPrograms.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-bold text-primary">{p.title}</div>
                    <div className="text-xs text-gray-400 font-semibold">{p.slug}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400 font-semibold">
                    <span className="flex items-center gap-1.5 text-xs">
                      <FiClock />
                      {p.duration || "N/A"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/programs/${p.id}`}
                        className="p-2 hover:bg-primary/5 text-gray-400 hover:text-primary rounded-xl transition-colors"
                        title="Edit Program"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button
                        onClick={() => setConfirmModal({ isOpen: true, id: p.id })}
                        disabled={deletingId === p.id}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-colors disabled:opacity-50"
                        title="Delete Program"
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
        title="Delete Program"
        message="Are you sure you want to delete this program? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, id: "" })}
      />
    </div>
  );
}
