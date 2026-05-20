"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Title } from "@/components/ui/Title";
import { FiMinus, FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

const FAQS = [
  {
    question: "What exactly does GotAccepted do?",
    answer: "We are an educational NGO dedicated to bridging the gap between ambitious students and global opportunities. We provide mentorship, resources, and a platform to discover scholarships and university programs worldwide."
  },
  {
    question: "How do I know if I'm eligible for a scholarship?",
    answer: "Eligibility varies by program, but our platform allows you to filter by degree level, country, and field of study. Our mentors also help you identify the best matches for your specific profile and academic background."
  },
  {
    question: "When is the best time to start my application?",
    answer: "The earlier, the better. Most international applications open 8-12 months before the start date. We recommend starting your preparation at least a year in advance to secure all necessary documentation and improve your profile."
  },
  {
    question: "Do you offer 1-on-1 mentorship?",
    answer: "Yes! Our core mission is personalized guidance. Through our specialized programs, you can work directly with mentors who have already succeeded in getting into top-tier universities and winning major scholarships."
  }
];

export default function FAQ() {
  const [selectedFaq, setSelectedFaq] = useState<typeof FAQS[number] | null>(null);

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <Container>
        {/* Centered Header */}
        <div className="flex flex-col items-center text-center mb-20 space-y-4">
          <h2 className="text-accent text-sm font-black uppercase tracking-[0.4em]">
            Support
          </h2>
          <Title as="h2" className="text-4xl md:text-6xl font-black text-primary leading-tight">
            Still have <br /> 
            <span className="text-accent italic font-serif">questions?</span>
          </Title>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch bg-surface/30 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-muted/50 shadow-xl">
          {/* Left Side: Integrated Image */}
          {/* Left Side: Integrated Image with more visibility */}
          <div className="lg:col-span-5 relative min-h-[320px] md:min-h-[400px] lg:min-h-full bg-surface/50">
            <Image
              src="/images/maksim_derecha.png"
              alt="Expert Mentor"
              fill
              className="object-contain object-top p-2 md:p-0"
            />
            {/* Subtle overlay for integration */}
            <div className="absolute inset-0 bg-primary/5 mix-blend-multiply pointer-events-none" />
          </div>

          {/* Right Side: Questions */}
          <div className="lg:col-span-7 p-6 md:p-16 flex flex-col justify-center relative">
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              {FAQS.map((faq, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedFaq(faq)}
                  className="group w-full p-5 md:p-8 bg-white border border-muted/50 rounded-2xl md:rounded-3xl flex flex-col md:flex-row items-center md:justify-between text-center md:text-left gap-4 md:gap-6 transition-all hover:shadow-xl hover:border-accent/20"
                >
                  <span className="text-sm md:text-xl font-black text-primary group-hover:text-accent transition-colors w-full">
                    {faq.question}
                  </span>
                  <div className="hidden md:flex w-10 h-10 rounded-full bg-primary/5 text-primary items-center justify-center group-hover:bg-accent group-hover:text-white transition-all flex-shrink-0">
                    <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>

            {/* Tap to Reveal Overlay — Optimized for Mobile */}
            {selectedFaq && (
              <div className="absolute inset-0 z-30 bg-white/98 backdrop-blur-md p-6 md:p-16 flex flex-col justify-center items-center text-center lg:text-left lg:items-start animate-in fade-in slide-in-from-bottom lg:slide-in-from-right duration-500">
                <button 
                  onClick={() => setSelectedFaq(null)}
                  className="absolute top-6 right-6 flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] hover:text-accent transition-colors group"
                >
                  Close <FiMinus className="text-lg group-hover:rotate-90 transition-transform" />
                </button>
                
                <div className="max-w-xl space-y-4 md:space-y-6 flex flex-col items-center lg:items-start">
                  <span className="text-accent text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">Expert Answer</span>
                  <h3 className="text-xl md:text-4xl font-black text-primary leading-tight">
                    {selectedFaq.question}
                  </h3>
                  <p className="text-base md:text-xl text-gray-500 font-medium leading-relaxed italic border-l-4 border-accent pl-4 md:pl-6 text-center lg:text-left">
                    {selectedFaq.answer}
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={() => setSelectedFaq(null)}
                    className="mt-4 md:mt-6 rounded-xl px-8 py-2 text-sm"
                  >
                    Got it!
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
