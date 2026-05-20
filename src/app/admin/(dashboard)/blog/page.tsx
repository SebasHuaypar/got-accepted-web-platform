import { createClient } from "@/utils/supabase/server";
import BlogListClient from "@/components/admin/BlogListClient";
import AccessDenied from "@/components/admin/AccessDenied";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, role:roles(permissions)")
    .eq("id", user.id)
    .single();

  const permissions = profile?.role?.permissions || [];
  if (!permissions.includes("blog")) {
    return <AccessDenied requiredPermission="blog" />;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
  }

  const posts = data || [];

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-1">
            Publish admissions insights, scholarship announcements, and student guides.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-black uppercase tracking-widest text-xs px-6 py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all self-start sm:self-auto"
        >
          <FiPlus size={16} />
          New Post
        </Link>
      </div>

      <BlogListClient initialPosts={posts} />
    </div>
  );
}
