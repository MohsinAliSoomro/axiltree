import AccountForm from "./account-form";
import { createClient } from "@/app/lib/supabase/server";

export default async function Account() {
  const supabase = await createClient();
  console.log("Supabase client created in account page");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("User fetched in account page:", user);
  return <AccountForm user={user} />;
}
