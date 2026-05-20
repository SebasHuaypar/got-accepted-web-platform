import HeroTeam from "@/components/team/HeroTeam";
import TeamList from "@/components/team/TeamList";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MEMBERS } from "@/constants/mockData";
import { Member, DbMember } from "@/types";

export const metadata = {
  title: "Our Team | GotAccepted",
  description: "Meet the passionate team behind GotAccepted, working to provide opportunities for Latino students.",
};

export default async function TeamPage() {
  const useMock = !isSupabaseConfigured && process.env.NODE_ENV !== "production";
  let members: Member[] = useMock ? MEMBERS : [];

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching team members from Supabase:", error);
      } else if (data && data.length > 0) {
        members = data.map((item: DbMember) => ({
          id: String(item.id),
          name: item.name,
          role: item.role,
          category: item.category as "BOARD" | "TEAM",
          avatarUrl: item.avatar_url || undefined,
          linkedin: item.linkedin || undefined,
          instagram: item.instagram || undefined,
          group: item.group || undefined, // Support group/department from Supabase
        }));
      }
    } catch (e) {
      console.error("Failed to query Supabase members:", e);
    }
  }

  return (
    <main>
      <HeroTeam />
      <TeamList initialMembers={members} />
    </main>
  );
}
