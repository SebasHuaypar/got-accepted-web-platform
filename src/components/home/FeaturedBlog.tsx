import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "@/constants/mockData";
import { BlogPost } from "@/types";
import { Container } from "@/components/ui/Container";
import { Title } from "@/components/ui/Title";
import { Button } from "@/components/ui/Button";
import { FiClock } from "react-icons/fi";

interface FeaturedBlogProps {
  initialBlogPosts?: BlogPost[];
}

export default function FeaturedBlog({ initialBlogPosts }: FeaturedBlogProps) {
  const blogPosts = initialBlogPosts || BLOG_POSTS;
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <section className="py-20 md:py-32 bg-white overflow-hidden">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 md:mb-16 gap-6 md:gap-8 text-center lg:text-left items-center lg:items-end">
          <div className="max-w-2xl space-y-3 md:space-y-4 flex flex-col items-center lg:items-start">
            <h2 className="text-accent text-xs md:text-sm font-black uppercase tracking-[0.4em]">
              Explore Our Insights
            </h2>
            <Title as="h2" className="text-3xl md:text-5xl lg:text-7xl font-black text-primary leading-[1.1]">
              Ready to take the <br /> 
              <span className="text-accent italic font-serif">next big step?</span>
            </Title>
          </div>
          <Link href="/blog" className="hidden lg:block">
            <Button variant="outline" className="px-8 py-3 rounded-full font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all">
              View All Stories
            </Button>
          </Link>
        </div>

        {/* Bento Grid on Desktop, Horizontal List on Mobile */}
        {featuredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-surface rounded-[2.5rem] border border-muted text-center max-w-lg mx-auto">
            <p className="text-primary font-black text-lg">New insights coming soon!</p>
            <p className="text-gray-400 text-sm mt-1">Our team is preparing fresh admissions and scholarship guides.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 h-auto lg:h-[600px]">
            {/* First Post */}
            <Link 
              href={`/blog/${featuredPosts[0].slug}`}
              className="lg:col-span-7 group relative overflow-hidden rounded-2xl lg:rounded-[3rem] bg-surface h-[140px] lg:h-full flex flex-row lg:block"
            >
              <div className="relative w-1/3 lg:w-full h-full lg:h-full shrink-0 overflow-hidden">
                <Image
                  src={featuredPosts[0].imageUrl}
                  alt={featuredPosts[0].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-t from-primary/90 lg:via-primary/20 to-transparent hidden lg:block" />
              <div className="relative lg:absolute bottom-0 left-0 w-full p-4 lg:p-10 space-y-1 lg:space-y-4 flex flex-col justify-center bg-primary lg:bg-transparent">
                <span className="bg-accent text-white text-[8px] lg:text-[10px] uppercase font-black px-2 lg:px-4 py-1 lg:py-2 rounded-lg lg:rounded-xl tracking-widest w-fit">
                  {featuredPosts[0].category}
                </span>
                <h3 className="text-xs lg:text-4xl font-black text-white leading-tight line-clamp-2">
                  {featuredPosts[0].title}
                </h3>
                <div className="flex items-center gap-2 lg:gap-4 text-[8px] lg:text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-1"><FiClock /> {featuredPosts[0].readingTime}</span>
                  <span className="hidden lg:inline">{featuredPosts[0].date}</span>
                </div>
              </div>
            </Link>

            {/* Secondary Posts */}
            <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8 h-full">
              {featuredPosts.slice(1, 3).map((post) => (
                <Link 
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="flex-grow group relative overflow-hidden rounded-2xl lg:rounded-[2.5rem] bg-surface h-[140px] lg:h-1/2 flex flex-row lg:block"
                >
                  <div className="relative w-1/3 lg:w-full h-full lg:h-full shrink-0 overflow-hidden">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent hidden lg:block" />
                  <div className="relative lg:absolute bottom-0 left-0 w-full p-4 lg:p-8 space-y-1 flex flex-col justify-center bg-primary lg:bg-transparent">
                    <span className="text-accent text-[8px] uppercase font-black tracking-widest">
                      {post.category}
                    </span>
                    <h3 className="text-xs lg:text-xl font-black text-white leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile-only button */}
        <div className="mt-12 lg:hidden flex justify-center px-6">
          <Link href="/blog">
            <Button variant="outline" className="px-8 py-3 rounded-full font-bold border-2 border-primary text-primary text-sm">
              View All Stories
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
