import { createClient } from "@/utils/supabase/server";
import SubmissionsTable from "@/components/admin/SubmissionsTable";
import AccessDenied from "@/components/admin/AccessDenied";
import { FiBookOpen, FiAward, FiUsers, FiFileText, FiInbox } from "react-icons/fi";

export const dynamic = "force-dynamic";

export default async function AdminDashboardOverview() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, role:roles(permissions)")
    .eq("id", user.id)
    .single();

  const permissions = profile?.role?.permissions || [];
  if (!permissions.includes("submissions")) {
    return <AccessDenied requiredPermission="submissions" />;
  }

  const [programsRes, scholarshipsRes, membersRes, blogRes, submissionsRes] = await Promise.all([
    supabase.from("programs").select("id", { count: "exact", head: true }),
    supabase.from("scholarships").select("id", { count: "exact", head: true }),
    supabase.from("members").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
  ]);

  const stats = [
    { label: "Programs", count: programsRes.count || 0, icon: FiBookOpen, color: "bg-blue-500/10 text-blue-600 border-blue-100" },
    { label: "Scholarships", count: scholarshipsRes.count || 0, icon: FiAward, color: "bg-blue-500/10 text-blue-600 border-blue-100" },
    { label: "Team Members", count: membersRes.count || 0, icon: FiUsers, color: "bg-blue-500/10 text-blue-600 border-blue-100" },
    { label: "Blog Posts", count: blogRes.count || 0, icon: FiFileText, color: "bg-blue-500/10 text-blue-600 border-blue-100" },
  ];

  const submissions = submissionsRes.data || [];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black text-primary">Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor your database records and read incoming contact form messages.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow"
            >
              <div className={`p-4 rounded-2xl border ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-3xl font-black text-primary mt-1">
                  {stat.count}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submissions Table Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
            <FiInbox size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-primary leading-none">
              Contact Submissions
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Messages received from visitors on the website.
            </p>
          </div>
        </div>

        <SubmissionsTable initialSubmissions={submissions} />
      </div>
    </div>
  );
}
