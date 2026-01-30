import { createClient } from "@/app/lib/supabase/server";
import Analytics from "./Analytics";

export default async function handleClick(link: any) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
      .select("link_id, country, action")
      .in("link_id", linkIds)
      .eq("action", "click");
    
    analyticsData = result.data;
    analyticsError = result.error;
  }

  console.log("User Links:", userLinks, linksError);
  console.log("Analytics Data:", analyticsData, analyticsError);

  // Process analytics data to get clicks per link and per country
  const linkAnalytics: any = {};
  
  if (analyticsData) {
    analyticsData.forEach((record: any) => {
      if (!linkAnalytics[record.link_id]) {
        linkAnalytics[record.link_id] = {
          total: 0,
          byCountry: {},
        };
      }
      linkAnalytics[record.link_id].total += 1;
      
      const country = record.country || "Unknown";
      if (!linkAnalytics[record.link_id].byCountry[country]) {
        linkAnalytics[record.link_id].byCountry[country] = 0;
      }
      linkAnalytics[record.link_id].byCountry[country] += 1;
    });
  }

  // Enrich links with click data
  const enrichedLinks = userLinks?.map((link: any) => ({
    ...link,
    clicks: linkAnalytics[link.id]?.total || 0,
    clicksByCountry: linkAnalytics[link.id]?.byCountry || {},
  })) || [];

  // Aggregate country data from all links
  const countryAggregate: any = {};
  Object.values(linkAnalytics).forEach((linkData: any) => {
    Object.entries(linkData.byCountry).forEach(([country, count]: [string, any]) => {
      if (!countryAggregate[country]) {
        countryAggregate[country] = 0;
      }
      countryAggregate[country] += count;
    });
  });

  const countryData = Object.entries(countryAggregate).map(([country, count]) => ({
    country,
    count,
  }));

  return (
    <Analytics 
      countryData={countryData} 
      linksData={enrichedLinks}
      linkAnalytics={linkAnalytics}
    />
  );
}
