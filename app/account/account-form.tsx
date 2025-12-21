"use client";

import { useCallback, useEffect, useState } from "react";
import {
  TextInput,
  Button,
  Stack,
  Paper,
  Title,
  Divider,
} from "@mantine/core";
import { createClient } from "@/app/lib/supabase/client";
import { type User } from "@supabase/supabase-js";
import AppShellLayout from "../components/layout";
import { notifications } from "@mantine/notifications";
import { Check, Save, X } from "lucide-react";

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) throw error;
      console.log("Profile data fetched:", data);
      if (data) {
        setFullname(data.full_name);
        // setUsername(data.email);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  async function updateProfile() {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: fullname,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      notifications.show({
        title: "Profile updated",
        message: "Your profile information has been saved successfully.",
        color: "green",
        icon: <Check size={18} />,
      });
    } catch (error) {
      console.error(error);

      notifications.show({
        title: "Update failed",
        message: "Something went wrong while updating your profile.",
        color: "red",
        icon: <X size={18} />,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShellLayout>
      <Paper radius="lg" p="lg" maw={420} mx="auto" withBorder>
        <Stack gap="md">
          <Title order={3}>Account Settings</Title>

          <TextInput label="Email" value={user?.email || ""} disabled />

          <TextInput
            label="Full name"
            placeholder="Your full name"
            value={fullname || ""}
            onChange={(e) => setFullname(e.currentTarget.value)}
          />

          <Button
            leftSection={<Save size={16} />}
            onClick={updateProfile}
            variant="gradient"
            loading={loading}
          >
            Update profile
          </Button>

          <Divider />
        </Stack>
      </Paper>
    </AppShellLayout>
  );
}
