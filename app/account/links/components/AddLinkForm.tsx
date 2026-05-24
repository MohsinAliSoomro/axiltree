"use client";
import { useState } from "react";
import {
  Paper,
  Stack,
  Group,
  Select,
  Divider,
  Text,
  TextInput,
  Button,
  Switch,
} from "@mantine/core";
import {
  IconPlus,
  IconLink,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandX,
  IconBrandFacebook,
  IconBrandWhatsapp,
  IconBrandYoutube,
  IconBrandLinkedin,
  IconBrandSnapchat,
  IconBrandTelegram,
  IconWorldWww,
} from "@tabler/icons-react";
import { LUCIDE_ICON_NAMES, renderLucideIcon } from "@/app/utils/lucideIcons";

interface AddLinkFormProps {
  addLink: (payload: {
    title: string;
    url: string;
    leftIconName?: string | null;
    rightIconName?: string | null;
    publishAt?: string | null;
    expireAt?: string | null;
  }) => void;
}

const SOCIAL_BASE_URLS: Record<string, string> = {
  Instagram: "https://instagram.com",
  TikTok: "https://tiktok.com/@",
  Twitter: "https://x.com",
  Facebook: "https://facebook.com",
  Whatsapp: "https://wa.me",
  YouTube: "https://youtube.com/@",
  LinkedIn: "https://linkedin.com/in",
  Snapchat: "https://snapchat.com/add",
  Telegram: "https://t.me",
  Threads: "https://threads.net/@",
  Pinterest: "https://pinterest.com",
  Reddit: "https://reddit.com/u",
  Discord: "https://discord.gg",
  Twitch: "https://twitch.tv",
  GitHub: "https://github.com",
  GitLab: "https://gitlab.com",
  Medium: "https://medium.com/@",
  Substack: "https://substack.com",
  Bluesky: "https://bsky.app/profile",
  Mastodon: "https://mastodon.social/@",
  Spotify: "https://open.spotify.com",
  SoundCloud: "https://soundcloud.com",
  Website: "https://",
};

const SOCIALS = [
  {
    label: "Instagram",
    value: "Instagram",
    icon: <IconBrandInstagram size={16} />,
  },
  { label: "TikTok", value: "TikTok", icon: <IconBrandTiktok size={16} /> },
  { label: "Twitter", value: "Twitter", icon: <IconBrandX size={16} /> },
  {
    label: "Facebook",
    value: "Facebook",
    icon: <IconBrandFacebook size={16} />,
  },
  {
    label: "Whatsapp",
    value: "Whatsapp",
    icon: <IconBrandWhatsapp size={16} />,
  },
  {
    label: "YouTube",
    value: "YouTube",
    icon: <IconBrandYoutube size={16} />,
  },
  {
    label: "LinkedIn",
    value: "LinkedIn",
    icon: <IconBrandLinkedin size={16} />,
  },
  {
    label: "Snapchat",
    value: "Snapchat",
    icon: <IconBrandSnapchat size={16} />,
  },
  {
    label: "Telegram",
    value: "Telegram",
    icon: <IconBrandTelegram size={16} />,
  },
  {
    label: "Threads",
    value: "Threads",
    icon: <IconWorldWww size={16} />,
  },
  {
    label: "Pinterest",
    value: "Pinterest",
    icon: <IconWorldWww size={16} />,
  },
  {
    label: "Reddit",
    value: "Reddit",
    icon: <IconWorldWww size={16} />,
  },
  {
    label: "Discord",
    value: "Discord",
    icon: <IconWorldWww size={16} />,
  },
  {
    label: "Twitch",
    value: "Twitch",
    icon: <IconWorldWww size={16} />,
  },
  {
    label: "GitHub",
    value: "GitHub",
    icon: <IconWorldWww size={16} />,
  },
  {
    label: "GitLab",
    value: "GitLab",
    icon: <IconWorldWww size={16} />,
  },
  {
    label: "Medium",
    value: "Medium",
    icon: <IconWorldWww size={16} />,
  },
  {
    label: "Substack",
    value: "Substack",
    icon: <IconWorldWww size={16} />,
  },
  {
    label: "Bluesky",
    value: "Bluesky",
    icon: <IconWorldWww size={16} />,
  },
  {
    label: "Mastodon",
    value: "Mastodon",
    icon: <IconWorldWww size={16} />,
  },
  {
    label: "Spotify",
    value: "Spotify",
    icon: <IconWorldWww size={16} />,
  },
  {
    label: "SoundCloud",
    value: "SoundCloud",
    icon: <IconWorldWww size={16} />,
  },
  {
    label: "Website",
    value: "Website",
    icon: <IconWorldWww size={16} />,
  },
];

