"use client";

import Link from "next/link";
import Image from "next/image";
import { FiHome, FiCompass, FiSearch } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#1a2e6e] flex items-center justify-center">
      {/* Decorative background shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-15%] md:left-[-5%] w-[80%] md:w-[55%] h-[120%] md:h-[130%] bg-[#1f4594] rounded-[3rem] md:rounded-[4rem] rotate-[12deg] z-0" />
        <div className="absolute top-[15%] left-[10%] md:left-[25%] w-[70%] md:w-[45%] h-[100%] bg-[#2550b0] rounded-[3rem] md:rounded-[4rem] rotate-[12deg] z-0" />
        <div className="absolute top-[-15%] right-[-15%] md:right-[-5%] w-[60%] md:w-[40%] h-[120%] md:h-[130%] bg-[#1f4594] rounded-[3rem] md:rounded-[4rem] rotate-[12deg] z-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 py-12 max-w-lg mx-auto w-full flex flex-col items-center">
        
        {/* Brand logo - Above the 404 */}
        <div className="mb-8">
          <Image
            src="/images/complete_logo_orange_white.png"
            alt="GotAccepted"
            width={160}
            height={46}
            className="object-contain h-10 w-auto opacity-100"
            priority
          />
        </div>

        {/* 404 Number - Serif and balanced size */}
        <div className="relative mb-6">
          <div
            className="font-serif italic font-black text-accent leading-none select-none tracking-tighter drop-shadow-2xl"
            style={{ fontSize: "clamp(7rem, 20vw, 10rem)" }}
          >
            404
          </div>
        </div>

        <div className="space-y-4 mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
            Lost in <span className="text-accent italic">space?</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg font-medium max-w-sm mx-auto leading-relaxed">
            The page you are looking for has vanished. Let&apos;s guide you back to your academic path.
          </p>
        </div>

        {/* Navigation actions - Clean & Balanced */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="group w-full sm:w-auto px-10 py-5 bg-accent text-white font-black rounded-2xl hover:bg-white hover:text-primary transition-all shadow-xl flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
          >
            <FiHome className="text-xl" />
            Back to Home
          </Link>
          
          <div className="flex gap-4 w-full sm:w-auto">
            <Link
              href="/programs"
              className="flex-1 sm:flex-none p-5 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
              title="Programs"
            >
              <FiCompass className="text-xl" />
            </Link>
            <Link
              href="/scholarships"
              className="flex-1 sm:flex-none p-5 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
              title="Scholarships"
            >
              <FiSearch className="text-xl" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
