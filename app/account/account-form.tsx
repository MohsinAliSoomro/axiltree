"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Anchor,
  Box,
  Button,
  TextInput,
  Stack,
  Paper,
  Title,
  Divider,
  Textarea,
  FileInput,
  Avatar,
  Progress,
  Text,
  Group,
  ThemeIcon,
  Container,
} from "@mantine/core";
import { createClient } from "@/app/lib/supabase/client";
import { type User } from "@supabase/supabase-js";
import AppShellLayout from "../components/layout";
import { notifications } from "@mantine/notifications";
import { Check, Circle, Save, X, Upload } from "lucide-react";
import { calculateProfileCompletion } from "@/app/utils/profileCompletion";

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const [linksCount, setLinksCount] = useState(0);

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
        setUsername(data.username);
        setTheme(data.theme);
      }

      const { count: linksTotal } = await supabase
        .from("links")
        .select("id", { count: "exact", head: true })
        .eq("profile_id", user?.id);

      setLinksCount(linksTotal || 0);
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

  const completion = calculateProfileCompletion({
    username,
    avatar_url,
    bio,
    theme,
    linksCount,
  });

  return (
    <AppShellLayout>
      <Container size="lg">
        <Paper
          radius={32}
          p={0}
          style={{
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 22px 55px rgba(43, 18, 26, 0.08)",
            border: "1px solid rgba(0, 0, 0, 0.04)",
          }}
        >
          <Group align="stretch" gap={0} wrap="wrap">
            <Box
              style={{
                flex: "1 1 420px",
                minHeight: 560,
                background: "linear-gradient(180deg, #a20b28 0%, #bf0f37 52%, #a50c2d 100%)",
                color: "white",
                padding: "56px 42px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                position: "relative",
              }}
            >
              <Box
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 45% 35%, rgba(255,255,255,0.06), transparent 20%), radial-gradient(circle at 10% 15%, rgba(255,255,255,0.05), transparent 18%)",
                }}
              />

              <Box style={{ position: "relative", zIndex: 1, maxWidth: 320 }}>
                <Text
                  fw={700}
                  size="xs"
                  tt="uppercase"
                  style={{ letterSpacing: "0.35em", opacity: 0.92 }}
                >
                  The digital curator
                </Text>

                <Box
                  style={{
                    position: "absolute",
                    top: -120,
                    left: 42,
                    fontSize: 180,
                    fontWeight: 800,
                    lineHeight: 1,
                    color: "rgba(255, 255, 255, 0.08)",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  C1
                </Box>

                <Title
                  order={1}
                  style={{
                    color: "white",
                    fontSize: "clamp(2.4rem, 4vw, 4rem)",
                    lineHeight: 0.96,
                    letterSpacing: "-0.06em",
                    maxWidth: 280,
                    marginTop: 18,
                  }}
                >
                  Shape your profile.
                </Title>

                <Text mt={20} size="md" c="rgba(255,255,255,0.9)" style={{ lineHeight: 1.7, maxWidth: 290 }}>
                  Keep your public profile aligned with the same editorial style as the rest of AxilTree.
                </Text>
              </Box>
            </Box>

            <Box
              style={{
                flex: "1 1 360px",
                minHeight: 560,
                background: "#fff",
                padding: "58px 48px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Stack gap={20} maw={430} mx="auto" w="100%">
                <Box>
                  <Title order={2} style={{ fontSize: "clamp(2rem, 3vw, 2.55rem)", letterSpacing: "-0.04em", lineHeight: 1.02 }}>
                    Account settings
                  </Title>
                  <Text c="#6b5156" size="sm" mt={8}>
                    Update your profile details and keep your page polished.
                  </Text>
                </Box>

                <Paper radius={20} p={18} style={{ background: "#faf7f6", border: "1px solid #ece4e1" }}>
                  <Stack gap="sm">
                    <Group justify="space-between" align="center">
                      <Text fw={600}>Profile Completion</Text>
                      <Text fw={700}>{completion.score}%</Text>
                    </Group>
                    <Progress value={completion.score} radius="xl" color="red" />
                    <Text size="sm" c="dimmed">
                      {completion.completedCount} of {completion.totalCount} steps completed
                    </Text>
                    <Stack gap={6}>
                      {completion.items.map((item) => (
                        <Group key={item.key} gap="xs" align="center">
                          <ThemeIcon
                            size={18}
                            radius="xl"
                            color={item.completed ? "green" : "gray"}
                            variant="light"
                          >
                            {item.completed ? <Check size={12} /> : <Circle size={10} />}
                          </ThemeIcon>
                          <Text size="sm" c={item.completed ? "dark" : "dimmed"}>
                            {item.label}
                          </Text>
                        </Group>
                      ))}
                    </Stack>
                  </Stack>
                </Paper>

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

                <Stack align="center">
                  {avatar_url && <Avatar src={avatar_url} size={80} radius="50%" />}
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
                  radius="xl"
                  size="md"
                  style={{
                    background: "linear-gradient(90deg, #c51646 0%, #d62f5a 100%)",
                    fontWeight: 700,
                    height: 40,
                    boxShadow: "0 16px 30px rgba(197, 22, 70, 0.22)",
                  }}
                  loading={loading}
                >
                  Update profile
                </Button>

                <Divider />
              </Stack>
            </Box>
          </Group>
        </Paper>
      </Container>
    </AppShellLayout>
  );
}
