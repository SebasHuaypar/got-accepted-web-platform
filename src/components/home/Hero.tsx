"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Title } from "@/components/ui/Title";
import { Container } from "@/components/ui/Container";
import { motion } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";

// Shorter words prevent truncation on narrow mobile screens
const HERO_WORDS = ["Potential", "Future", "Dreams", "Goals"];

export default function Hero() {
  const { text } = useTypewriter(HERO_WORDS);

  return (
    <section className="relative min-h-[600px] sm:min-h-[640px] md:min-h-[700px] lg:h-[80vh] overflow-hidden bg-[#1a2e6e] flex items-center">
      {/* Animated background shapes - Adjusted for mobile "crop" look */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 12 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-[-10%] left-[-15%] md:left-[-5%] w-[80%] md:w-[55%] h-[120%] md:h-[130%] bg-[#1f4594] rounded-[3rem] md:rounded-[4rem]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 12 }}
          transition={{ duration: 1.8, delay: 0.2, ease: "easeOut" }}
          className="absolute top-[15%] left-[10%] md:left-[25%] w-[70%] md:w-[45%] h-[100%] bg-[#2550b0] rounded-[3rem] md:rounded-[4rem]"
        />
        <motion.div
          initial={{ opacity: 0, x: 100, rotate: 20 }}
          animate={{ opacity: 1, x: 0, rotate: 12 }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
          className="absolute top-[-15%] right-[-15%] md:right-[-5%] w-[60%] md:w-[40%] h-[120%] md:h-[130%] bg-[#1f4594] rounded-[3rem] md:rounded-[4rem]"
        />
      </div>

      <Container className="relative z-20 w-full pt-10 sm:pt-24 pb-10">
        {/* Content - Centered on mobile, Left-aligned on md+ */}
        <div className="w-full md:flex-1 md:max-w-xl text-center md:text-left flex flex-col items-center md:items-start z-30 mx-auto md:mx-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Title
              as="h1"
              className="mb-5 leading-tight text-surface font-black drop-shadow-lg text-4xl sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Unlock Your <br />
              <span className="text-accent italic font-serif">
                {text}
                <span className="inline-block w-[2px] h-[0.85em] bg-accent ml-1 animate-pulse opacity-70 translate-y-[10%]" />
              </span>
              <br />
              with GotAccepted
            </Title>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl text-surface/90 mb-8 leading-relaxed drop-shadow-lg max-w-md font-medium"
          >
            We are an NGO born to provide information, opportunities, and guidance to young Latinos who aspire to study in the United States.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/programs" className="w-full sm:w-auto">
              <Button
                variant="accent"
                className="w-full sm:w-auto text-sm sm:text-base px-8 py-3 border-2 border-transparent shadow-xl hover:scale-105 active:scale-95 transition-all font-black"
              >
                Explore Programs
              </Button>
            </Link>
            <Link href="/team" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-sm sm:text-base px-8 py-3 border-2 border-surface text-surface hover:bg-surface/10 transition-all font-black"
              >
                Our Team
              </Button>
            </Link>
          </motion.div>
        </div>

      </Container>

      <motion.div
        initial={{ opacity: 0, x: 100, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "circOut" }}
        className="absolute bottom-0 right-0 w-[58%] max-w-[55rem] pointer-events-none z-10 hidden md:block"
      >
        <Image
          src="/images/hero_image.png"
          alt="GotAccepted Founders"
          width={1400}
          height={1050}
          className="w-full h-auto object-contain object-bottom"
          priority
        />
      </motion.div>
    </section>
  );
}
