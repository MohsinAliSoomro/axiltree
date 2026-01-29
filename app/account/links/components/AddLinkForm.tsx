"use client";
import { useState } from "react";
import { Paper, Stack, Group, Select, Text, TextInput, Button } from "@mantine/core";
import { IconPlus, IconLink } from "@tabler/icons-react";

interface AddLinkFormProps {
  addLink: (title: string, url: string) => void;
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

  const handleSubmit = () => {
    if (newLink.title && newLink.url) {
      addLink(newLink.title, newLink.url);
      setNewLink({ title: "", url: "" });
    }
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
          onChange={(value: any) =>
            setNewLink({ ...newLink, title: value })
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

        <Button onClick={handleSubmit} fullWidth>
          Add Link
        </Button>
      </Stack>
    </Paper>
  );
}