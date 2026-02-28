"use client";
import { Avatar, Paper, Stack, Group, Text, TextInput, Textarea, FileInput, Button, Box, Switch } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { Upload } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { notifications } from "@mantine/notifications";

interface ProfileInfoProps {
  profile: any;
  updateProfile: (field: string, value: any) => Promise<void>;
}

export default function ProfileInfo({ profile, updateProfile }: ProfileInfoProps) {
  const supabase = createClient();
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const getStoragePathFromPublicUrl = (url: string | null | undefined) => {
    if (!url) return null;
    const marker = "/storage/v1/object/public/avatars/";
    const index = url.indexOf(marker);
    if (index === -1) return null;
    return url.slice(index + marker.length);
  };

  const uploadBanner = async () => {
    if (!bannerFile || !profile?.id) return;

    try {
      setUploadingBanner(true);
      const fileExt = bannerFile.name.split(".").pop();
      const fileName = `${profile.id}-banner-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const oldBannerPath = getStoragePathFromPublicUrl(profile?.banner_url);
      if (oldBannerPath) {
        await supabase.storage.from("avatars").remove([oldBannerPath]);
      }

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, bannerFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      await updateProfile("banner_url", data.publicUrl);
      setBannerFile(null);

      notifications.show({
        title: "Banner updated",
        message: "Your banner has been uploaded.",
        color: "green",
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Banner upload failed",
        message: "Please try again.",
        color: "red",
      });
    } finally {
      setUploadingBanner(false);
    }
  };

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
            radius="50%"
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

        <Switch
          label="Show banner on profile"
          checked={Boolean(profile?.is_banner_show)}
          onChange={(event) =>
            updateProfile("is_banner_show", event.currentTarget.checked)
          }
        />

        {profile?.banner_url && !bannerFile && (
          <Box
            style={{
              width: "100%",
              height: 130,
              borderRadius: 0,
              overflow: "hidden",
              backgroundImage: `url(${profile.banner_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        <FileInput
          label="Banner Image"
          placeholder="Choose banner"
          accept="image/png,image/jpeg,image/webp"
          leftSection={<Upload size={16} />}
          value={bannerFile}
          onChange={setBannerFile}
        />

        <Button onClick={uploadBanner} loading={uploadingBanner} disabled={!bannerFile}>
          Upload Banner
        </Button>
      </Stack>
    </Paper>
  );
}