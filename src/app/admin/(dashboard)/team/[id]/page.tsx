import { createClient } from "@/utils/supabase/server";
import TeamForm from "@/components/admin/TeamForm";
import AccessDenied from "@/components/admin/AccessDenied";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function MemberEditorPage({ params }: PageProps) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, role:roles(permissions)")
    .eq("id", user.id)
    .single();

  const permissions = profile?.role?.permissions || [];
  if (!permissions.includes("team")) {
    return <AccessDenied requiredPermission="team" />;
  }

  const { id } = await params;
  const isNew = id === "new";
  let member = null;

  if (!isNew) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      notFound();
    }
    member = data;
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/team"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-4 font-bold text-sm"
        >
          <FiArrowLeft />
          Back to Team Members
        </Link>
        <h1 className="text-3xl font-black text-primary">
          {isNew ? "Add New Member" : `Edit Team Member`}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isNew
            ? "Introduce a new board or team member."
            : "Modify the details of your team member profile."}
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm">
        <TeamForm member={member} />
      </div>
    </div>
  );
}
