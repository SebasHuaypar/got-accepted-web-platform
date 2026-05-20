"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveProgram(prevState: { error?: string } | null, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const duration = formData.get("duration") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const nextIntake = formData.get("nextIntake") as string;
  const availability = formData.get("availability") as string;

  if (!title || !slug || !description || !category) {
    return { error: "Title, slug, description, and category are required." };
  }

  const programData = {
    title,
    slug,
    description,
    category,
    duration: duration || null,
    image_url: imageUrl || null,
    next_intake: nextIntake || null,
    availability: availability || null,
  };

  try {
    if (id && id !== "new") {
      const { error } = await supabase
        .from("programs")
        .update(programData)
        .eq("id", id);

      if (error) return { error: error.message };
    } else {
      const { error } = await supabase
        .from("programs")
        .insert(programData);

      if (error) return { error: error.message };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { error: message };
  }

  revalidatePath("/programs");
  revalidatePath(`/programs/${slug}`);
  revalidatePath("/admin/programs");
  redirect("/admin/programs");
}

export async function deleteProgram(id: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/programs");
  revalidatePath("/admin/programs");
}
