import HeroPrograms from "@/components/programs/HeroPrograms";
import ProgramList from "@/components/programs/ProgramList";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { PROGRAMS } from "@/constants/mockData";
import { Program, DbProgram } from "@/types";

export const metadata = {
  title: "Our Programs | GotAccepted",
  description: "Explore our mentorship, scholarship, and workshop programs designed for Latino students.",
};

export default async function ProgramsPage() {
  const useMock = !isSupabaseConfigured && process.env.NODE_ENV !== "production";
  let programs: Program[] = useMock ? PROGRAMS : [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("programs")
        .select("*")
        .order("title");

      if (error) {
        console.error("Error fetching programs from Supabase:", error);
      } else if (data && data.length > 0) {
        programs = data.map((item: DbProgram) => ({
          id: String(item.id),
          slug: item.slug,
          title: item.title,
          description: item.description,
          category: item.category,
          duration: item.duration || undefined,
          imageUrl: item.image_url || undefined,
        }));
      }
    } catch (e) {
      console.error("Failed to query Supabase programs:", e);
    }
  }

  return (
    <main>
      <HeroPrograms />
      <ProgramList initialPrograms={programs} />
    </main>
  );
}
