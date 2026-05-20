"use client";

import Image from "next/image";
import { Title } from "@/components/ui/Title";
import { Container } from "@/components/ui/Container";

export default function HeroPrograms() {
  return (
    <section className="relative min-h-[500px] sm:min-h-[560px] md:min-h-[680px] lg:h-[80vh] overflow-hidden bg-[#1a2e6e] flex items-center">
      {/* Background shapes — Synchronized with Home Hero */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-15%] md:left-[-5%] w-[80%] md:w-[55%] h-[120%] md:h-[130%] bg-[#1f4594] rounded-[3rem] md:rounded-[4rem] rotate-[12deg] z-0" />
        <div className="absolute top-[15%] left-[10%] md:left-[25%] w-[70%] md:w-[45%] h-[100%] bg-[#2550b0] rounded-[3rem] md:rounded-[4rem] rotate-[12deg] z-0" />
        <div className="absolute top-[-15%] right-[-15%] md:right-[-5%] w-[60%] md:w-[40%] h-[120%] md:h-[130%] bg-[#1f4594] rounded-[3rem] md:rounded-[4rem] rotate-[12deg] z-0" />
      </div>

      <Container className="relative z-20 h-full flex items-center lg:items-end justify-center pt-24 pb-0 lg:pt-20">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center w-full gap-0 h-full">

          {/* Image — Left side, overlapping slightly */}
          <div className="hidden lg:block relative w-[34rem] xl:w-[42rem] pointer-events-none z-10 flex-shrink-0 order-2 lg:order-1 self-end lg:-mr-28">
            <Image
              src="/images/lindsey.png"
              alt="GotAccepted Programs"
              width={1200}
              height={900}
              className="w-full h-auto object-contain object-bottom"
              priority
            />
          </div>

          {/* Text — Centered on all screens */}
          <div className="z-30 max-w-fit w-full text-center flex flex-col items-center order-1 lg:order-2 flex-grow lg:flex-grow-0 justify-center lg:justify-end lg:pb-32">
            <Title
              as="h1"
              className="leading-tight text-surface font-black drop-shadow-2xl text-6xl sm:text-8xl lg:text-8xl"
            >
              Your <br />
              Future <br />
              <span className="text-accent italic">Defined</span>
            </Title>
          </div>

        </div>
      </Container>
    </section>
  );
}
