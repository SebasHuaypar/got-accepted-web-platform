"use client";

import { useState, useMemo } from "react";
import { Container } from "@/components/ui/Container";
import { SCHOLARSHIPS } from "@/constants/mockData";
import { Scholarship } from "@/types";
import { Button } from "@/components/ui/Button";
import { FiSearch, FiAward, FiExternalLink, FiClock } from "react-icons/fi";
import Image from "next/image";
import { useTypewriter } from "@/hooks/useTypewriter";
import { isExpired, formatDeadline } from "@/lib/utils";

const SEARCH_PHRASES = [
  "Search for full funding...",
  "Search for USA scholarships...",
  "Search for master grants...",
  "Search for European funding...",
];

const FILTERS = ["All", "Full Funding", "USA", "Europe", "UK", "Graduate"];

interface ScholarshipSearchProps {
  initialScholarships?: Scholarship[];
}

export default function ScholarshipSearch({ initialScholarships }: ScholarshipSearchProps) {
  const scholarships = initialScholarships || SCHOLARSHIPS;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const { text: placeholder } = useTypewriter(SEARCH_PHRASES);

  const filteredScholarships = useMemo(() => {
    const results = scholarships.filter((s) => {
      const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           s.institution.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = activeFilter === "All" || 
                           s.category.includes(activeFilter) || 
                           s.amount.includes(activeFilter);
      return matchesSearch && matchesFilter;
    });

    // Sort: active scholarships first, expired last
    return results.sort((a, b) => {
      const aExpired = isExpired(a.deadline) ? 1 : 0;
      const bExpired = isExpired(b.deadline) ? 1 : 0;
      return aExpired - bExpired;
    });
  }, [scholarships, searchTerm, activeFilter]);

  return (
    <section className="py-24 bg-surface/30 min-h-screen">
      <Container>
        {/* Search & Filter Header */}
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
              aria-label="Search scholarships"
            />
          </div>

          {/* Scrollable Filter Tabs */}
          <div className="w-full overflow-x-auto hide-scrollbar pb-2 sm:pb-0" role="group" aria-label="Filter scholarships">
            <div className="flex sm:flex-wrap sm:justify-center gap-3 sm:gap-4 px-4 sm:px-0 min-w-max sm:min-w-0">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  aria-pressed={activeFilter === filter}
                  className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all flex-shrink-0 ${
                    activeFilter === filter
                      ? "bg-accent text-white shadow-xl sm:scale-105"
                      : "bg-surface text-gray-500 hover:bg-muted"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scholarships Grid — Passport style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {filteredScholarships.map((s) => {
            const expired = isExpired(s.deadline);
            return (
              <div 
                key={s.id}
                className={`relative bg-[#fcfcfc] rounded-[2rem] overflow-hidden border-2 shadow-xl group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col ${
                  expired ? "border-muted opacity-75" : "border-primary/10"
                }`}
              >
                {/* Background security pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1a2e6e_1px,transparent_1px)] [background-size:20px_20px]" />
                
                {/* Watermark Logo */}
                <div className="absolute -bottom-10 -right-10 w-72 h-72 opacity-[0.1] pointer-events-none transform -rotate-12">
                  <Image
                    src="/images/isotype.png"
                    alt=""
                    aria-hidden="true"
                    width={256}
                    height={256}
                    className="w-full h-full object-contain brightness-0"
                  />
                </div>

                {/* Expired badge */}
                {expired && (
                  <div className="absolute top-6 right-6 z-10 px-4 py-1.5 bg-gray-400 text-white text-xs font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                    <FiClock size={12} />
                    Deadline Passed
                  </div>
                )}
                
                <div className="relative p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-8 md:gap-10 h-full flex-1">
                  {/* Left: Main scholarship data */}
                  <div className="flex-grow space-y-6 md:space-y-8">
                    <div className="flex items-start gap-4 md:gap-6">
                      {/* Award seal */}
                      <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 flex items-center justify-center border-4 border-accent/20 rounded-full bg-white shadow-inner p-2 rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500">
                        <div className="absolute inset-0 border-2 border-accent/10 rounded-full scale-110 border-dashed" />
                        <FiAward className="text-accent text-2xl md:text-3xl" />
                      </div>
                      
                      <div className="space-y-1 md:space-y-2">
                        <p className="text-[10px] md:text-[11px] text-accent font-black uppercase tracking-[0.3em]">Official Document</p>
                        <h3 className="text-2xl md:text-3xl font-black text-primary leading-tight">
                          {s.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-500 font-bold italic">{s.institution}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] md:text-[11px] text-gray-400 font-black uppercase tracking-widest">Financial Grant</p>
                        <p className="text-xl md:text-2xl font-mono font-bold text-primary">{s.amount}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] md:text-[11px] text-gray-400 font-black uppercase tracking-widest">
                          {expired ? "Deadline" : "Application Deadline"}
                        </p>
                        <p className={`text-lg md:text-xl font-mono font-bold ${expired ? "text-gray-400 line-through" : "text-accent"}`}>
                          {formatDeadline(s.deadline)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {s.category.map((cat) => (
                        <span key={cat} className="px-2 md:px-3 py-1 bg-primary text-white text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-md">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Requirements & Apply */}
                  <div className="md:w-64 flex flex-col justify-between border-t-2 md:border-t-0 md:border-l-2 border-dashed border-primary/10 pt-6 md:pt-0 md:pl-10">
                    <div className="space-y-4 md:space-y-6">
                      <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">Required Status</p>
                      <ul className="space-y-3">
                        {s.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                            <p className="text-xs font-bold text-primary/80 leading-tight">{req}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-8">
                      {s.link && s.link !== "#" && !expired ? (
                        <a
                          href={s.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-4 px-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary-dark transition-colors group/btn"
                        >
                          Validate &amp; Apply
                          <FiExternalLink className="group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      ) : (
                        <Button
                          variant="primary"
                          disabled
                          className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest opacity-50 cursor-not-allowed flex items-center justify-center gap-2"
                          aria-disabled="true"
                        >
                          {expired ? "Deadline Passed" : "Coming Soon"}
                          <FiExternalLink />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Decorative punched hole effect */}
                <div className="absolute top-1/2 -left-4 w-8 h-8 bg-surface rounded-full shadow-inner" />
                <div className="absolute top-1/2 -right-4 w-8 h-8 bg-surface rounded-full shadow-inner" />
              </div>
            );
          })}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-muted mt-12">
            <p className="text-gray-400 text-2xl font-medium">No scholarships found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-8"
              onClick={() => {setSearchTerm(""); setActiveFilter("All");}}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
