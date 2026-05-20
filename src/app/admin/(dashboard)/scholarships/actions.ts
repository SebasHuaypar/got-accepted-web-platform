"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveScholarship(prevState: { error?: string } | null, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const institution = formData.get("institution") as string;
  const institutionLogo = formData.get("institutionLogo") as string;
  const amount = formData.get("amount") as string;
  const deadline = formData.get("deadline") as string;
  const categoryRaw = formData.get("category") as string;
  const description = formData.get("description") as string;
  const requirementsRaw = formData.get("requirements") as string;
  const link = formData.get("link") as string;

  if (!title || !institution || !amount || !deadline || !description || !link) {
    return { error: "Title, Institution, Amount, Deadline, Description, and Link are required." };
  }

  // Parse arrays
  const category = categoryRaw
    ? categoryRaw.split(",").map((c) => c.trim()).filter(Boolean)
    : [];
  const requirements = requirementsRaw
    ? requirementsRaw.split("\n").map((r) => r.trim()).filter(Boolean)
    : [];

  const scholarshipData = {
    title,
    institution,
    institution_logo: institutionLogo || null,
    amount,
    deadline,
    category,
    description,
    requirements,
    link,
  };

  try {
    if (id && id !== "new") {
      const { error } = await supabase
        .from("scholarships")
        .update(scholarshipData)
        .eq("id", id);

      if (error) return { error: error.message };
    } else {
      const { error } = await supabase
        .from("scholarships")
        .insert(scholarshipData);

      if (error) return { error: error.message };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { error: message };
  }

  revalidatePath("/scholarships");
  revalidatePath("/admin/scholarships");
  redirect("/admin/scholarships");
}

export async function deleteScholarship(id: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("scholarships")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/scholarships");
  revalidatePath("/admin/scholarships");
}
