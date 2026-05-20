"use client";

import Image from "next/image";
import { Title } from "@/components/ui/Title";
import { Container } from "@/components/ui/Container";

export default function HeroTeam() {
  return (
    <section className="relative min-h-[500px] sm:min-h-[560px] md:min-h-[680px] lg:h-[80vh] overflow-hidden bg-[#1a2e6e] flex items-center">
      {/* Background shapes — Synchronized with Home Hero */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-15%] md:left-[-5%] w-[80%] md:w-[55%] h-[120%] md:h-[130%] bg-[#1f4594] rounded-[3rem] md:rounded-[4rem] rotate-[12deg] z-0" />
        <div className="absolute top-[15%] left-[10%] md:left-[25%] w-[70%] md:w-[45%] h-[100%] bg-[#2550b0] rounded-[3rem] md:rounded-[4rem] rotate-[12deg] z-0" />
        <div className="absolute top-[-15%] right-[-15%] md:right-[-5%] w-[60%] md:w-[40%] h-[120%] md:h-[130%] bg-[#1f4594] rounded-[3rem] md:rounded-[4rem] rotate-[12deg] z-0" />
      </div>

      <Container className="relative z-20 h-full flex items-center justify-center pt-24 pb-12 lg:pt-20 lg:pb-10">
        <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12 h-full">

          {/* Text — Centered Horizontally & Vertically on all screens */}
          <div className="z-30 max-w-xl w-full text-center flex flex-col items-center order-1 lg:order-2 flex-grow lg:flex-grow-0 justify-center">
            <Title
              as="h1"
              className="leading-tight text-surface font-black drop-shadow-2xl text-6xl sm:text-8xl lg:text-8xl"
            >
              Our <br />
              <span className="text-accent italic">Team</span>
            </Title>
          </div>

          {/* Image — Only visible on Desktop (Right side) */}
          <div className="hidden lg:block relative w-[32rem] pointer-events-none z-10 flex-shrink-0 order-2">
            <Image
              src="/images/victor_izquierda.png"
              alt="GotAccepted Team Member"
              width={1200}
              height={900}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

        </div>
      </Container>
    </section>
  );
}
