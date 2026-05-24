export type LinkStyleConfig = {
  height: number;
  borderRadius: number;
  fontSize: number;
  fontWeight: number;
  horizontalPadding: number;
  linkColor: string;
  borderWidth: number;
  borderColor: string;
  shadow: boolean;
};

export const defaultLinkStyle: LinkStyleConfig = {
  height: 56,
  borderRadius: 50,
  fontSize: 16,
  fontWeight: 500,
  horizontalPadding: 20,
  linkColor: "",
  borderWidth: 0,
  borderColor: "transparent",
  shadow: false,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const toNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const getLinkStyleFromProfile = (profile: any): LinkStyleConfig => ({
  height: clamp(toNumber(profile?.link_height, defaultLinkStyle.height), 36, 96),
  borderRadius: clamp(
    toNumber(profile?.link_border_radius, defaultLinkStyle.borderRadius),
    0,
    60
  ),
  fontSize: clamp(
    toNumber(profile?.link_font_size, defaultLinkStyle.fontSize),
    12,
    24
  ),
  fontWeight: clamp(
    toNumber(profile?.link_font_weight, defaultLinkStyle.fontWeight),
    400,
    800
  ),
  horizontalPadding: clamp(
    toNumber(
      profile?.link_horizontal_padding,
      defaultLinkStyle.horizontalPadding
    ),
    8,
    36
  ),
  linkColor:
    typeof profile?.link_color === "string" ? profile.link_color : defaultLinkStyle.linkColor,
  borderWidth: clamp(
    toNumber(profile?.link_border_width, defaultLinkStyle.borderWidth),
    0,
    6
  ),
  borderColor:
    typeof profile?.link_border_color === "string" && profile.link_border_color.trim()
      ? profile.link_border_color
      : defaultLinkStyle.borderColor,
  shadow: Boolean(profile?.link_shadow),
});

const hexToRgb = (hex: string) => {
  const normalized = hex.trim().replace("#", "");
  if (normalized.length === 3) {
    const expanded = normalized
      .split("")
      .map((char) => char + char)
      .join("");
    const parsed = Number.parseInt(expanded, 16);
    return {
      r: (parsed >> 16) & 255,
      g: (parsed >> 8) & 255,
      b: parsed & 255,
    };
  }

  if (normalized.length !== 6) return null;

  const parsed = Number.parseInt(normalized, 16);
  if (Number.isNaN(parsed)) return null;

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
};

export const getReadableTextColor = (backgroundColor: string) => {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return "#ffffff";

  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.6 ? "#111111" : "#ffffff";
};
