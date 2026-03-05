"use client";
import { useState } from "react";
import {
  Paper,
  Stack,
  Group,
  Select,
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

interface AddLinkFormProps {
  addLink: (payload: {
    title: string;
    url: string;
    publishAt?: string | null;
    expireAt?: string | null;
  }) => void;
}

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
    label: "Website",
    value: "Website",
    icon: <IconWorldWww size={16} />,
  },
];

export default function AddLinkForm({ addLink }: AddLinkFormProps) {
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [publishAt, setPublishAt] = useState("");
  const [expireAt, setExpireAt] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);

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
          return parsed.hostname.includes("x.com");
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

    if (!validateUrlForSocial(newLink.title, newLink.url)) {
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
      url: newLink.url,
      publishAt: scheduleEnabled ? publishISO : null,
      expireAt: scheduleEnabled ? expireISO : null,
    });
    setNewLink({ title: "", url: "" });
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
          error={urlError}
          leftSection={<IconLink size={16} />}
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