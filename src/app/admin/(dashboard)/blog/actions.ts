"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveBlogPost(prevState: { error?: string } | null, formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const author = formData.get("author") as string;
  const authorRole = formData.get("authorRole") as string;
  const authorAvatar = formData.get("authorAvatar") as string;
  const date = formData.get("date") as string;
  const readingTime = formData.get("readingTime") as string;
  const category = formData.get("category") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const content = formData.get("content") as string;

  if (!title || !slug || !excerpt || !author || !authorRole || !category || !imageUrl || !content) {
    return { error: "All fields except author avatar, date, and reading time are required." };
  }

  // Auto-fill defaults
  const finalDate = date || new Date().toISOString().split("T")[0];
  
  // Estimate reading time if blank
  let finalReadingTime = readingTime;
  if (!finalReadingTime) {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    finalReadingTime = `${minutes} min read`;
  }

  const postData = {
    title,
    slug,
    excerpt,
    author,
    author_role: authorRole,
    author_avatar: authorAvatar || null,
    date: finalDate,
    reading_time: finalReadingTime,
    category,
    image_url: imageUrl,
    content,
  };

  try {
    if (id && id !== "new") {
      const { error } = await supabase
        .from("blog_posts")
        .update(postData)
        .eq("id", id);

      if (error) return { error: error.message };
    } else {
      const { error } = await supabase
        .from("blog_posts")
        .insert(postData);

      if (error) return { error: error.message };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { error: message };
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
