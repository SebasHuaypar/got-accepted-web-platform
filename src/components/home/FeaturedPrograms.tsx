import Image from "next/image";
import Link from "next/link";
import { PROGRAMS } from "@/constants/mockData";
import { Program } from "@/types";
import { Container } from "@/components/ui/Container";
import { Title } from "@/components/ui/Title";
import { Button } from "@/components/ui/Button";
import { FiArrowRight, FiClock } from "react-icons/fi";

interface FeaturedProgramsProps {
  initialPrograms?: Program[];
}

export default function FeaturedPrograms({ initialPrograms }: FeaturedProgramsProps) {
  const programs = initialPrograms || PROGRAMS;
  // We take the first 3 programs for the home page
  const featuredPrograms = programs.slice(0, 3);

  return (
    <section className="py-24 bg-white">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 md:mb-16 gap-6 text-center md:text-left">
          <div className="max-w-2xl flex flex-col items-center md:items-start">
            <h2 className="text-accent text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-4">
              Explore Our Services
            </h2>
            <Title as="h2" className="text-3xl md:text-6xl font-black text-primary leading-tight">
              Ready to take the next big step?
            </Title>
          </div>
          <Link href="/programs">
            <Button variant="outline" className="group flex items-center justify-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base font-bold transition-all">
              View All Programs
              <FiArrowRight className="text-lg group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {featuredPrograms.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-surface rounded-[2.5rem] border border-muted text-center max-w-lg mx-auto">
            <p className="text-primary font-black text-lg">No programs available yet.</p>
            <p className="text-gray-400 text-sm mt-1">Our team is designing new educational and mentoring pathways.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
            {featuredPrograms.map((program) => (
              <Link 
                key={program.id} 
                href={`/programs/${program.slug}`}
                className="group flex flex-row sm:flex-col bg-white rounded-2xl sm:rounded-[2.5rem] overflow-hidden border border-muted shadow-md transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative w-[40%] sm:w-full h-auto sm:h-64 overflow-hidden shrink-0">
                  <Image
                    src={program.imageUrl || "/images/gotaccepted_mobile_mockup.png"}
                    alt={program.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="p-4 sm:p-10 flex flex-col flex-grow justify-center sm:justify-start space-y-2 sm:space-y-6">
                  <div className="flex items-center gap-1.5 text-accent text-[8px] sm:text-xs font-black uppercase tracking-widest">
                    <FiClock className="shrink-0" />
                    <span className="truncate">{program.duration}</span>
                  </div>
                  
                  <h3 className="text-sm sm:text-2xl font-black text-primary leading-tight group-hover:text-accent transition-colors line-clamp-2">
                    {program.title}
                  </h3>
                  
                  <p className="text-gray-500 line-clamp-2 text-[10px] sm:text-base font-medium leading-relaxed">
                    {program.description}
                  </p>

                  <div className="pt-1 sm:pt-2 flex items-center text-primary font-black text-[10px] sm:text-sm uppercase tracking-wider group-hover:gap-2 transition-all">
                    Learn More
                    <FiArrowRight className="ml-1 sm:ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
