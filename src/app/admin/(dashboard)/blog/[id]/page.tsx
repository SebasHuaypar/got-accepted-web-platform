import { createClient } from "@/utils/supabase/server";
import BlogForm from "@/components/admin/BlogForm";
import AccessDenied from "@/components/admin/AccessDenied";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function BlogEditorPage({ params }: PageProps) {
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

  const { id } = await params;
  const isNew = id === "new";
  let post = null;

  if (!isNew) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      notFound();
    }
    post = data;
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-4 font-bold text-sm"
        >
          <FiArrowLeft />
          Back to Blog Posts
        </Link>
        <h1 className="text-3xl font-black text-primary">
          {isNew ? "Write New Post" : `Edit Blog Post`}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isNew
            ? "Create and publish a new article."
            : "Modify the details of your published blog post."}
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm">
        <BlogForm post={post} />
      </div>
    </div>
  );
}
