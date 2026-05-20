"use client";

import Image from "next/image";
import { Title } from "@/components/ui/Title";
import { Container } from "@/components/ui/Container";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { Member } from "@/types";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  linkedin?: string;
  instagram?: string;
}

interface TeamArea {
  name: string;
  description?: string;
  members: TeamMember[];
}

const TEAM_DATA: TeamArea[] = [
  {
    name: "Leadership & Strategy",
    description: "Driving the vision and long-term goals of GotAccepted.",
    members: [
      { id: "1", name: "Victor Name", role: "CEO & Founder", avatarUrl: "/images/luciana.png", linkedin: "#", instagram: "#" },
      { id: "2", name: "Team Member", role: "Chief Operations", avatarUrl: "/images/luciana.png", linkedin: "#", instagram: "#" },
    ],
  },
  {
    name: "Academic Excellence",
    description: "Ensuring the highest quality in our mentorship and programs.",
    members: [
      { id: "3", name: "Team Member", role: "Academic Director", avatarUrl: "/images/luciana.png", linkedin: "#", instagram: "#" },
      { id: "4", name: "Team Member", role: "Lead Mentor", avatarUrl: "/images/luciana.png", linkedin: "#", instagram: "#" },
      { id: "5", name: "Team Member", role: "Senior Advisor", avatarUrl: "/images/luciana.png", linkedin: "#", instagram: "#" },
    ],
  },
  {
    name: "Outreach & Growth",
    description: "Connecting with partners and expanding our global reach.",
    members: [
      { id: "6", name: "Team Member", role: "Growth Manager", avatarUrl: "/images/luciana.png", linkedin: "#", instagram: "#" },
      { id: "7", name: "Team Member", role: "Partnerships", avatarUrl: "/images/luciana.png", linkedin: "#", instagram: "#" },
      { id: "8", name: "Team Member", role: "Communications", avatarUrl: "/images/luciana.png", linkedin: "#", instagram: "#" },
    ],
  },
];

import { useState, useMemo } from "react";

// ... interfaces stay the same ...

interface TeamListProps {
  initialMembers?: Member[];
}

export default function TeamList({ initialMembers }: TeamListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const teamData = useMemo(() => {
    if (!initialMembers) return TEAM_DATA;

    const groups: { [key: string]: TeamMember[] } = {
      "Leadership & Strategy": [],
      "Academic Excellence": [],
      "Outreach & Growth": [],
    };

    initialMembers.forEach((m) => {
      const member: TeamMember = {
        id: m.id,
        name: m.name,
        role: m.role,
        avatarUrl: m.avatarUrl || "/images/luciana.png",
        linkedin: m.linkedin,
        instagram: m.instagram,
      };

      const g = m.group || (m.category === "BOARD" ? "Leadership & Strategy" : "Academic Excellence");
      if (!groups[g]) {
        groups[g] = [];
      }
      groups[g].push(member);
    });

    return Object.entries(groups)
      .map(([name, members]) => ({
        name,
        description: name === "Leadership & Strategy" 
          ? "Driving the vision and long-term goals of GotAccepted." 
          : name === "Academic Excellence"
          ? "Ensuring the highest quality in our mentorship and programs."
          : "Connecting with partners and expanding our global reach.",
        members,
      }))
      .filter((g) => g.members.length > 0);
  }, [initialMembers]);

  const filteredData = useMemo(() => {
    return teamData.map(area => ({
      ...area,
      members: area.members.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(area => area.members.length > 0);
  }, [teamData, searchTerm]);

  return (
    <section className="py-24 bg-surface/30">
      <Container>
        <div className="mb-24 text-center">
          <Title as="h2" className="text-4xl md:text-6xl font-black text-primary mb-6">
            Meet the <span className="text-accent italic font-serif">Force</span> <br /> Behind the Mission
          </Title>
          <p className="text-gray-600 max-w-2xl mx-auto text-xl leading-relaxed mb-12">
            Our team is composed of passionate professionals dedicated to bridging the gap between Latino talent and global opportunities.
          </p>

          <div className="max-w-md mx-auto relative px-4">
            <input
              type="text"
              placeholder="Search by name or role..."
              className="w-full px-8 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 shadow-lg text-lg transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-24 md:space-y-32">
          {filteredData.map((area, areaIndex) => (
            <div key={areaIndex} className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-gray-100 pt-16">
              {/* Members Grid — 2 columns on mobile */}
              <div className="lg:col-span-9 order-2 lg:order-1">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-8 gap-y-12 md:gap-y-16">
                  {area.members.map((member) => (
                    <div 
                      key={member.id} 
                      className="group flex flex-col space-y-4 md:space-y-6"
                    >
                      <div className="relative aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl transition-all duration-500 group-hover:scale-[1.02]">
                        <Image
                          src={member.avatarUrl}
                          alt={member.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Social Icons Overlay — Always visible on mobile */}
                        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex gap-2 md:gap-3 translate-y-0 lg:translate-y-4 opacity-100 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 transition-all duration-300">
                          {member.linkedin && (
                            <a 
                              href={member.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-colors shadow-lg"
                            >
                              <FaLinkedin className="text-sm md:text-xl" />
                            </a>
                          )}
                          {member.instagram && (
                            <a 
                              href={member.instagram} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-colors shadow-lg"
                            >
                              <FaInstagram className="text-sm md:text-xl" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 text-center md:text-left px-2">
                        <h4 className="text-lg md:text-2xl font-bold text-primary tracking-tight leading-tight">
                          {member.name}
                        </h4>
                        <p className="text-accent font-semibold text-[10px] md:text-sm uppercase tracking-wider">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Area Sidebar — Centered on mobile */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                <div className="lg:sticky lg:top-32 space-y-4 text-center lg:text-right">
                  <h3 className="text-2xl md:text-3xl font-black text-primary tracking-tight uppercase">
                    {area.name}
                  </h3>
                  {area.description && (
                    <p className="text-gray-500 text-sm md:text-base border-t-2 md:border-t-0 md:border-l-2 lg:border-l-0 lg:border-r-2 border-accent/30 pt-4 md:pt-0 md:pl-4 lg:pl-0 lg:pr-4">
                      {area.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
