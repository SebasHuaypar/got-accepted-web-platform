"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteBlogPost } from "@/app/admin/(dashboard)/blog/actions";
import { FiSearch, FiEdit2, FiTrash2, FiUser, FiCalendar, FiClock } from "react-icons/fi";
import Image from "next/image";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string;
  reading_time: string;
  category: string;
  image_url: string;
}

export default function BlogListClient({
  initialPosts,
}: {
  initialPosts: BlogPost[];
}) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: "" });

  const filteredPosts = posts.filter((p) => {
    const term = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      p.author.toLowerCase().includes(term) ||
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
        await deleteBlogPost(id);
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete blog post.");
      } finally {
        setDeletingId(null);
      }
    });
  };

  const formatDate = (dateStr: string) => {
    try {
      const dateObj = new Date(dateStr);
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
            placeholder="Search posts by title, author, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-12 pr-4 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary placeholder-gray-400"
          />
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden sm:block">
          Total: {filteredPosts.length} post(s)
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="p-16 text-center text-gray-400 font-bold">
          No blog posts found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <th className="py-4 px-6">Article</th>
                <th className="py-4 px-6">Author</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Stats</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredPosts.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                        {p.image_url ? (
                          <Image
                            src={p.image_url}
                            alt={p.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <div className="font-bold text-primary max-w-sm truncate">{p.title}</div>
                        <div className="text-xs text-gray-400 font-semibold">{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-500 font-bold">
                    <span className="flex items-center gap-1.5 text-xs">
                      <FiUser />
                      {p.author}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-400 font-semibold">
                    <div className="flex flex-col gap-0.5 text-xs">
                      <span className="flex items-center gap-1">
                        <FiCalendar />
                        {formatDate(p.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock />
                        {p.reading_time}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog/${p.id}`}
                        className="p-2 hover:bg-primary/5 text-gray-400 hover:text-primary rounded-xl transition-colors"
                        title="Edit Post"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button
                        onClick={() => setConfirmModal({ isOpen: true, id: p.id })}
                        disabled={deletingId === p.id}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-colors disabled:opacity-50"
                        title="Delete Post"
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
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModal({ isOpen: false, id: "" })}
      />
    </div>
  );
}
