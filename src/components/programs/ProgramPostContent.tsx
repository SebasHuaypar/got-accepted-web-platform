import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Title } from "@/components/ui/Title";
import { Button } from "@/components/ui/Button";
import { FiClock, FiTarget } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface ProgramPostContentProps {
  program: {
    title: string;
    description: string;
    category: string;
    duration?: string | null;
    imageUrl?: string | null;
    nextIntake?: string | null;
    availability?: string | null;
  };
}

export default function ProgramPostContent({ program }: ProgramPostContentProps) {
  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden">
      {/* Program hero */}
      <section className="pb-12 sm:pb-20 pt-8">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-black uppercase tracking-widest">
                {program.category || "Uncategorized"}
              </div>
              <Title as="h1" className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-primary leading-tight">
                {program.title || "Untitled Program"}
              </Title>
              
              <div className="flex flex-wrap gap-4 sm:gap-6 py-2 sm:py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-surface rounded-2xl flex items-center justify-center text-accent shadow-sm">
                    <FiClock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Duration</p>
                    <p className="text-primary font-black text-sm">{program.duration || "TBD"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-surface rounded-2xl flex items-center justify-center text-accent shadow-sm">
                    <FiTarget size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Intensity</p>
                    <p className="text-primary font-black text-sm">High Performance</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button variant="accent" className="w-full sm:w-auto px-8 sm:px-12 py-3.5 rounded-2xl shadow-xl hover:scale-105 transition-all font-black text-base">
                    Apply Now
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-8 sm:px-12 py-3.5 rounded-2xl border-2 font-black text-base opacity-60 cursor-not-allowed"
                  disabled
                  aria-disabled="true"
                  title="Brochure coming soon"
                >
                  Download Brochure
                </Button>
              </div>
            </div>

            <div className="relative aspect-[4/3] sm:aspect-[4/5] lg:aspect-square rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(26,46,110,0.3)] bg-gray-100 flex items-center justify-center text-gray-400">
              {program.imageUrl ? (
                <Image
                  src={program.imageUrl}
                  alt={program.title || "Program Image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <span className="font-bold uppercase tracking-widest text-sm">No Image Selected</span>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Program details */}
      <section className="py-12 sm:py-24 bg-surface/50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            <div className="lg:col-span-2 space-y-10 sm:space-y-12">
              <div className="prose prose-lg max-w-none text-gray-700 text-lg leading-relaxed font-medium">
                {program.description ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      img: ({ node, ...props }) => (
                        <img className="rounded-2xl shadow-md my-8" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a className="text-accent underline hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
                      ),
                    }}
                  >
                    {program.description}
                  </ReactMarkdown>
                ) : (
                  <p>No description provided yet...</p>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-32 p-6 sm:p-8 bg-primary rounded-[2rem] sm:rounded-[2.5rem] text-white shadow-2xl">
                <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6">Ready to start?</h3>
                <p className="text-white/70 mb-6 sm:mb-8 font-medium text-sm sm:text-base">
                  Join a community of successful Latino students and take the first step towards your global education.
                </p>
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                    <p className="text-xs text-white/50 font-bold uppercase tracking-widest mb-1">Next Intake</p>
                    <p className="text-base sm:text-lg font-black text-accent">{program.nextIntake || "To be announced"}</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                    <p className="text-xs text-white/50 font-bold uppercase tracking-widest mb-1">Availability</p>
                    <p className="text-base sm:text-lg font-black">{program.availability || "Check soon"}</p>
                  </div>
                </div>
                <Link href="/contact">
                  <Button variant="accent" className="w-full mt-6 sm:mt-8 py-4 rounded-2xl font-black shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
