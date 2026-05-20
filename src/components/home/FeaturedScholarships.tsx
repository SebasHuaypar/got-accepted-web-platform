import Link from "next/link";
import { SCHOLARSHIPS } from "@/constants/mockData";
import { Scholarship } from "@/types";
import { Container } from "@/components/ui/Container";
import { Title } from "@/components/ui/Title";
import { Button } from "@/components/ui/Button";
import { FiArrowRight, FiAward, FiDollarSign } from "react-icons/fi";
import Image from "next/image";

interface FeaturedScholarshipsProps {
  initialScholarships?: Scholarship[];
}

export default function FeaturedScholarships({ initialScholarships }: FeaturedScholarshipsProps) {
  const scholarships = initialScholarships || SCHOLARSHIPS;
  const featuredScholarships = scholarships.slice(0, 2);

  return (
    <section className="py-24 bg-primary text-white overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-2xl translate-y-1/2 translate-x-1/2" />

      <Container className="relative z-10">
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <h2 className="text-accent text-sm font-black uppercase tracking-[0.4em]">
            Financial Opportunities
          </h2>
          <Title as="h2" className="text-4xl md:text-6xl font-black text-white leading-tight">
            Funding Your Academic Future
          </Title>
        </div>

        {featuredScholarships.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-[2.5rem] border border-white/10 text-center max-w-lg mx-auto">
            <p className="text-white font-black text-lg">No scholarships listed yet.</p>
            <p className="text-white/60 text-sm mt-1">We are curating high-impact international funding opportunities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {featuredScholarships.map((s) => (
              <div 
                key={s.id}
                className="relative bg-white/90 backdrop-blur-md rounded-[2.5rem] overflow-hidden shadow-xl group transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#1a2e6e_1px,transparent_1px)] [background-size:20px_20px]" />
                
                {/* Watermark */}
                <div className="absolute -bottom-10 -right-10 w-64 h-64 opacity-[0.05] pointer-events-none transform -rotate-12">
                  <Image
                    src="/images/isotype.png"
                    alt="Watermark"
                    width={256}
                    height={256}
                    className="w-full h-full object-contain brightness-0"
                  />
                </div>

                <div className="relative p-4 sm:p-10 flex flex-row gap-4 sm:gap-8 items-center sm:items-start">
                  <div className="flex-grow space-y-4 sm:space-y-6 flex flex-col items-center sm:items-start text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center border-2 border-accent/20 rounded-full bg-white shadow-sm rotate-[-5deg] group-hover:rotate-0 transition-transform">
                        <FiAward className="text-accent text-xl sm:text-2xl" />
                      </div>
                      <div className="flex flex-col items-center sm:items-start">
                        <p className="text-[8px] sm:text-[10px] text-accent font-black uppercase tracking-widest">Featured Grant</p>
                        <h3 className="text-xs sm:text-2xl font-black text-primary group-hover:text-accent transition-colors line-clamp-2 sm:line-clamp-none">
                          {s.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-row gap-6 sm:gap-8 items-center sm:items-start">
                      <div className="flex flex-col items-center sm:items-start">
                        <p className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Amount</p>
                        <div className="flex items-center gap-1 sm:gap-2 text-primary font-mono font-bold text-xs sm:text-lg">
                          <FiDollarSign className="text-accent shrink-0" />
                          {s.amount}
                        </div>
                      </div>
                      <div className="flex flex-col items-center sm:items-start">
                        <p className="text-[8px] sm:text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Institution</p>
                        <p className="text-[9px] sm:text-sm font-bold text-gray-600 line-clamp-1">{s.institution}</p>
                      </div>
                    </div>

                    <Link href="/scholarships">
                      <div className="pt-2 sm:pt-4 flex items-center text-primary font-black text-[9px] sm:text-sm uppercase tracking-wider group-hover:gap-2 transition-all cursor-pointer">
                        View Details
                        <FiArrowRight className="ml-1 sm:ml-2" />
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Punched hole effect */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-primary rounded-full shadow-inner" />
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-primary rounded-full shadow-inner" />
              </div>
            ))}
          </div>
        )}

        {/* Centered CTA at the bottom */}
        <div className="mt-12 sm:mt-20 flex justify-center">
          <Link href="/scholarships">
            <Button variant="accent" className="group flex items-center justify-center gap-3 px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base font-bold shadow-[0_15px_30px_-10px_rgba(255,107,0,0.4)] hover:shadow-[0_20px_40px_-15px_rgba(255,107,0,0.6)] hover:scale-105 transition-all">
              Explore All Scholarships
              <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
