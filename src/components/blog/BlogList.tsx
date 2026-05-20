"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS } from "@/constants/mockData";
import { BlogPost } from "@/types";
import { Container } from "@/components/ui/Container";
import { FiClock, FiArrowRight, FiSearch } from "react-icons/fi";
import { useTypewriter } from "@/hooks/useTypewriter";

const SEARCH_PHRASES = [
  "Search for success stories...",
  "Search for application tips...",
  "Search for university news...",
  "Search for global opportunities...",
];

interface BlogListProps {
  initialBlogPosts?: BlogPost[];
}

export default function BlogList({ initialBlogPosts }: BlogListProps) {
  const blogPosts = initialBlogPosts || BLOG_POSTS;
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { text: placeholder } = useTypewriter(SEARCH_PHRASES);

  const categories = ["All", "Success Stories", "Application Tips", "University Life", "NGO News"];

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post: BlogPost) => {
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [blogPosts, activeCategory, searchTerm]);

  return (
    <section className="py-24 bg-white">
      <Container>
        {/* Standardized Search & Filters */}
        <div className="flex flex-col items-center mb-20 space-y-10">
          <div className="relative w-full max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <FiSearch className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={placeholder}
              className="block w-full pl-12 sm:pl-16 pr-6 py-4 sm:py-6 bg-white border border-muted rounded-full focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-xl text-base sm:text-xl placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Scrollable Filters on Mobile */}
          <div className="w-full overflow-x-auto hide-scrollbar pb-2 sm:pb-0">
            <div className="flex sm:flex-wrap sm:justify-center gap-3 sm:gap-4 px-4 sm:px-0 min-w-max sm:min-w-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${
                    activeCategory === cat
                      ? "bg-accent text-white shadow-xl sm:scale-105"
                      : "bg-surface text-gray-500 hover:bg-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Grid - Magazine Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPosts.map((post: BlogPost, index: number) => {
            const isFeatured = index === 0 && activeCategory === "All" && searchTerm === "";
            
            return (
              <Link 
                key={post.id}
                href={`/blog/${post.slug}`}
                className={`group flex flex-col ${isFeatured ? "md:col-span-2 lg:col-span-2 md:flex-row" : ""}`}
              >
                <div className={`relative overflow-hidden rounded-[2.5rem] bg-surface ${
                  isFeatured ? "md:w-1/2 aspect-[4/3]" : "aspect-[4/3] mb-8"
                }`}>
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] uppercase font-black px-4 py-2 rounded-xl tracking-widest shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className={`flex flex-col justify-center ${isFeatured ? "md:w-1/2 md:pl-12 py-8" : ""}`}>
                  <div className="flex items-center gap-4 mb-4 text-xs font-bold text-accent uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <FiClock /> {post.readingTime}
                    </span>
                    <span className="w-1 h-1 bg-muted rounded-full" />
                    <span>{post.date}</span>
                  </div>

                  <h3 className={`${
                    isFeatured ? "text-3xl md:text-5xl" : "text-2xl"
                  } font-black text-primary leading-tight mb-6 group-hover:text-accent transition-colors`}>
                    {post.title}
                  </h3>

                  <p className="text-gray-500 text-lg leading-relaxed mb-8 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-muted">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-muted">
                        <Image
                          src={post.authorAvatar || "/images/victor_izquierda.png"}
                          alt={post.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-black text-primary leading-none">{post.author}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{post.authorRole}</p>
                      </div>
                    </div>
                    
                    <div className="w-12 h-12 rounded-full border border-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all group-hover:scale-110">
                      <FiArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mega-Pill Newsletter Style */}
        <div className="mt-24 sm:mt-40 mb-10">
          <div className="relative max-w-6xl mx-auto bg-white rounded-[2rem] sm:rounded-full py-8 sm:py-10 px-6 sm:px-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 group transition-all hover:shadow-accent/10">
            {/* Background Texture inside the pill */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#ff6b00_1px,transparent_1px)] [background-size:15px:15px] rounded-[2rem] sm:rounded-full" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8 lg:pl-6 text-center md:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-primary leading-tight">
                  Join our <span className="text-accent italic">Newsletter</span>
                </h2>
                <p className="text-gray-400 font-bold text-[10px] sm:text-sm uppercase tracking-widest">
                  Exclusive tips & global opportunities
                </p>
              </div>
            </div>

            <div className="relative z-10 w-full lg:max-w-md">
              <div className="flex flex-col sm:flex-row bg-surface rounded-[1.5rem] sm:rounded-full p-2 border border-muted focus-within:border-accent transition-all shadow-inner gap-2 sm:gap-0">
                <input 
                  type="email" 
                  placeholder="Enter your email address..." 
                  className="flex-grow bg-transparent px-4 sm:px-6 py-3 sm:py-4 outline-none text-primary font-bold placeholder:text-gray-400 text-sm sm:text-base"
                />
                <button className="bg-accent text-white px-8 py-3 sm:py-2.5 rounded-xl sm:rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg w-full sm:w-auto">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
