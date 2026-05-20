"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Helper to check if the current user is an Administrator
async function checkIsAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, role:roles(name)")
    .eq("id", user.id)
    .single();

  if (profile?.role?.name !== "Administrator") {
    throw new Error("Access Denied: Administrator role required");
  }
}

// Create or update a role
export async function saveRole(
  roleId: string | null,
  formData: {
    name: string;
    permissions: string[];
  }
) {
  await checkIsAdmin();

  if (!formData.name || !formData.permissions || formData.permissions.length === 0) {
    throw new Error("Role name and at least one permission are required.");
  }

  const supabase = await createClient();

  if (roleId) {
    // For default Administrator role, verify permissions array retains roles and profiles to avoid lock-out
    if (formData.name.toLowerCase() === "administrator" && !formData.permissions.includes("roles")) {
      throw new Error("Administrator role must retain permissions to manage roles.");
    }

    const { error } = await supabase
      .from("roles")
      .update({
        name: formData.name,
        permissions: formData.permissions,
      })
      .eq("id", roleId);

    if (error) {
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabase.from("roles").insert({
      name: formData.name,
      permissions: formData.permissions,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/admin/roles");
}

// Delete a custom role
export async function deleteRole(roleId: string) {
  await checkIsAdmin();

  const supabase = await createClient();

  // Load the role details first
  const { data: roleData, error: loadError } = await supabase
    .from("roles")
    .select("name")
    .eq("id", roleId)
    .single();

  if (loadError) {
    throw new Error(loadError.message);
  }

  if (roleData.name === "Administrator" || roleData.name === "Editor") {
    throw new Error("System default roles (Administrator/Editor) cannot be deleted.");
  }

  const { error } = await supabase.from("roles").delete().eq("id", roleId);

  if (error) {
    if (error.code === "23503") {
      throw new Error("No se puede eliminar este rol porque está asignado a uno o más usuarios.");
    }
    throw new Error(error.message);
  }

  revalidatePath("/admin/roles");
}
