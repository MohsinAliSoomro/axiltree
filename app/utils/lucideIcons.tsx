import { DynamicIcon, iconNames } from "lucide-react/dynamic";

export const LUCIDE_ICON_NAMES = [...iconNames].sort((a, b) =>
  a.localeCompare(b)
);

const ICON_NAME_LOOKUP: Record<string, true> = Object.fromEntries(
  (LUCIDE_ICON_NAMES as string[]).map((iconName) => [iconName, true])
);

function toKebabCase(value: string) {
  return value
    .replace(/\s+/g, "-")
    .replace(/_/g, "-")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

function resolveIconName(name: string) {
  if (ICON_NAME_LOOKUP[name]) return name;

  const kebabName = toKebabCase(name);
  if (ICON_NAME_LOOKUP[kebabName]) return kebabName;

  return null;
}

export function renderLucideIcon(name?: string | null, size = 16) {
  if (!name) return null;

  const resolvedName = resolveIconName(name);
  if (!resolvedName) return null;

  return <DynamicIcon name={resolvedName as any} size={size} />;
}