export default function AddLinkForm({ addLink }: AddLinkFormProps) {
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [leftIconName, setLeftIconName] = useState<string | null>(null);
  const [rightIconName, setRightIconName] = useState<string | null>(null);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [publishAt, setPublishAt] = useState("");
  const [expireAt, setExpireAt] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);

  const normalizeUrlForSocial = (social: string, rawUrl: string) => {
    const input = rawUrl.trim();
    if (!input) return "";

    if (/^https?:\/\//i.test(input)) {
      return input;
    }

    if (social === "Website") {
      return `https://${input}`;
    }

    // If user already typed a host without protocol, keep it and add https.
    if (input.includes(".")) {
      return `https://${input}`;
    }

    const base = SOCIAL_BASE_URLS[social];
    if (!base) {
      return `https://${input}`;
    }

    const normalizedHandle = input.replace(/^@+/, "");
    return `${base.replace(/\/+$/, "")}/${normalizedHandle}`;
  };

  const validateUrlForSocial = (social: string, url: string) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      switch (social) {
        case "Instagram":
          return parsed.hostname.includes("instagram.com");
        case "TikTok":
          return parsed.hostname.includes("tiktok.com");
        case "Twitter":
          return (
            parsed.hostname.includes("x.com") ||
            parsed.hostname.includes("twitter.com")
          );
        case "Facebook":
          return parsed.hostname.includes("facebook.com");
        case "Whatsapp":
          return (
            parsed.hostname.includes("wa.me") ||
            parsed.hostname.includes("whatsapp.com")
          );
        case "YouTube":
          return (
            parsed.hostname.includes("youtube.com") ||
            parsed.hostname.includes("youtu.be")
          );
        case "LinkedIn":
          return parsed.hostname.includes("linkedin.com");
        case "Snapchat":
          return parsed.hostname.includes("snapchat.com");
        case "Telegram":
          return (
            parsed.hostname.includes("t.me") ||
            parsed.hostname.includes("telegram.me") ||
            parsed.hostname.includes("telegram.org")
          );
        case "Threads":
          return parsed.hostname.includes("threads.net");
        case "Pinterest":
          return parsed.hostname.includes("pinterest.com");
        case "Reddit":
          return parsed.hostname.includes("reddit.com");
        case "Discord":
          return (
            parsed.hostname.includes("discord.com") ||
            parsed.hostname.includes("discord.gg")
          );
        case "Twitch":
          return parsed.hostname.includes("twitch.tv");
        case "GitHub":
          return parsed.hostname.includes("github.com");
        case "GitLab":
          return parsed.hostname.includes("gitlab.com");
        case "Medium":
          return parsed.hostname.includes("medium.com");
        case "Substack":
          return parsed.hostname.includes("substack.com");
        case "Bluesky":
          return (
            parsed.hostname.includes("bsky.app") ||
            parsed.hostname.includes("blueskyweb.xyz") ||
            parsed.hostname.includes("bsky.social")
          );
        case "Mastodon":
          return parsed.hostname.includes("mastodon");
        case "Spotify":
          return parsed.hostname.includes("spotify.com");
        case "SoundCloud":
          return parsed.hostname.includes("soundcloud.com");
        case "Website":
          return !!parsed.hostname;
        default:
          return false;
      }
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (!newLink.title || !newLink.url) return;

    const normalizedUrl = normalizeUrlForSocial(newLink.title, newLink.url);

    if (!validateUrlForSocial(newLink.title, normalizedUrl)) {
      setUrlError("Please enter a valid URL for the selected social network.");
      return;
    }

    setUrlError(null);

    const publishISO = publishAt ? new Date(publishAt).toISOString() : null;
    const expireISO = expireAt ? new Date(expireAt).toISOString() : null;

    if (scheduleEnabled && publishISO && expireISO) {
      const publishDate = new Date(publishISO);
      const expireDate = new Date(expireISO);
      if (expireDate <= publishDate) {
        alert("Expiry date must be after publish date.");
        return;
      }
    }

    addLink({
      title: newLink.title,
      url: normalizedUrl,
      leftIconName,
      rightIconName,
      publishAt: scheduleEnabled ? publishISO : null,
      expireAt: scheduleEnabled ? expireISO : null,
    });
    setNewLink({ title: "", url: "" });
    setLeftIconName(null);
    setRightIconName(null);
    setScheduleEnabled(false);
    setPublishAt("");
    setExpireAt("");
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group mb="md">
        <IconPlus size={20} />
        <Text fw={600}>Add New Link</Text>
      </Group>

      <Stack gap="sm">
        <Select
          label="Social Network"
          placeholder="Select social network"
          data={SOCIALS.map((s) => ({
            value: s.value,
            label: s.label,
            icon: s.icon,
          }))}
          maxDropdownHeight={170}
          searchable
          nothingFoundMessage="No social network found"
          value={newLink.title}
          onChange={(value) =>
            setNewLink({ ...newLink, title: value || "" })
          }
          leftSection={
            SOCIALS.find((s) => s.value === newLink.title)?.icon || (
              <IconLink size={16} />
            )
          }
          renderOption={({ option }) => {
            const social = SOCIALS.find((s) => s.value === option.value);
            return (
              <Group gap={8}>
                {social?.icon}
                <span>{option.label}</span>
              </Group>
            );
          }}
        />

        <TextInput
          label="URL"
          placeholder="Enter link URL"
          value={newLink.url}
          onChange={(e) =>
            setNewLink({ ...newLink, url: e.currentTarget.value })
          }
          onBlur={() => {
            if (!newLink.title || !newLink.url) return;
            const normalized = normalizeUrlForSocial(newLink.title, newLink.url);
            setNewLink((prev) => ({ ...prev, url: normalized }));
          }}
          error={urlError}
          leftSection={<IconLink size={16} />}
        />

        <Divider label="Optional link icons" labelPosition="center" />

        <Select
          label="Left Icon (Lucide)"
          placeholder="Choose left icon"
          searchable
          clearable
          data={LUCIDE_ICON_NAMES}
          value={leftIconName}
          onChange={setLeftIconName}
          leftSection={renderLucideIcon(leftIconName, 16) || <IconLink size={16} />}
          renderOption={({ option }) => (
            <Group gap={8} wrap="nowrap">
              {renderLucideIcon(option.value, 16)}
              <span>{option.label}</span>
            </Group>
          )}
          nothingFoundMessage="No icon found"
        />

        <Select
          label="Right Icon (Lucide)"
          placeholder="Choose right icon"
          searchable
          clearable
          data={LUCIDE_ICON_NAMES}
          value={rightIconName}
          onChange={setRightIconName}
          leftSection={renderLucideIcon(rightIconName, 16) || <IconLink size={16} />}
          renderOption={({ option }) => (
            <Group gap={8} wrap="nowrap">
              {renderLucideIcon(option.value, 16)}
              <span>{option.label}</span>
            </Group>
          )}
          nothingFoundMessage="No icon found"
        />

        <Switch
          label="Schedule this link"
          checked={scheduleEnabled}
          onChange={(event) => setScheduleEnabled(event.currentTarget.checked)}
        />

        {scheduleEnabled && (
          <>
            <TextInput
              label="Publish at"
              type="datetime-local"
              value={publishAt}
              onChange={(event) => setPublishAt(event.currentTarget.value)}
            />
            <TextInput
              label="Expire at (optional)"
              type="datetime-local"
              value={expireAt}
              onChange={(event) => setExpireAt(event.currentTarget.value)}
            />
          </>
        )}

        <Button onClick={handleSubmit} fullWidth>
          Add Link
        </Button>
      </Stack>
    </Paper>
  );
}