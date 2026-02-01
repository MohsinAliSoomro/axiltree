"use client";
import { User } from "@supabase/supabase-js";
import { Avatar, Paper, Stack, Group, Text, TextInput, Textarea } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

interface ProfileInfoProps {
  profile: any;
  updateProfile: (field: string, value: any) => Promise<void>;
}

export default function ProfileInfo({ profile, updateProfile }: ProfileInfoProps) {
  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group mb="md">
        <IconUser size={20} />
        <Text fw={600}>Profile Information</Text>
      </Group>

      <Stack gap="sm">
        <Group>
          <Avatar
            src={profile?.avatar_url}
            size="lg"
            radius="xl"
          />
          <Stack gap={4} style={{ flex: 1 }}>
            <TextInput
              placeholder="Display Name"
              value={profile?.full_name || ""}
              onChange={(e) =>
                updateProfile("full_name", e.target.value)
              }
              disabled
            />
            <TextInput
              placeholder="@username"
              value={profile?.username || ""}
              onChange={(e) =>
                updateProfile("username", e.target.value)
              }
              disabled
            />
          </Stack>
        </Group>

        <Textarea
          placeholder="Bio"
          value={profile?.bio || ""}
          onChange={(e) => updateProfile("bio", e.target.value)}
          minRows={2}
        />
      </Stack>
    </Paper>
  );
}