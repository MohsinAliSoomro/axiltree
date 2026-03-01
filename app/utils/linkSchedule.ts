export type SchedulableLink = {
  is_active?: boolean | null;
  publish_at?: string | null;
  expire_at?: string | null;
};

const toDateOrNull = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const isLinkVisibleNow = (
  link: SchedulableLink,
  nowDate: Date = new Date()
) => {
  if (!link?.is_active) return false;

  const publishAt = toDateOrNull(link.publish_at);
  const expireAt = toDateOrNull(link.expire_at);

  if (publishAt && publishAt > nowDate) return false;
  if (expireAt && expireAt <= nowDate) return false;

  return true;
};

export const getScheduleStatus = (
  link: SchedulableLink,
  nowDate: Date = new Date()
) => {
  if (!link?.is_active) return "inactive" as const;

  const publishAt = toDateOrNull(link.publish_at);
  const expireAt = toDateOrNull(link.expire_at);

  if (publishAt && publishAt > nowDate) return "scheduled" as const;
  if (expireAt && expireAt <= nowDate) return "expired" as const;
  return "live" as const;
};

export const formatScheduleDate = (value?: string | null) => {
  const parsed = toDateOrNull(value);
  if (!parsed) return null;

  return parsed.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
