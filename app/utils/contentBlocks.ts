export type ContentBlockType = "text" | "video" | "music" | "gallery";

export type ContentBlock = {
  id: string;
  profile_id: string;
  type: ContentBlockType;
  title?: string | null;
  content_json?: {
    text?: string;
    url?: string;
    embedUrl?: string;
    images?: string[];
  };
  position: number;
  is_active: boolean;
  publish_at?: string | null;
  expire_at?: string | null;
};

const parseUrlOrNull = (value?: string | null) => {
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

export const normalizeGalleryImages = (value: string) => {
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => {
      const parsed = parseUrlOrNull(item);
      return parsed ? ["http:", "https:"].includes(parsed.protocol) : false;
    });
};

export const getVideoEmbedUrl = (value?: string | null) => {
  const parsed = parseUrlOrNull(value);
  if (!parsed) return null;

  if (parsed.hostname.includes("youtu.be")) {
    const id = parsed.pathname.replace("/", "").trim();
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  if (parsed.hostname.includes("youtube.com")) {
    const id = parsed.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;

    const shortsMatch = parsed.pathname.match(/\/shorts\/([^/?]+)/);
    if (shortsMatch?.[1]) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  if (parsed.hostname.includes("vimeo.com")) {
    const id = parsed.pathname.split("/").filter(Boolean)[0];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }

  return null;
};

export const getMusicEmbedUrl = (value?: string | null) => {
  const parsed = parseUrlOrNull(value);
  if (!parsed) return null;

  if (parsed.hostname.includes("spotify.com")) {
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      const mediaType = parts[0];
      const mediaId = parts[1];
      return `https://open.spotify.com/embed/${mediaType}/${mediaId}`;
    }
  }

  if (parsed.hostname.includes("soundcloud.com")) {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(parsed.toString())}`;
  }

  return null;
};
