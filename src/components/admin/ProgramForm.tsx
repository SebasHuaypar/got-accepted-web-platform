"use client";

import { useActionState, useState, useEffect } from "react";
import { saveProgram } from "@/app/admin/(dashboard)/programs/actions";
import { FiSave, FiAlertCircle, FiMonitor, FiX } from "react-icons/fi";
import ProgramPostContent from "@/components/programs/ProgramPostContent";

interface Program {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  duration?: string | null;
  image_url?: string | null;
  next_intake?: string | null;
  availability?: string | null;
}

const initialState = {
  error: "",
};

export default function ProgramForm({ program }: { program: Program | null }) {
  const [state, formAction, isPending] = useActionState(saveProgram, initialState);
  
  const [title, setTitle] = useState(program?.title || "");
  const [slug, setSlug] = useState(program?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  
  const [category, setCategory] = useState(program?.category || "Undergraduate");
  const [duration, setDuration] = useState(program?.duration || "");
  const [imageUrl, setImageUrl] = useState(program?.image_url || "");
  const [description, setDescription] = useState(program?.description || "");
  
  const [nextIntake, setNextIntake] = useState(program?.next_intake || "");
  const [availability, setAvailability] = useState(program?.availability || "");

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Auto-generate slug from title (only for new programs)
  useEffect(() => {
    if (!program && !isSlugManuallyEdited) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphen
        .replace(/(^-|-$)+/g, ""); // trim leading/trailing hyphens
      setSlug(generatedSlug);
    }
  }, [title, program, isSlugManuallyEdited]);

  const previewProgramData = {
    title,
    description,
    category,
    duration,
    imageUrl,
    nextIntake,
    availability
  };

  return (
    <>
      <form action={formAction} className="space-y-6">
        {/* Hidden inputs to pass data */}
        <input type="hidden" name="id" value={program?.id || "new"} />

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
              Program Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Oxford Admissions Masterclass"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label
              htmlFor="slug"
              className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
            >
              Slug (URL path)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setIsSlugManuallyEdited(true);
                setSlug(e.target.value);
              }}
              placeholder="e.g. oxford-admissions-masterclass"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary appearance-none cursor-pointer"
            >
              <option value="Undergraduate">Undergraduate</option>
              <option value="Graduate">Graduate</option>
              <option value="Scholarships">Scholarships</option>
              <option value="Workshops">Workshops</option>
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label
              htmlFor="duration"
              className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
            >
              Duration (Optional)
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 6 Weeks, 3 Months, Self-paced"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
            />
          </div>

          {/* Next Intake */}
          <div className="space-y-2">
            <label
              htmlFor="nextIntake"
              className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
            >
              Next Intake (Optional)
            </label>
            <input
              type="text"
              id="nextIntake"
              name="nextIntake"
              value={nextIntake}
              onChange={(e) => setNextIntake(e.target.value)}
              placeholder="e.g. September 2026"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image URL */}
          <div className="space-y-2">
            <label
              htmlFor="imageUrl"
              className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
            >
              Image URL (Unsplash or external link)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="e.g. https://images.unsplash.com/..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
            />
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <label
              htmlFor="availability"
              className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
            >
              Availability (Optional)
            </label>
            <input
              type="text"
              id="availability"
              name="availability"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="e.g. Limited Spots, Open Enrollment"
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
            Description (Supports Markdown)
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain the structure, curriculum, and target audience of this program..."
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary resize-y font-mono text-xs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl transition-all cursor-pointer"
          >
            <FiMonitor size={16} />
            Live Preview
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <FiSave size={16} />
            {isPending ? "Saving..." : "Save Program"}
          </button>
        </div>
      </form>

      {/* Full-Screen Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-[200] bg-white overflow-y-auto flex flex-col animate-fadeIn">
          {/* Modal Header */}
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                <FiMonitor size={20} />
              </div>
              <div>
                <h3 className="font-black text-primary leading-none">Live Preview</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">This is how your program page will look</p>
              </div>
            </div>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              title="Close Preview"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 pb-12 bg-white">
            <ProgramPostContent program={previewProgramData} />
          </div>
        </div>
      )}
    </>
  );
}
