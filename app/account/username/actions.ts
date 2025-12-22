"use server";
import { createClient } from "@/app/lib/supabase/server";

export async function updateUsernameAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const userId = formData.get("userId") as string;

  if (!username) {
    return { status: "error", message: "Username is required" };
  }

  const supabase = await createClient();

  const { data: existingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("id", userId)
    .single();

  if (existingUser) {
    return {
      status: "info",
      message: "Username already taken. Please choose another one.",
    };
  }

  // 2️⃣ Update username
  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    return { status: "error", message: "Failed to update username" };
  }

  return { status: "success", message: "Username updated successfully" };
}
