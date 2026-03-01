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
import { IconPlus, IconLink } from "@tabler/icons-react";

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
    icon: <IconPlus size={16} />,
  },
  { label: "TikTok", value: "TikTok", icon: <IconPlus size={16} /> },
  { label: "Twitter", value: "Twitter", icon: <IconPlus size={16} /> },
  {
    label: "Facebook",
    value: "Facebook",
    icon: <IconPlus size={16} />,
  },
  {
    label: "Whatsapp",
    value: "Whatsapp",
    icon: <IconPlus size={16} />,
  },
];

export default function AddLinkForm({ addLink }: AddLinkFormProps) {
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [publishAt, setPublishAt] = useState("");
  const [expireAt, setExpireAt] = useState("");

  const handleSubmit = () => {
    if (!newLink.title || !newLink.url) return;

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
          value={newLink.title}
          onChange={(value) =>
            setNewLink({ ...newLink, title: value || "" })
          }
        />

        <TextInput
          label="URL"
          placeholder="Enter link URL"
          value={newLink.url}
          onChange={(e) =>
            setNewLink({ ...newLink, url: e.currentTarget.value })
          }
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