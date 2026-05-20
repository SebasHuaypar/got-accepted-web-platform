import HeroBlog from "@/components/blog/HeroBlog";
import BlogList from "@/components/blog/BlogList";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { BLOG_POSTS } from "@/constants/mockData";
import { BlogPost, DbBlogPost } from "@/types";

export const metadata = {
  title: "Blog | GotAccepted",
  description: "Read the latest stories and tips about global scholarships and university life.",
};

export default async function BlogPage() {
  const useMock = !isSupabaseConfigured && process.env.NODE_ENV !== "production";
  let blogPosts: BlogPost[] = useMock ? BLOG_POSTS : [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching blog posts from Supabase:", error);
      } else if (data && data.length > 0) {
        blogPosts = data.map((item: DbBlogPost) => ({
          id: String(item.id),
          slug: item.slug,
          title: item.title,
          excerpt: item.excerpt,
          author: item.author,
          authorRole: item.author_role,
          authorAvatar: item.author_avatar || undefined,
          date: item.date,
          readingTime: item.reading_time,
          category: item.category,
          imageUrl: item.image_url,
          content: item.content,
        }));
      }
    } catch (e) {
      console.error("Failed to query Supabase blog posts:", e);
    }
  }

  return (
    <main className="flex flex-col w-full">
      <HeroBlog />
      <BlogList initialBlogPosts={blogPosts} />
    </main>
  );
}
