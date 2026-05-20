"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { FiInstagram, FiLinkedin, FiYoutube, FiFacebook } from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();

  const instagramUrl = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "https://instagram.com/gotacceptedorg";
  const linkedinUrl = process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "https://linkedin.com/company/gotacceptedorg";
  const tiktokUrl = process.env.NEXT_PUBLIC_SOCIAL_TIKTOK || "https://tiktok.com/@gotacceptedorg";
  const youtubeUrl = process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || "https://youtube.com/@gotacceptedorg";
  const facebookUrl = process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "https://www.facebook.com/gotacceptedorg";

  // Hide footer on contact page and admin panel
  if (pathname === "/contact" || pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative bg-primary text-surface py-8 md:py-10 overflow-hidden">
      {/* Decorative background shapes — Significantly more separated for mobile */}
      {/* Mobile background shapes */}
      <div className="absolute top-0 right-0 w-[80%] h-[120%] bg-white/5 rounded-[4rem] rotate-[15deg] -translate-y-1/2 translate-x-1/2 z-0 md:hidden" />
      <div className="absolute bottom-0 left-0 w-[60%] h-[100%] bg-white/5 rounded-[3rem] -rotate-[10deg] translate-y-2/3 -translate-x-1/3 z-0 md:hidden" />

      {/* Desktop background shapes */}
      <div className="hidden md:block absolute top-0 left-[70%] w-[24%] h-[160%] bg-white/5 rounded-[5rem] rotate-[15deg] -translate-y-[70%] z-0" />
      <div className="hidden md:block absolute bottom-0 left-[36%] w-[24%] h-[160%] bg-white/5 rounded-[5rem] rotate-[15deg] translate-y-[70%] z-0" />

      <Container className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-10 text-center md:text-left">
          
          {/* Left: logo and tagline */}
          <div className="max-w-md flex flex-col items-center md:items-start relative">
            <div className="mb-4 inline-block">
              <Image
                src="/images/complete_logo_white.png"
                alt="GotAccepted Logo"
                width={160}
                height={45}
                className="object-contain"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <p className="text-surface/80 text-sm md:text-base leading-relaxed">
              Empowering students globally to achieve their educational dreams through accessible opportunities.
            </p>
            
            {/* Dot Grid Pattern - Only visible on PC/Desktop, absolute positioned under tagline so it doesn't expand the footer height */}
            <div className="hidden md:grid grid-cols-8 gap-[10px] absolute top-full left-0 mt-5 opacity-20 w-max" aria-hidden="true">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-[3px] h-[3px] bg-white rounded-full" />
              ))}
            </div>
          </div>
          
          {/* Right: social links — All same size (24) */}
          <div className="flex items-center space-x-6 md:space-x-8">
            <a 
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow GotAccepted on Facebook"
              className="hover:text-accent transition-transform hover:-translate-y-1"
            >
              <FiFacebook size={24} />
            </a>
            <a 
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow GotAccepted on TikTok"
              className="hover:text-accent transition-transform hover:-translate-y-1"
            >
              <FaTiktok size={24} />
            </a>
            <a 
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow GotAccepted on Instagram"
              className="hover:text-accent transition-transform hover:-translate-y-1"
            >
              <FiInstagram size={24} />
            </a>
            <a 
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Connect with GotAccepted on LinkedIn"
              className="hover:text-accent transition-transform hover:-translate-y-1"
            >
              <FiLinkedin size={24} />
            </a>
            <a 
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch GotAccepted on YouTube"
              className="hover:text-accent transition-transform hover:-translate-y-1"
            >
              <FiYoutube size={24} />
            </a>
          </div>
          
        </div>
        
        {/* Copyright */}
        <div className="mt-8 text-center text-surface/40 text-xs">
          <p>&copy; {new Date().getFullYear()} GotAccepted. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
