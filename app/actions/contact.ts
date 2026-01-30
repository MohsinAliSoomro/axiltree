"use server";

import { createClient } from "../lib/supabase/server";

export async function submitContactForm(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return { success: false, error: "All fields are required" };
    }

    // Create Supabase client
    const supabase = await createClient();

    // Insert contact form data
    const { error } = await supabase.from("contacts").insert({
      name,
      email,
      subject,
      message,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error saving contact:", error);
      return { success: false, error: "Failed to save contact information" };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
