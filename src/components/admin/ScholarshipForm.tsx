"use client";

import { useActionState } from "react";
import { saveScholarship } from "@/app/admin/(dashboard)/scholarships/actions";
import { FiSave, FiAlertCircle } from "react-icons/fi";

interface Scholarship {
  id: string;
  title: string;
  institution: string;
  institution_logo?: string | null;
  amount: string;
  deadline: string;
  category: string[];
  description: string;
  requirements: string[];
  link: string;
}

const initialState = {
  error: "",
};

export default function ScholarshipForm({
  scholarship,
}: {
  scholarship: Scholarship | null;
}) {
  const [state, formAction, isPending] = useActionState(saveScholarship, initialState);

  // Format arrays for display in standard inputs
  const categoryString = scholarship?.category ? scholarship.category.join(", ") : "";
  const requirementsString = scholarship?.requirements ? scholarship.requirements.join("\n") : "";

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden inputs to pass data */}
      <input type="hidden" name="id" value={scholarship?.id || "new"} />

      {state?.error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
          <FiAlertCircle className="shrink-0 text-lg" />
          <p>{state.error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
          >
            Scholarship Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={scholarship?.title || ""}
            placeholder="e.g. Gates Cambridge Scholarship"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
          />
        </div>

        {/* Institution */}
        <div className="space-y-2">
          <label
            htmlFor="institution"
            className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
          >
            Offering Institution / Provider
          </label>
          <input
            type="text"
            id="institution"
            name="institution"
            required
            defaultValue={scholarship?.institution || ""}
            placeholder="e.g. University of Cambridge"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Amount */}
        <div className="space-y-2">
          <label
            htmlFor="amount"
            className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
          >
            Funding Amount
          </label>
          <input
            type="text"
            id="amount"
            name="amount"
            required
            defaultValue={scholarship?.amount || ""}
            placeholder="e.g. Full Tuition + Stipend"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
          />
        </div>

        {/* Deadline */}
        <div className="space-y-2">
          <label
            htmlFor="deadline"
            className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
          >
            Application Deadline (YYYY-MM-DD)
          </label>
          <input
            type="text"
            id="deadline"
            name="deadline"
            required
            defaultValue={scholarship?.deadline || ""}
            placeholder="e.g. 2026-10-15"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
          />
        </div>

        {/* Categories (Comma Separated) */}
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
          >
            Tags / Categories (Comma separated)
          </label>
          <input
            type="text"
            id="category"
            name="category"
            defaultValue={categoryString}
            placeholder="e.g. Master's, Europe, Engineering"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Institution Logo */}
        <div className="space-y-2">
          <label
            htmlFor="institutionLogo"
            className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
          >
            Institution Logo URL (Optional)
          </label>
          <input
            type="url"
            id="institutionLogo"
            name="institutionLogo"
            defaultValue={scholarship?.institution_logo || ""}
            placeholder="e.g. https://logo.clearbit.com/cam.ac.uk"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
          />
        </div>

        {/* Application Link */}
        <div className="space-y-2">
          <label
            htmlFor="link"
            className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
          >
            Official Application URL
          </label>
          <input
            type="url"
            id="link"
            name="link"
            required
            defaultValue={scholarship?.link || ""}
            placeholder="e.g. https://www.gatescambridge.org/apply"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={scholarship?.description || ""}
          placeholder="Briefly describe the scholarship coverage, eligibility criteria, and general purpose..."
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary resize-y"
        />
      </div>

      {/* Requirements (One per line) */}
      <div className="space-y-2">
        <label
          htmlFor="requirements"
          className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
        >
          Requirements (Enter each requirement on a new line)
        </label>
        <textarea
          id="requirements"
          name="requirements"
          rows={6}
          defaultValue={requirementsString}
          placeholder="e.g.&#10;Citizen of any country outside the UK&#10;Applying for full-time PhD, MSc or MBA&#10;Outstanding intellectual ability"
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary resize-y"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <FiSave size={16} />
          {isPending ? "Saving..." : "Save Scholarship"}
        </button>
      </div>
    </form>
  );
}
