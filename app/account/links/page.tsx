import { createClient } from "../../lib/supabase/server";
import LinkTreeDashboard from "./Links";

export default async function Account() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <LinkTreeDashboard user={user} />;
}
