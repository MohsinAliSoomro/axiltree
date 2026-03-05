export type CompletionItemKey =
  | "username"
  | "avatar"
  | "bio"
  | "theme"
  | "links";

export type ProfileCompletionInput = {
  username?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  theme?: string | null;
  linksCount?: number;
};

export type CompletionItem = {
  key: CompletionItemKey;
  label: string;
  completed: boolean;
};

export type ProfileCompletionResult = {
  score: number;
  completedCount: number;
  totalCount: number;
  items: CompletionItem[];
};

export function calculateProfileCompletion(
  input: ProfileCompletionInput
): ProfileCompletionResult {
  const items: CompletionItem[] = [
    {
      key: "username",
      label: "Set username",
      completed: Boolean(input.username?.trim() && input.username.trim().length >= 3),
    },
    {
      key: "avatar",
      label: "Upload avatar",
      completed: Boolean(input.avatar_url?.trim()),
    },
    {
      key: "bio",
      label: "Add bio",
      completed: Boolean(input.bio?.trim()),
    },
    {
      key: "theme",
      label: "Choose theme",
      completed: Boolean(input.theme?.trim()),
    },
    {
      key: "links",
      label: "Add at least one link",
      completed: (input.linksCount || 0) > 0,
    },
  ];

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const score = Math.round((completedCount / totalCount) * 100);

  return {
    score,
    completedCount,
    totalCount,
    items,
  };
}