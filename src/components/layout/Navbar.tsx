"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS } from "@/constants/mockData";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Pages that should always have a solid/dark navbar
  const isSolidPage = pathname.includes("/programs/") || pathname.includes("/blog/") || pathname === "/contact";
  const shouldBeSolid = isScrolled || isOpen || isSolidPage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Hide navbar entirely on contact page and admin panel
  if (pathname === "/contact" || pathname.startsWith("/admin")) return null;

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        shouldBeSolid ? "bg-surface shadow-md py-2" : "bg-transparent py-3"
      }`}
      aria-label="Main navigation"
    >
      <Container>
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center" aria-label="GotAccepted home">
            <Image
              src={shouldBeSolid ? "/images/complete_logo_color.png" : "/images/complete_logo_orange_white.png"}
              alt="GotAccepted Logo"
              width={160}
              height={44}
              className="object-contain"
              style={{ width: "auto", height: "auto", maxHeight: "44px" }}
              priority
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative text-sm font-bold transition-colors pb-0.5 ${
                    shouldBeSolid
                      ? isActive ? "text-accent" : "text-dark hover:text-accent"
                      : isActive ? "text-accent" : "text-surface hover:text-accent"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                  {/* Active underline indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full" />
                  )}
                </Link>
              );
            })}
            <Link 
              href="/contact" 
              className="bg-accent text-surface hover:bg-opacity-90 shadow-md hover:shadow-lg px-5 py-2 text-sm rounded-lg font-semibold transition-all duration-300 cursor-pointer"
            >
              Contact
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${
                shouldBeSolid ? "text-primary" : "text-surface"
              } hover:text-accent focus:outline-none`}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden bg-surface border-t border-muted pb-6 shadow-xl absolute w-full left-0 top-full"
          >
            <div className="flex flex-col space-y-2 px-4 pt-4">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`py-3 px-4 rounded-xl font-bold transition-colors ${
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-dark hover:text-accent hover:bg-surface"
                    }`}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link 
                href="/contact" 
                onClick={() => setIsOpen(false)} 
                className="pt-2 block"
              >
                <div className="bg-accent text-surface hover:bg-opacity-90 shadow-md hover:shadow-lg px-6 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer w-full text-center">
                  Contact
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
