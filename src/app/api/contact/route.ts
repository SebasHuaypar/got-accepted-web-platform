import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * POST /api/contact
 *
 * Accepts a JSON body with { name, email, topic, message }.
 * Currently logs the submission server-side and returns { ok: true }.
 *
 * To wire up email delivery, replace the console.log with a call to
 * Resend, SendGrid, or Formspree — the interface here won't change.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, topic, message } = body;

    // Basic server-side validation
    if (!name || !email || !topic || !message) {
      return NextResponse.json(
        { ok: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // Email format sanity check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    const useMock = !isSupabaseConfigured && process.env.NODE_ENV !== "production";

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("contact_submissions")
        .insert([{ name, email, topic, message }]);

      if (error) {
        console.error("[Supabase Contact Form Error]", error);
        return NextResponse.json(
          { ok: false, error: "Failed to save submission." },
          { status: 500 }
        );
      }
    } else if (useMock) {
      console.log("[Contact Form Submission (Mock/Fallback)]", {
        name,
        email,
        topic,
        messageLength: message.length,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error("[Production Error] Supabase is not configured. Contact submission discarded.");
      return NextResponse.json(
        { ok: false, error: "Service is temporarily unavailable." },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Contact Form Error]", error);
    return NextResponse.json(
      { ok: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
