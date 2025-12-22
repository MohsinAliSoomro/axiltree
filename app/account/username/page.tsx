import { createClient } from "../../lib/supabase/server";
import UsernameForm from "./username-form";

export default async function Username() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user?.id)
    .single();

  const currentUsername = profile?.username || "";
  return <UsernameForm user={user} currentUsername={currentUsername} />;
}
