"use client";

import { useCallback, useEffect, useState } from "react";
import {
  TextInput,
  Button,
  Stack,
  Paper,
  Title,
  Divider,
  Textarea,
  FileInput,
  Avatar,
} from "@mantine/core";
import { createClient } from "@/app/lib/supabase/client";
import { type User } from "@supabase/supabase-js";
import AppShellLayout from "../components/layout";
import { notifications } from "@mantine/notifications";
import { Check, Save, X, Upload } from "lucide-react";

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Fetch profile
  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) throw error;
      if (data) {
        setFullname(data.full_name);
        setBio(data.bio);
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

  // Upload avatar to Supabase bucket
  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return avatar_url;

    const fileExt = avatarFile.name.split(".").pop();
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { data, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, { upsert: true });
    if (uploadError) {
      notifications.show({
        title: "Upload failed",
        message: "Failed to upload avatar",
        color: "red",
        icon: <X size={18} />,
      });
      return null;
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  };

  // Update profile
  async function updateProfile() {
    try {
      setLoading(true);

      // 1️⃣ Upload avatar if selected
      const avatarPublicUrl = await uploadAvatar();

      // 2️⃣ Update profile in database
      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: fullname,
        bio,
        avatar_url: avatarPublicUrl,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setAvatarUrl(avatarPublicUrl || avatar_url);

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

          <Textarea
            label="Bio"
            placeholder="Tell us about yourself"
            value={bio || ""}
            onChange={(e) => setBio(e.currentTarget.value)}
          />

          {/* Avatar Preview */}
          <Stack align="center" >
            {avatar_url && <Avatar src={avatar_url} size={80} radius="xl" />}
            <FileInput
              label="Upload Avatar"
              placeholder="Choose file"
              accept="image/png,image/jpeg"
              leftSection={<Upload size={16} />}
              onChange={setAvatarFile}
            />
          </Stack>

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
