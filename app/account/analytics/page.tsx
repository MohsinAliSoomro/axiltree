import { createClient } from "@/app/lib/supabase/server";
import Analytics from "./Analytics";

export default async function handleClick(link: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc("aggregate_analytics");
  console.log(data, error);
  return <Analytics data={data} />;
}
