"use client";
import {
  Avatar,
  Paper,
  Stack,
  Group,
  Text,
  TextInput,
  Textarea,
  FileInput,
  Button,
  Box,
  Switch,
  Modal,
  SegmentedControl,
  SimpleGrid,
  Slider,
} from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/app/lib/supabase/client";
import { notifications } from "@mantine/notifications";
import {
  getAvatarAlignment,
  getAvatarSize,
  getAvatarSizePreset,
  getAvatarSizeValue,
  type AvatarSizePreset,
} from "@/app/utils/avatarLayout";
import {
  AvatarShapePreview,
  avatarShapes,
  getAvatarShape,
} from "@/app/utils/avatarShapes";

interface ProfileInfoProps {
  profile: any;
  updateProfile: (field: string, value: any) => Promise<void>;
}

export default function ProfileInfo({ profile, updateProfile }: ProfileInfoProps) {
  const supabase = createClient();
  const avatarSize = getAvatarSize(profile?.avatar_size, 80);
  const avatarSizePreset = getAvatarSizePreset(profile?.avatar_size);
  const avatarAlignment = getAvatarAlignment(profile?.avatar_alignment);
  const backgroundShape = getAvatarShape(profile?.profile_background_shape);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropModalOpen, setCropModalOpen] = useState(false);

  useEffect(() => {
    if (!bannerFile) {
      setBannerPreviewUrl(null);
      setCropZoom(1);
      setCropX(0);
      setCropY(0);
      setCropModalOpen(false);
      return;
    }

    const objectUrl = URL.createObjectURL(bannerFile);
    setBannerPreviewUrl(objectUrl);
    setCropModalOpen(true);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [bannerFile]);

  const getStoragePathFromPublicUrl = (url: string | null | undefined) => {
    if (!url) return null;
    const marker = "/storage/v1/object/public/avatars/";
    const index = url.indexOf(marker);
    if (index === -1) return null;
    return url.slice(index + marker.length);
  };

  const createCroppedBannerFile = async (file: File) => {
    const imageBitmap = await createImageBitmap(file);

    const targetAspect = 3;
    const imageAspect = imageBitmap.width / imageBitmap.height;

    let baseWidth = imageBitmap.width;
    let baseHeight = imageBitmap.height;

    if (imageAspect > targetAspect) {
      baseHeight = imageBitmap.height;
      baseWidth = baseHeight * targetAspect;
    } else {
      baseWidth = imageBitmap.width;
      baseHeight = baseWidth / targetAspect;
    }

    const cropWidth = baseWidth / cropZoom;
    const cropHeight = baseHeight / cropZoom;

    const maxShiftX = (imageBitmap.width - cropWidth) / 2;
    const maxShiftY = (imageBitmap.height - cropHeight) / 2;

    let cropStartX = (imageBitmap.width - cropWidth) / 2 + (cropX / 100) * maxShiftX;
    let cropStartY = (imageBitmap.height - cropHeight) / 2 + (cropY / 100) * maxShiftY;

    cropStartX = Math.max(0, Math.min(cropStartX, imageBitmap.width - cropWidth));
    cropStartY = Math.max(0, Math.min(cropStartY, imageBitmap.height - cropHeight));

    const outputWidth = 1500;
    const outputHeight = 500;

    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to crop banner");

    context.drawImage(
      imageBitmap,
      cropStartX,
      cropStartY,
      cropWidth,
      cropHeight,
      0,
      0,
      outputWidth,
      outputHeight
    );

    const croppedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.92);
    });

    if (!croppedBlob) throw new Error("Failed to create cropped banner image");

    return new File([croppedBlob], `cropped-${file.name}`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  };

  const uploadBanner = async () => {
    if (!bannerFile || !profile?.id) return;

    try {
      setUploadingBanner(true);
      const croppedFile = await createCroppedBannerFile(bannerFile);

      const fileExt = croppedFile.name.split(".").pop();
      const fileName = `${profile.id}-banner-${Date.now()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const oldBannerPath = getStoragePathFromPublicUrl(profile?.banner_url);
      if (oldBannerPath) {
        await supabase.storage.from("avatars").remove([oldBannerPath]);
      }

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, croppedFile, { upsert: true });

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
            size={avatarSize}
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

        <Switch
          label="Show profile image on profile"
          checked={profile?.is_profile_image_show !== false}
          onChange={(event) =>
            updateProfile("is_profile_image_show", event.currentTarget.checked)
          }
        />

        <Stack gap={6}>
          <Text size="sm" fw={500}>
            Profile Picture Size
          </Text>
          <SegmentedControl
            fullWidth
            value={avatarSizePreset}
            onChange={(value) =>
              updateProfile("avatar_size", getAvatarSizeValue(value as AvatarSizePreset))
            }
            data={[
              { label: "Small", value: "small" },
              { label: "Medium", value: "medium" },
              { label: "Large", value: "large" },
            ]}
          />
        </Stack>

        <SegmentedControl
          fullWidth
          value={avatarAlignment}
          onChange={(value) => updateProfile("avatar_alignment", value)}
          data={[
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
          ]}
        />

        <Stack gap={6}>
          <Text size="sm" fw={500}>
            Background Shape
          </Text>
          <SimpleGrid cols={{ base: 2, sm: 3, md: 5 }} spacing="sm">
            {avatarShapes.map((shape) => {
              const selected = backgroundShape === shape.value;
              return (
                <Box
                  key={shape.value}
                  onClick={() => updateProfile("profile_background_shape", shape.value)}
                  style={{
                    border: selected ? "2px solid #667eea" : "1px solid #dee2e6",
                    borderRadius: 12,
                    padding: 10,
                    background: selected ? "#f1f5ff" : "#fff",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.2s ease",
                  }}
                >
                  <AvatarShapePreview
                    shape={shape.value}
                    size={54}
                    fill={selected ? "#667eea" : "#ced4da"}
                    opacity={0.85}
                  />
                  <Text size="xs" fw={600} ta="center">
                    {shape.label}
                  </Text>
                </Box>
              );
            })}
          </SimpleGrid>
        </Stack>

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

        {bannerPreviewUrl && (
          <Stack gap="xs">
            <Text size="sm" fw={500}>Crop Banner</Text>
            <Box
              style={{
                width: "100%",
                height: 130,
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #dee2e6",
                position: "relative",
                backgroundColor: "#f1f3f5",
              }}
            >
              <Box
                component="img"
                src={bannerPreviewUrl}
                alt="Banner crop preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${cropZoom}) translate(${cropX}%, ${cropY}%)`,
                  transformOrigin: "center center",
                }}
              />
            </Box>
            <Text size="xs" c="dimmed">
              Crop editor opens automatically after image selection.
            </Text>
          </Stack>
        )}

        <Button onClick={uploadBanner} loading={uploadingBanner} disabled={!bannerFile}>
          Upload Banner
        </Button>
      </Stack>

      <Modal
        opened={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        title="Crop Banner"
        centered
        size="lg"
      >
        {bannerPreviewUrl && (
          <Stack gap="xs">
            <Box
              style={{
                width: "100%",
                height: 200,
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #dee2e6",
                position: "relative",
                backgroundColor: "#f1f3f5",
              }}
            >
              <Box
                component="img"
                src={bannerPreviewUrl}
                alt="Banner crop preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${cropZoom}) translate(${cropX}%, ${cropY}%)`,
                  transformOrigin: "center center",
                }}
              />
            </Box>

            <Text size="xs" c="dimmed">Zoom</Text>
            <Slider
              min={1}
              max={3}
              step={0.05}
              value={cropZoom}
              onChange={setCropZoom}
            />

            <Text size="xs" c="dimmed">Horizontal Position</Text>
            <Slider
              min={-100}
              max={100}
              step={1}
              value={cropX}
              onChange={setCropX}
            />

            <Text size="xs" c="dimmed">Vertical Position</Text>
            <Slider
              min={-100}
              max={100}
              step={1}
              value={cropY}
              onChange={setCropY}
            />

            <Group justify="flex-end" mt="xs">
              <Button variant="light" onClick={() => setCropModalOpen(false)}>
                Done
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Paper>
  );
}