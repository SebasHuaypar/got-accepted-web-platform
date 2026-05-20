"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
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
  
  return user.id;
}

// Create a new admin/editor user
export async function adminCreateUser(formData: {
  fullName: string;
  email: string;
  password?: string;
  roleId: string;
}) {
  await checkIsAdmin();

  if (!formData.email || !formData.fullName || !formData.roleId) {
    throw new Error("All fields except password are required.");
  }

  const supabaseAdmin = createAdminClient();

  // 1. Create the user in Auth
  const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: formData.email,
    password: formData.password || "TempPass123!", // fallback password
    email_confirm: true,
    user_metadata: { full_name: formData.fullName },
  });

  if (createError) {
    throw new Error(createError.message);
  }

  const userId = userData.user?.id;
  if (!userId) {
    throw new Error("Failed to retrieve new user ID.");
  }

  // 2. Update the profile with the assigned role
  // Trigger public.handle_new_user executes and inserts the profile, so we perform an update
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      full_name: formData.fullName,
      role_id: formData.roleId,
    })
    .eq("id", userId);

  if (profileError) {
    // Clean up created auth user if profile update fails
    await supabaseAdmin.auth.admin.deleteUser(userId);
    throw new Error(profileError.message);
  }

  revalidatePath("/admin/profiles");
}

// Update existing profile and auth user details
export async function adminUpdateUser(
  userId: string,
  formData: {
    fullName: string;
    roleId: string;
    password?: string;
  }
) {
  await checkIsAdmin();

  if (!userId || !formData.fullName || !formData.roleId) {
    throw new Error("Required fields are missing.");
  }

  const supabase = await createClient();

  // 1. Update public profile using the standard authenticated client
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: formData.fullName,
      role_id: formData.roleId,
    })
    .eq("id", userId);

  if (profileError) {
    throw new Error(profileError.message);
  }

  // 2. If administrator provided a new password, update it using the admin client
  if (formData.password && formData.password.trim() !== "") {
    const supabaseAdmin = createAdminClient();
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: formData.password,
    });
    if (authError) {
      throw new Error(authError.message);
    }
  }

  revalidatePath("/admin/profiles");
}

// Delete user account
export async function adminDeleteUser(userId: string) {
  const currentUserId = await checkIsAdmin();

  if (userId === currentUserId) {
    throw new Error("You cannot delete your own Administrator account.");
  }

  const supabaseAdmin = createAdminClient();

  // Deleting user in Auth automatically cascades to profiles due to references ... on delete cascade
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/profiles");
}

// Self-service password/name update
export async function updateSelfProfile(formData: {
  fullName: string;
  password?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Update profile name
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: formData.fullName })
    .eq("id", user.id);

  if (profileError) {
    throw new Error(profileError.message);
  }

  // Update password if entered
  if (formData.password && formData.password.trim() !== "") {
    const { error: authError } = await supabase.auth.updateUser({
      password: formData.password,
    });
    if (authError) {
      throw new Error(authError.message);
    }
  }

  revalidatePath("/admin/settings");
}
