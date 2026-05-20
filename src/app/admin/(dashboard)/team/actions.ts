"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveMember(prevState: { error?: string } | null, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const category = formData.get("category") as string;
  const group = formData.get("group") as string;
  const avatarUrl = formData.get("avatarUrl") as string;
  const linkedin = formData.get("linkedin") as string;
  const instagram = formData.get("instagram") as string;

  if (!name || !role || !category) {
    return { error: "Name, Role, and Category are required." };
  }

  const memberData = {
    name,
    role,
    category,
    group: group || null,
    avatar_url: avatarUrl || null,
    linkedin: linkedin || null,
    instagram: instagram || null,
  };

  try {
    if (id && id !== "new") {
      const { error } = await supabase
        .from("members")
        .update(memberData)
        .eq("id", id);

      if (error) return { error: error.message };
    } else {
      const { error } = await supabase
        .from("members")
        .insert(memberData);

      if (error) return { error: error.message };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { error: message };
  }

  revalidatePath("/about");
  revalidatePath("/team");
  revalidatePath("/admin/team");
  redirect("/admin/team");
}

export async function deleteMember(id: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("members")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/about");
  revalidatePath("/team");
  revalidatePath("/admin/team");
}
