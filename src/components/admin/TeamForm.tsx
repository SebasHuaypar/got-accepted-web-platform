"use client";

import { useActionState } from "react";
import { saveMember } from "@/app/admin/(dashboard)/team/actions";
import { FiSave, FiAlertCircle } from "react-icons/fi";

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

const initialState = {
  error: "",
};

export default function TeamForm({ member }: { member: Member | null }) {
  const [state, formAction, isPending] = useActionState(saveMember, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden inputs to pass data */}
      <input type="hidden" name="id" value={member?.id || "new"} />

      {state?.error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
          <FiAlertCircle className="shrink-0 text-lg" />
          <p>{state.error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={member?.name || ""}
            placeholder="e.g. Sebastián Martínez"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
          />
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label
            htmlFor="role"
            className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
          >
            Role / Position
          </label>
          <input
            type="text"
            id="role"
            name="role"
            required
            defaultValue={member?.role || ""}
            placeholder="e.g. Co-Founder & Executive Director"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
          >
            Team Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={member?.category || "TEAM"}
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary appearance-none cursor-pointer"
          >
            <option value="BOARD">BOARD</option>
            <option value="TEAM">TEAM</option>
          </select>
        </div>

        {/* Group / Department */}
        <div className="space-y-2">
          <label
            htmlFor="group"
            className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
          >
            Department / Group (Optional)
          </label>
          <input
            type="text"
            id="group"
            name="group"
            defaultValue={member?.group || ""}
            placeholder="e.g. Admissions, Mentorship, Strategy"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
          />
        </div>
      </div>

      {/* Avatar URL */}
      <div className="space-y-2">
        <label
          htmlFor="avatarUrl"
          className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
        >
          Avatar Image URL (Optional)
        </label>
        <input
          type="url"
          id="avatarUrl"
          name="avatarUrl"
          defaultValue={member?.avatar_url || ""}
          placeholder="e.g. https://images.unsplash.com/photo-..."
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LinkedIn URL */}
        <div className="space-y-2">
          <label
            htmlFor="linkedin"
            className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
          >
            LinkedIn Profile URL (Optional)
          </label>
          <input
            type="url"
            id="linkedin"
            name="linkedin"
            defaultValue={member?.linkedin || ""}
            placeholder="e.g. https://linkedin.com/in/username"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
          />
        </div>

        {/* Instagram URL */}
        <div className="space-y-2">
          <label
            htmlFor="instagram"
            className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
          >
            Instagram Profile URL (Optional)
          </label>
          <input
            type="url"
            id="instagram"
            name="instagram"
            defaultValue={member?.instagram || ""}
            placeholder="e.g. https://instagram.com/username"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <FiSave size={16} />
          {isPending ? "Saving..." : "Save Member"}
        </button>
      </div>
    </form>
  );
}
