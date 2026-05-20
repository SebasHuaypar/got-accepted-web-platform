"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Title } from "@/components/ui/Title";

const AboutUs = () => {
  return (
    <section className="py-16 md:py-32 bg-white relative overflow-hidden border-y border-gray-50">
      <Container>
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-20 lg:gap-32 text-center lg:text-left">
          
          {/* Left column: the organization narrative */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-[1.2] space-y-10 flex flex-col items-center lg:items-start"
          >
            <div className="space-y-4">
              <span className="text-accent font-bold uppercase tracking-[0.3em] text-sm block">
                The Organization
              </span>
              <Title as="h2" className="text-primary text-5xl md:text-7xl font-black leading-[1.05] tracking-tight uppercase">
                Our Story <br />
                &amp; <span className="font-serif italic text-accent lowercase">Mission</span>
              </Title>
            </div>

            <div className="space-y-8">
              <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed font-light">
                We are a youth-led non-profit organization dedicated to providing <span className="font-bold text-primary">information, opportunities, and coaching</span> for young Latinos aspiring to study abroad.
              </p>
              
              <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Founded by Peruvian-American youths, our mission is to break economic and cultural obstacles, empowering the next generation of global citizens.
              </p>
            </div>
          </motion.div>

          {/* Right column: key focus areas */}
          <div className="flex-1 space-y-16 pt-12 lg:pt-24 flex flex-col items-center lg:items-start">
            {[
              { id: "01", title: "Global Network", text: "Connecting ambitious Latino youth with a worldwide network of mentors and peers.", colorClass: "text-primary", colorFaintClass: "text-primary/10" },
              { id: "02", title: "US Focus", text: "Specialized guidance for accessing top-tier educational opportunities in the United States.", colorClass: "text-accent", colorFaintClass: "text-accent/10" }
            ].map((area, idx) => (
              <motion.div 
                key={area.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.2 + 0.3 }}
                className="relative group flex flex-col items-center lg:items-start"
              >
                {/* Use explicit class strings — avoids Tailwind JIT purging dynamic template literals */}
                <span className={`${area.colorFaintClass} text-7xl font-black absolute -top-10 left-1/2 -translate-x-1/2 lg:left-[-6px] lg:translate-x-0 select-none`}>{area.id}</span>
                <div className="relative">
                  <h3 className={`text-2xl font-black ${area.colorClass} uppercase mb-4 tracking-tight`}>{area.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg font-light max-w-sm">
                    {area.text}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Editorial CTA */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-8"
            >
              <Link 
                href="/about" 
                className="group inline-flex items-center gap-4 sm:gap-6 text-base sm:text-xl font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
              >
                Discover our journey
                <div className="relative w-12 h-[2px] bg-accent transition-all group-hover:w-20 overflow-hidden">
                  <div className="absolute inset-0 bg-primary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                </div>
              </Link>
            </motion.div>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default AboutUs;
