import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/constants/mockData";
import { BlogPost } from "@/types";
import { Container } from "@/components/ui/Container";
import { Title } from "@/components/ui/Title";
import { FiClock, FiArrowLeft, FiShare2, FiBookmark } from "react-icons/fi";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { DbBlogPost } from "@/types";
import BlogPostContent from "@/components/blog/BlogPostContent";

export async function generateStaticParams() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from("blog_posts").select("slug");
      if (data && data.length > 0) {
        return data.map((post) => ({
          slug: post.slug,
        }));
      }
    } catch (e) {
      console.error("Failed to generate static params from Supabase:", e);
    }
  }
  return BLOG_POSTS.map((post: BlogPost) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: BlogPost | undefined;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (data) {
        post = {
          id: String(data.id),
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          author: data.author,
          authorRole: data.author_role,
          authorAvatar: data.author_avatar || undefined,
          date: data.date,
          readingTime: data.reading_time,
          category: data.category,
          imageUrl: data.image_url,
          content: data.content,
        };
      }
    } catch (e) {
      console.error("Failed to fetch blog metadata from Supabase:", e);
    }
  }

  const useMock = !isSupabaseConfigured && process.env.NODE_ENV !== "production";
  if (!post && useMock) {
    post = BLOG_POSTS.find((p: BlogPost) => p.slug === slug);
  }

  if (!post) return {};
  return {
    title: `${post.title} | GotAccepted Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post: BlogPost | undefined;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        console.error("Error fetching blog post from Supabase:", error);
      } else if (data) {
        post = {
          id: String(data.id),
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt,
          author: data.author,
          authorRole: data.author_role,
          authorAvatar: data.author_avatar || undefined,
          date: data.date,
          readingTime: data.reading_time,
          category: data.category,
          imageUrl: data.image_url,
          content: data.content,
        };
      }
    } catch (e) {
      console.error("Failed to query Supabase blog post:", e);
    }
  }

  const useMock = !isSupabaseConfigured && process.env.NODE_ENV !== "production";
  if (!post && useMock) {
    post = BLOG_POSTS.find((p: BlogPost) => p.slug === slug);
  }

  if (!post) {
    notFound();
  }

  // Split content by double newline into paragraphs
  const paragraphs = post.content.split("\n\n").filter(Boolean);

  // Related posts: other posts in the same category (up to 2)
  let relatedPosts: BlogPost[] = [];

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("category", post.category)
        .limit(2);

      const numId = Number(post.id);
      if (!isNaN(numId)) {
        query = query.neq("id", numId);
      } else {
        query = query.neq("id", post.id);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching related posts from Supabase:", error);
      }

      if (data && data.length > 0) {
        relatedPosts = data.map((item: DbBlogPost) => ({
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
      console.error("Failed to query related posts from Supabase:", e);
    }
  }

  if (relatedPosts.length === 0 && useMock) {
    relatedPosts = BLOG_POSTS.filter(
      (p) => p.id !== post!.id && p.category === post!.category
    ).slice(0, 2);
  }

  return (
    <main className="pt-24 min-h-screen bg-white">
      <Container className="py-12">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-bold group mb-10">
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          {/* Article visual representation extracted to reusable component */}
          <BlogPostContent post={post} />

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-24" aria-labelledby="related-posts-heading">
              <h2 id="related-posts-heading" className="text-2xl font-black text-primary mb-8">
                More in {post.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="group flex flex-col gap-4 p-6 rounded-[1.5rem] border border-muted hover:border-accent transition-colors"
                  >
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                      <Image
                        src={related.imageUrl}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-accent font-black uppercase tracking-widest mb-2">{related.readingTime}</p>
                      <h3 className="text-lg font-black text-primary group-hover:text-accent transition-colors leading-tight">
                        {related.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </Container>
    </main>
  );
}
