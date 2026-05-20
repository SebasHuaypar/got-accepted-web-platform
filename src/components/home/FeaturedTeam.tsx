"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Title } from "@/components/ui/Title";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MEMBERS } from "@/constants/mockData";
import { Member } from "@/types";
import { FaLinkedin, FaInstagram } from "react-icons/fa";

interface FeaturedTeamProps {
  initialMembers?: Member[];
}

export default function FeaturedTeam({ initialMembers }: FeaturedTeamProps) {
  const members = initialMembers || MEMBERS;
  // Filter for BOARD members and take the first 4
  const boardMembers = members.filter(member => member.category === "BOARD").slice(0, 4);

  return (
    <section className="py-24 bg-primary text-surface overflow-hidden relative">
      {/* Decorative background elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-0" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 z-0" 
      />

      <Container className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center items-center text-center mb-16"
        >
          <Title as="h2" className="text-4xl md:text-5xl font-black mb-6">
            The Minds Behind <br />
            <span className="text-accent italic font-serif">GotAccepted</span>
          </Title>
          <p className="text-surface/70 text-lg md:text-xl max-w-2xl">
            Meet our leadership board, a group of dedicated individuals committed to opening doors for the next generation of Latino leaders.
          </p>
        </motion.div>

        {boardMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-[2.5rem] border border-white/10 text-center max-w-lg mx-auto mb-12">
            <p className="text-white font-black text-lg">Our board is being updated.</p>
            <p className="text-white/60 text-sm mt-1">Check back soon to see our leadership announcements.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 mb-20">
            {boardMembers.map((member, idx) => (
              <motion.div 
                key={member.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-xl">
                  <Image
                    src={member.avatarUrl || "/images/victor_izquierda.png"}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay with social links — Always visible on mobile, hover on desktop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 sm:pb-8">
                    <div className="flex gap-2 sm:gap-4">
                      <a href={member.linkedin} className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-colors">
                        <FaLinkedin size={16} />
                      </a>
                      <a href={member.instagram} className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-colors">
                        <FaInstagram size={16} />
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="text-base sm:text-xl font-bold mb-1">{member.name}</h4>
                  <p className="text-accent text-[9px] sm:text-sm font-medium uppercase tracking-widest leading-tight">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Prominent Centered CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <Link href="/team">
            <Button 
              variant="accent" 
              className="px-8 py-3 text-sm sm:text-base font-black shadow-[0_0_20px_rgba(255,107,0,0.4)] hover:shadow-[0_0_30px_rgba(255,107,0,0.6)] hover:scale-105 active:scale-95 transition-all rounded-full group flex items-center gap-3 uppercase tracking-widest"
            >
              Meet the Entire Team
              <span className="group-hover:translate-x-1 transition-transform text-xl">→</span>
            </Button>
          </Link>
          <p className="mt-4 text-surface/50 text-xs sm:text-sm font-medium max-w-[250px] sm:max-w-none">
            Discover the passion and talent across all our departments
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
