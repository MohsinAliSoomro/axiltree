export type AvatarAlignment = "left" | "center" | "right";
export type AvatarSizePreset = "small" | "medium" | "large";

const avatarSizeValues: Record<AvatarSizePreset, number> = {
  small: 56,
  medium: 80,
  large: 112,
};

export const getAvatarSize = (value: unknown, fallback = 80) => {
  if (value === "small" || value === "medium" || value === "large") {
    return avatarSizeValues[value];
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(160, Math.max(48, parsed));
};

export const getAvatarSizePreset = (value: unknown): AvatarSizePreset => {
  if (value === "small" || value === "medium" || value === "large") {
    return value;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "medium";
  if (parsed <= 68) return "small";
  if (parsed <= 96) return "medium";
  return "large";
};

export const getAvatarSizeValue = (preset: AvatarSizePreset) => {
  return avatarSizeValues[preset];
};

export const getAvatarAlignment = (value: unknown): AvatarAlignment => {
  return value === "left" || value === "right" ? value : "center";
};

export const getAvatarAlignItems = (alignment: AvatarAlignment) => {
  if (alignment === "left") return "flex-start";
  if (alignment === "right") return "flex-end";
  return "center";
};

export const getAvatarJustifyContent = (alignment: AvatarAlignment) => {
  if (alignment === "left") return "flex-start";
  if (alignment === "right") return "flex-end";
  return "center";
};

export const getAvatarTextAlign = (alignment: AvatarAlignment) => {
  if (alignment === "left") return "left";
  if (alignment === "right") return "right";
  return "center";
};