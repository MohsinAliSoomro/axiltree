import { createClient } from "@/app/lib/supabase/server";
import Analytics from "./Analytics";

export default async function handleClick({
  searchParams,
}: {
  searchParams?: Promise<{ range?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const range = resolvedSearchParams?.range === "month" ? "month" : "week";
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - (range === "week" ? 7 : 30));

  // Fetch current user's links
  const { data: userLinks, error: linksError } = await supabase
    .from("links")
    .select("id, title, url")
    .eq("profile_id", user?.id)
    .order("position");

  // Fetch all analytics data for current user's links
  const linkIds = userLinks?.map((link: any) => link.id) || [];
  
  let analyticsData = null;
  let analyticsError = null;
  
  // Only fetch analytics if there are links
  if (linkIds.length > 0) {
    const result = await supabase
      .from("analytics")
      .select("link_id, country, action, created_at")
      .in("link_id", linkIds)
      .eq("action", "click")
      .gte("created_at", cutoff.toISOString());
    
    analyticsData = result.data;
    analyticsError = result.error;
  }


  return (
    <Analytics 
      analyticsData={analyticsData || []}
      links={userLinks || []}
      range={range}
    />
  );
}
