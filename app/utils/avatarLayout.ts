export type AvatarAlignment = "left" | "center" | "right";

export const getAvatarSize = (value: unknown, fallback = 80) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(160, Math.max(48, parsed));
};

export const getAvatarAlignment = (value: unknown): AvatarAlignment => {
  return value === "left" || value === "right" ? value : "center";
};

export const getAvatarAlignItems = (alignment: AvatarAlignment) => {
  if (alignment === "left") return "flex-start";
  if (alignment === "right") return "flex-end";
  return "center";
};

export const getAvatarTextAlign = (alignment: AvatarAlignment) => {
  if (alignment === "left") return "left";
  if (alignment === "right") return "right";
  return "center";
};