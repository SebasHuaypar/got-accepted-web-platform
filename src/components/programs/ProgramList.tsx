"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { PROGRAMS } from "@/constants/mockData";
import { Program } from "@/types";
import { Title } from "@/components/ui/Title";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FiClock } from "react-icons/fi";
import { useTypewriter } from "@/hooks/useTypewriter";

const CATEGORIES = ["All", "Undergraduate", "Graduate", "Scholarships", "Workshops"] as const;

const SEARCH_PHRASES = [
  "Search for mentorships...",
  "Search for Ivy League programs...",
  "Search for essay workshops...",
  "Search for scholarships...",
];

interface ProgramListProps {
  initialPrograms?: Program[];
}

export default function ProgramList({ initialPrograms }: ProgramListProps) {
  const programs = initialPrograms || PROGRAMS;
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const { text: placeholder } = useTypewriter(SEARCH_PHRASES);

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [programs, activeCategory, searchTerm]);

  return (
    <section className="py-24 bg-white min-h-[800px]">
      <Container>
        <div className="flex flex-col items-center mb-16 space-y-10">
          {/* Search Bar - Standardized Style */}
          <div className="relative w-full max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={placeholder}
              className="block w-full pl-12 sm:pl-16 pr-6 py-4 sm:py-6 bg-white border border-muted rounded-full focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-xl text-base sm:text-xl placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Scrollable Category Tabs */}
          <div className="w-full overflow-x-auto hide-scrollbar pb-2 sm:pb-0">
            <div className="flex sm:flex-wrap sm:justify-center gap-3 sm:gap-4 px-4 sm:px-0 min-w-max sm:min-w-0">
              {CATEGORIES.map((cat) => (
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

        <div className="space-y-32">
          {filteredPrograms.map((program, index) => (
            <div 
              key={program.id}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${
                index % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image Side */}
              <div className="flex-1 w-full group">
                <div className="relative aspect-video lg:aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl border border-muted transition-transform duration-700 hover:scale-[1.02]">
                  <Image
                    src={program.imageUrl || "/images/gotaccepted_mobile_mockup.png"}
                    alt={program.title}
                    fill
                    className="object-cover"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur-md text-primary text-xs font-black px-5 py-2 rounded-full shadow-lg uppercase tracking-widest">
                      {program.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Side — Centered on mobile */}
              <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
                <div className="space-y-4 flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-2 text-accent text-xs md:text-sm font-black uppercase tracking-[0.2em]">
                    <FiClock className="text-lg md:text-xl" />
                    <span>{program.duration}</span>
                  </div>
                  
                  <Title as="h3" className="text-3xl md:text-5xl font-black text-primary leading-[1.1] tracking-tight">
                    {program.title}
                  </Title>
                  
                  <p className="text-gray-600 text-base md:text-xl leading-relaxed font-medium">
                    {program.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2 md:pt-4 w-full sm:w-auto">
                  <Link href={`/programs/${program.slug}`} className="w-full sm:w-auto">
                    <Button 
                      variant="primary" 
                      className="w-full px-8 md:px-10 py-3 md:py-4 rounded-2xl shadow-xl hover:scale-105 transition-all font-black text-sm md:text-base"
                    >
                      View Details
                    </Button>
                  </Link>
                  <Link href="/contact" className="w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      className="w-full px-8 md:px-10 py-3 md:py-4 rounded-2xl border-2 font-black text-sm md:text-base"
                    >
                      Contact an Expert
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-40 bg-surface rounded-[3rem] border-2 border-dashed border-muted">
            <p className="text-gray-400 text-2xl font-medium">
              We couldn&apos;t find any programs matching your search.
            </p>
            <Button 
              variant="outline" 
              className="mt-8"
              onClick={() => {setSearchTerm(""); setActiveCategory("All");}}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
