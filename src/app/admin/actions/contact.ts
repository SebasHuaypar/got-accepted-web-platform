"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { generateReplyEmailHtml } from "@/utils/emailTemplate";

// Helper to check if the current user is authenticated
async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export async function replyToSubmission(
  submissionId: string,
  recipientEmail: string,
  recipientName: string,
  originalMessage: string,
  replyText: string
) {
  await requireAuth();

  if (!submissionId || !recipientEmail || !replyText) {
    throw new Error("Missing required fields to send reply.");
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured on the server.");
  }

  const resend = new Resend(resendApiKey);
  const senderEmail = process.env.NEXT_PUBLIC_SENDER_EMAIL || "info@gotaccepted.org";

  // Build a clean HTML email template using our shared utility
  const htmlTemplate = generateReplyEmailHtml(
    recipientName,
    originalMessage,
    replyText
  );

  try {
    // 1. Send the email via Resend
    const { error: resendError } = await resend.emails.send({
      from: `GotAccepted <${senderEmail}>`,
      to: recipientEmail,
      subject: "Re: Your message to GotAccepted",
      html: htmlTemplate,
    });

    if (resendError) {
      throw new Error(resendError.message);
    }

    // 2. Update the database status to 'replied'
    const supabase = await createClient();
    const { error: dbError } = await supabase
      .from("contact_submissions")
      .update({
        status: "replied",
        replied_at: new Date().toISOString(),
      })
      .eq("id", submissionId);

    if (dbError) {
      console.error("Failed to update submission status:", dbError);
      // We don't throw here because the email was already sent successfully, 
      // but we should log it for debugging.
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error sending reply:", error);
    throw new Error(error.message || "An unexpected error occurred while sending the email.");
  }
}

export async function markSubmissionAsRead(submissionId: string) {
  await requireAuth();

  if (!submissionId) {
    throw new Error("Missing submission ID.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ status: "read" })
    .eq("id", submissionId)
    .in("status", ["unread", null]); // Only update if currently unread

  if (error) {
    console.error("Failed to mark as read:", error);
    throw new Error(error.message);
  }

  revalidatePath("/admin");
  return { success: true };
}
