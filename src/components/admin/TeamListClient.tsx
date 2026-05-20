"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteMember } from "@/app/admin/(dashboard)/team/actions";
import { FiSearch, FiEdit2, FiTrash2, FiLinkedin, FiInstagram, FiUser } from "react-icons/fi";
import Image from "next/image";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Member {
  id: string;
  name: string;
  role: string;
  category: "BOARD" | "TEAM";
  avatar_url?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  group?: string | null;
}

export default function TeamListClient({
  initialMembers,
}: {
  initialMembers: Member[];
}) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: "" });

  const filteredMembers = members.filter((m) => {
    const term = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(term) ||
      m.role.toLowerCase().includes(term) ||
      (m.group && m.group.toLowerCase().includes(term))
    );
  });

  const handleConfirmDelete = () => {
    const id = confirmModal.id;
    setConfirmModal({ isOpen: false, id: "" });
    if (!id) return;

    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteMember(id);
        setMembers((prev) => prev.filter((m) => m.id !== id));
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete team member.");
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
            placeholder="Search team members by name, role, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary placeholder-gray-400"
          />
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">
          Total: {filteredMembers.length} member(s)
        </div>
      </div>

      {/* Members List */}
      {filteredMembers.length === 0 ? (
        <div className="p-16 text-center text-gray-400 font-bold">
          No team members found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="py-4 px-6">Member</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Department/Group</th>
                <th className="py-4 px-6">Socials</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center text-gray-400 border border-gray-100">
                        {m.avatar_url ? (
                          <Image
                            src={m.avatar_url}
                            alt={m.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <FiUser size={18} />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-primary">{m.name}</div>
                        <div className="text-xs text-gray-400 font-semibold">{m.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                        m.category === "BOARD"
                          ? "bg-purple-50 text-purple-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {m.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-bold text-xs uppercase tracking-wide">
                    {m.group || "N/A"}
                  </td>
                  <td className="py-4 px-6 text-gray-400 font-bold whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {m.linkedin ? (
                        <a
                          href={m.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#0A66C2] transition-colors"
                        >
                          <FiLinkedin size={16} />
                        </a>
                      ) : (
                        <span className="text-gray-200"><FiLinkedin size={16} /></span>
                      )}
                      {m.instagram ? (
                        <a
                          href={m.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#E1306C] transition-colors"
                        >
                          <FiInstagram size={16} />
                        </a>
                      ) : (
                        <span className="text-gray-200"><FiInstagram size={16} /></span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/team/${m.id}`}
                        className="p-2 hover:bg-primary/5 text-gray-400 hover:text-primary rounded-xl transition-colors"
                        title="Edit Member"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button
                        onClick={() => setConfirmModal({ isOpen: true, id: m.id })}
                        disabled={deletingId === m.id}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-colors disabled:opacity-50"
                        title="Delete Member"
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
        title="Delete Team Member"
        message="Are you sure you want to delete this team member? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, id: "" })}
      />
    </div>
  );
}
