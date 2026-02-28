import { createClient } from "@/app/lib/supabase/server";
import Analytics from "./Analytics";

type AnalyticsRange = "1d" | "week" | "month" | "90d" | "custom";

const VALID_RANGES: AnalyticsRange[] = ["1d", "week", "month", "90d", "custom"];

function parseDateInput(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function handleClick({
  searchParams,
}: {
  searchParams?: Promise<{ range?: string; start?: string; end?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const requestedRange = resolvedSearchParams?.range as AnalyticsRange | undefined;
  const range: AnalyticsRange = VALID_RANGES.includes(requestedRange as AnalyticsRange)
    ? (requestedRange as AnalyticsRange)
    : "week";

  const now = new Date();
  const startDate = new Date(now);
  let endDate = new Date(now);
  let effectiveRange: AnalyticsRange = range;

  if (range === "1d") {
    startDate.setDate(now.getDate() - 1);
  } else if (range === "week") {
    startDate.setDate(now.getDate() - 7);
  } else if (range === "month") {
    startDate.setDate(now.getDate() - 30);
  } else if (range === "90d") {
    startDate.setDate(now.getDate() - 90);
  } else {
    const parsedStart = parseDateInput(resolvedSearchParams?.start);
    const parsedEnd = parseDateInput(resolvedSearchParams?.end);

    if (!parsedStart || !parsedEnd || parsedStart > parsedEnd) {
      effectiveRange = "week";
      startDate.setDate(now.getDate() - 7);
      endDate = new Date(now);
    } else {
      startDate.setTime(parsedStart.getTime());
      startDate.setHours(0, 0, 0, 0);

      endDate = new Date(parsedEnd);
      endDate.setHours(23, 59, 59, 999);
    }
  }

  const customStart =
    effectiveRange === "custom" ? formatDateInput(startDate) : undefined;
  const customEnd =
    effectiveRange === "custom" ? formatDateInput(endDate) : undefined;

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
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());
    
    analyticsData = result.data;
    analyticsError = result.error;
  }


  return (
    <Analytics 
      analyticsData={analyticsData || []}
      links={userLinks || []}
      range={effectiveRange}
      customStart={customStart}
      customEnd={customEnd}
    />
  );
}
