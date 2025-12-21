import AccountForm from "./account-form";
import { createClient } from "@/app/lib/supabase/server";

export default async function Account() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // console.log("Account page user:", user);
  return <AccountForm user={user} />;
}
