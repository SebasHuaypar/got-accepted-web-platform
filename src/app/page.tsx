import Hero from "@/components/home/Hero";
import AboutUs from "@/components/home/AboutUs";
import FeaturedTeam from "@/components/home/FeaturedTeam";
import FeaturedPrograms from "@/components/home/FeaturedPrograms";
import FeaturedScholarships from "@/components/home/FeaturedScholarships";
import FeaturedBlog from "@/components/home/FeaturedBlog";
import FAQ from "@/components/home/FAQ";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { PROGRAMS, SCHOLARSHIPS, MEMBERS, BLOG_POSTS } from "@/constants/mockData";
import { Program, Scholarship, Member, BlogPost, DbProgram, DbScholarship, DbMember, DbBlogPost } from "@/types";

export default async function Home() {
  const useMock = !isSupabaseConfigured && process.env.NODE_ENV !== "production";
  let programs: Program[] = useMock ? PROGRAMS : [];
  let scholarships: Scholarship[] = useMock ? SCHOLARSHIPS : [];
  let members: Member[] = useMock ? MEMBERS : [];
  let blogPosts: BlogPost[] = useMock ? BLOG_POSTS : [];

  if (isSupabaseConfigured && supabase) {
    try {
      const [programsRes, scholarshipsRes, membersRes, blogRes] = await Promise.all([
        supabase.from("programs").select("*").order("title"),
        supabase.from("scholarships").select("*").order("title"),
        supabase.from("members").select("*").order("name"),
        supabase.from("blog_posts").select("*").order("date", { ascending: false }),
      ]);

      if (programsRes.data && programsRes.data.length > 0) {
        programs = programsRes.data.map((item: DbProgram) => ({
          id: String(item.id),
          slug: item.slug,
          title: item.title,
          description: item.description,
          category: item.category,
          duration: item.duration || undefined,
          imageUrl: item.image_url || undefined,
        }));
      }

      if (scholarshipsRes.data && scholarshipsRes.data.length > 0) {
        scholarships = scholarshipsRes.data.map((item: DbScholarship) => ({
          id: String(item.id),
          title: item.title,
          institution: item.institution,
          institutionLogo: item.institution_logo || undefined,
          amount: item.amount,
          deadline: item.deadline,
          category: item.category || [],
          description: item.description,
          requirements: item.requirements || [],
          link: item.link,
        }));
      }

      if (membersRes.data && membersRes.data.length > 0) {
        members = membersRes.data.map((item: DbMember) => ({
          id: String(item.id),
          name: item.name,
          role: item.role,
          category: item.category,
          avatarUrl: item.avatar_url || undefined,
          linkedin: item.linkedin || undefined,
          instagram: item.instagram || undefined,
          group: item.group || undefined,
        }));
      }

      if (blogRes.data && blogRes.data.length > 0) {
        blogPosts = blogRes.data.map((item: DbBlogPost) => ({
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
      console.error("Failed to query Supabase data for home:", e);
    }
  }

  return (
    <div className="flex flex-col w-full">
      <Hero />
      <AboutUs />
      <FeaturedTeam initialMembers={members} />
      <FeaturedPrograms initialPrograms={programs} />
      <FeaturedScholarships initialScholarships={scholarships} />
      <FeaturedBlog initialBlogPosts={blogPosts} />
      <FAQ />
    </div>
  );
}
