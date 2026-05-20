"use client";

import { useRef, useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Title } from "@/components/ui/Title";

// Full class strings used explicitly so Tailwind JIT includes them
const values = [
  {
    id: "01",
    title: "Global Network",
    content: "We seek to form a network of contacts of young individuals aiming to study in different parts of the world and who yearn to become global citizens.",
    accentClass: "text-accent"
  },
  {
    id: "02",
    title: "United States",
    content: "We focus on the United States because our founders are Peruvian-American youths who have been preparing to study there and contribute to the improvement of both countries.",
    accentClass: "text-black"
  },
  {
    id: "03",
    title: "Our Mission",
    content: "To support more young Latinos in accessing global educational opportunities, overcoming obstacles, so they can lead positive transformations in their communities.",
    accentClass: "text-primary"
  },
  {
    id: "04",
    title: "Our Vision",
    content: "To become one of the most influential organizations in empowering and assisting young Latinos, providing them with the tools to maximize their personal and professional potential.",
    accentClass: "text-black"
  }
];

export default function SplitScrollValues() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Throttle via requestAnimationFrame — eliminates forced reflow on every scroll event
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!containerRef.current) return;

        const element = containerRef.current;
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const totalHeight = rect.height;

        // Guard: avoid division by zero or negative denominator
        const denominator = totalHeight - viewportHeight;
        const calculatedProgress = denominator <= 0
          ? 0
          : Math.max(0, Math.min(100, (-rect.top / denominator) * 100));

        setProgress(calculatedProgress);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section ref={containerRef} className="bg-white border-t border-gray-100 relative">
      <Container>
        <div className="flex flex-col md:flex-row gap-8 md:gap-24">
          
          {/* Left side: Header — Centered on mobile */}
          <div className="md:w-1/3 pt-20 md:pt-44 md:sticky md:top-24 md:h-fit self-start pb-12 md:pb-[10rem] flex flex-col items-center md:items-start text-center md:text-left w-full">
            <span className="text-accent font-bold tracking-[0.3em] uppercase text-xs sm:text-sm mb-4 block">Strategic</span>
            <Title as="h2" className="text-primary text-5xl sm:text-7xl md:text-7xl font-black leading-none uppercase text-center md:text-left w-full">
              Core <br />
              <span className="font-serif italic lowercase text-primary">pillars</span>
            </Title>
            
            {/* Scroll progress bar — hidden on mobile */}
            <div
              className="mt-12 hidden md:block w-full h-1 bg-gray-100 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Section reading progress"
            >
              <div 
                className="h-full bg-accent transition-all duration-150 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Right side: Values — Centered on mobile */}
          <div className="md:w-2/3 pt-10 md:pt-44 pb-20 md:pb-0 space-y-24 md:space-y-40 md:pl-10">
            {values.map((val) => (
              <div key={val.id} className="relative group text-center md:text-left flex flex-col items-center md:items-start px-4 sm:px-0">
                {/* Background ID number centered on mobile */}
                <span className="text-7xl md:text-9xl font-black opacity-5 absolute -top-10 md:-top-24 left-1/2 -translate-x-1/2 md:left-[-8px] md:translate-x-0 select-none">
                  {val.id}
                </span>
                <div className="relative z-10 w-full flex flex-col items-center md:items-start">
                  <Title as="h3" className={`text-xl md:text-4xl font-black mb-6 md:mb-8 uppercase tracking-tight transition-colors duration-500 ${val.accentClass}`}>
                    {val.title}
                  </Title>
                  <p className="text-base md:text-2xl text-gray-800 leading-relaxed font-light max-w-2xl">
                    {val.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
