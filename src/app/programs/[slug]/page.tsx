import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PROGRAMS } from "@/constants/mockData";
import { Program } from "@/types";
import { Container } from "@/components/ui/Container";
import { Title } from "@/components/ui/Title";
import { Button } from "@/components/ui/Button";
import { FiCheckCircle, FiClock, FiTarget, FiArrowLeft } from "react-icons/fi";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import ProgramPostContent from "@/components/programs/ProgramPostContent";

// This is required for static site generation with dynamic routes in Next.js
export async function generateStaticParams() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from("programs").select("slug");
      if (data && data.length > 0) {
        return data.map((program) => ({
          slug: program.slug,
        }));
      }
    } catch (e) {
      console.error("Failed to generate static params from Supabase:", e);
    }
  }
  return PROGRAMS.map((program: Program) => ({
    slug: program.slug,
  }));
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let program: Program | undefined;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        console.error("Error fetching program detail from Supabase:", error);
      } else if (data) {
        program = {
          id: String(data.id),
          slug: data.slug,
          title: data.title,
          description: data.description,
          category: data.category,
          duration: data.duration || undefined,
          imageUrl: data.image_url || undefined,
          nextIntake: data.next_intake || undefined,
          availability: data.availability || undefined,
        };
      }
    } catch (e) {
      console.error("Failed to query Supabase program detail:", e);
    }
  }

  const useMock = !isSupabaseConfigured && process.env.NODE_ENV !== "production";

  if (!program && useMock) {
    program = PROGRAMS.find((p: Program) => p.slug === slug);
  }

  if (!program) {
    notFound();
  }

  return (
    <main className="pt-20 sm:pt-24 min-h-screen bg-white">
      {/* Back button */}
      <Container className="py-6 sm:py-8">
        <Link href="/programs" className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-bold group text-sm sm:text-base">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Programs
        </Link>
      </Container>

      <ProgramPostContent program={program} />
    </main>
  );
}
