import HeroScholarships from "@/components/scholarships/HeroScholarships";
import ScholarshipSearch from "@/components/scholarships/ScholarshipSearch";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SCHOLARSHIPS } from "@/constants/mockData";
import { Scholarship, DbScholarship } from "@/types";

export const metadata = {
  title: "Scholarships | GotAccepted",
  description: "Find and apply for global scholarships with the help of GotAccepted.",
};

export default async function ScholarshipsPage() {
  const useMock = !isSupabaseConfigured && process.env.NODE_ENV !== "production";
  let scholarships: Scholarship[] = useMock ? SCHOLARSHIPS : [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("scholarships")
        .select("*")
        .order("title");

      if (error) {
        console.error("Error fetching scholarships from Supabase:", error);
      } else if (data && data.length > 0) {
        scholarships = data.map((item: DbScholarship) => ({
          id: String(item.id),
          title: item.title,
          institution: item.institution,
          institutionLogo: item.institution_logo || undefined,
          amount: item.amount,
          deadline: item.deadline,
          category: item.category || [],
          description: item.description,
          requirements: item.requirements || [],
          link: item.link,
        }));
      }
    } catch (e) {
      console.error("Failed to query Supabase scholarships:", e);
    }
  }

  return (
    <main className="flex flex-col w-full">
      <HeroScholarships />
      <ScholarshipSearch initialScholarships={scholarships} />
    </main>
  );
}
