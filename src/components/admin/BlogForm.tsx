"use client";

import { useActionState, useState, useEffect } from "react";
import { saveBlogPost } from "@/app/admin/(dashboard)/blog/actions";
import { FiSave, FiAlertCircle, FiImage, FiMonitor, FiX } from "react-icons/fi";
import BlogPostContent from "@/components/blog/BlogPostContent";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  author_role: string;
  author_avatar?: string | null;
  date: string;
  reading_time: string;
  category: string;
  image_url: string;
  content: string;
}

const initialState = {
  error: "",
};

export default function BlogForm({ post }: { post: BlogPost | null }) {
  const [state, formAction, isPending] = useActionState(saveBlogPost, initialState);
  
  // Controlled form state
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [author, setAuthor] = useState(post?.author || "");
  const [authorRole, setAuthorRole] = useState(post?.author_role || "");
  const [authorAvatar, setAuthorAvatar] = useState(post?.author_avatar || "");
  const [category, setCategory] = useState(post?.category || "");
  const [date, setDate] = useState(post?.date || "");
  const [readingTime, setReadingTime] = useState(post?.reading_time || "");
  const [imageUrl, setImageUrl] = useState(post?.image_url || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Auto-generate slug from title (only for new posts)
  useEffect(() => {
    if (!post && !isSlugManuallyEdited) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphen
        .replace(/(^-|-$)+/g, ""); // trim leading/trailing hyphens
      setSlug(generatedSlug);
    }
  }, [title, post, isSlugManuallyEdited]);

  const previewPostData = {
    title,
    excerpt,
    author,
    authorRole,
    authorAvatar,
    date,
    readingTime,
    category,
    imageUrl,
    content
  };

  return (
    <>
      <form action={formAction} className="space-y-6">
        {/* Hidden inputs to pass data */}
        <input type="hidden" name="id" value={post?.id || "new"} />

        {state?.error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
            <FiAlertCircle className="shrink-0 text-lg" />
            <p>{state.error}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
              >
                Post Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to get accepted into Harvard"
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
                placeholder="e.g. how-to-get-accepted-into-harvard"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Author */}
            <div className="space-y-2">
              <label
                htmlFor="author"
                className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
              >
                Author Name
              </label>
              <input
                type="text"
                id="author"
                name="author"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Sebastián Martínez"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
              />
            </div>

            {/* Author Role */}
            <div className="space-y-2">
              <label
                htmlFor="authorRole"
                className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
              >
                Author Role
              </label>
              <input
                type="text"
                id="authorRole"
                name="authorRole"
                required
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g. Founder"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
              />
            </div>

            {/* Author Avatar */}
            <div className="space-y-2">
              <label
                htmlFor="authorAvatar"
                className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
              >
                Author Avatar URL (Optional)
              </label>
              <input
                type="url"
                id="authorAvatar"
                name="authorAvatar"
                value={authorAvatar}
                onChange={(e) => setAuthorAvatar(e.target.value)}
                placeholder="e.g. https://images.unsplash.com/photo-..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Category */}
            <div className="space-y-2 md:col-span-2">
              <label
                htmlFor="category"
                className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
              >
                Category / Tag
              </label>
              <input
                type="text"
                id="category"
                name="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Admissions, Scholarships, Student Life"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label
                htmlFor="date"
                className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
              >
                Publish Date (YYYY-MM-DD)
              </label>
              <input
                type="text"
                id="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. 2026-05-19 (Defaults to today)"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
              />
            </div>

            {/* Reading Time */}
            <div className="space-y-2">
              <label
                htmlFor="readingTime"
                className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
              >
                Reading Time (Optional)
              </label>
              <input
                type="text"
                id="readingTime"
                name="readingTime"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                placeholder="e.g. 5 min read (Auto-calculated if blank)"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label
              htmlFor="imageUrl"
              className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
            >
              Post Cover Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="e.g. https://images.unsplash.com/photo-..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary"
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <label
              htmlFor="excerpt"
              className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
            >
              Excerpt / Short Summary
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              required
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a brief, catchy summary of the post for card previews..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary resize-y"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label
              htmlFor="content"
              className="text-xs font-black uppercase tracking-widest text-primary/50 block ml-1"
            >
              Content (Supports Markdown or HTML)
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the main article content here..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:bg-white focus:border-accent text-sm font-semibold transition-all text-primary resize-y font-mono text-xs"
            />
          </div>
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
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            <FiSave size={16} />
            {isPending ? "Saving..." : "Save Blog Post"}
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
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">This is how your post will look to visitors</p>
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

          {/* Modal Content container (to constrain width like public page) */}
          <div className="flex-1 py-12 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <BlogPostContent post={previewPostData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
