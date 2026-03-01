"use client";
import { useState } from "react";
import {
  Button,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Switch,
} from "@mantine/core";
import { IconStack2 } from "@tabler/icons-react";
import {
  getMusicEmbedUrl,
  getVideoEmbedUrl,
  normalizeGalleryImages,
  type ContentBlockType,
} from "@/app/utils/contentBlocks";

type AddContentBlockPayload = {
  type: ContentBlockType;
  title: string;
  isActive: boolean;
  publishAt?: string | null;
  expireAt?: string | null;
  contentJson: {
    text?: string;
    url?: string;
    embedUrl?: string;
    images?: string[];
  };
};

interface AddContentBlockFormProps {
  addContentBlock: (payload: AddContentBlockPayload) => void;
}

const BLOCK_TYPES = [
  { value: "text", label: "Text" },
  { value: "video", label: "Video Embed" },
  { value: "music", label: "Music Embed" },
  { value: "gallery", label: "Image Gallery" },
] as const;

export default function AddContentBlockForm({ addContentBlock }: AddContentBlockFormProps) {
  const [type, setType] = useState<ContentBlockType>("text");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [imagesInput, setImagesInput] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [publishAt, setPublishAt] = useState("");
  const [expireAt, setExpireAt] = useState("");

  const clearForm = () => {
    setTitle("");
    setText("");
    setUrl("");
    setImagesInput("");
    setIsActive(true);
    setScheduleEnabled(false);
    setPublishAt("");
    setExpireAt("");
  };

  const handleSubmit = () => {
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

    if (type === "text") {
      if (!text.trim()) return;
      addContentBlock({
        type,
        title: title.trim(),
        isActive,
        publishAt: scheduleEnabled ? publishISO : null,
        expireAt: scheduleEnabled ? expireISO : null,
        contentJson: { text: text.trim() },
      });
      clearForm();
      return;
    }

    if (type === "gallery") {
      const images = normalizeGalleryImages(imagesInput);
      if (!images.length) {
        alert("Please add at least one valid image URL.");
        return;
      }
      addContentBlock({
        type,
        title: title.trim(),
        isActive,
        publishAt: scheduleEnabled ? publishISO : null,
        expireAt: scheduleEnabled ? expireISO : null,
        contentJson: { images },
      });
      clearForm();
      return;
    }

    if (!url.trim()) return;

    const embedUrl =
      type === "video" ? getVideoEmbedUrl(url.trim()) : getMusicEmbedUrl(url.trim());

    if (!embedUrl) {
      alert(
        type === "video"
          ? "Unsupported video URL. Use YouTube or Vimeo."
          : "Unsupported music URL. Use Spotify or SoundCloud."
      );
      return;
    }

    addContentBlock({
      type,
      title: title.trim(),
      isActive,
      publishAt: scheduleEnabled ? publishISO : null,
      expireAt: scheduleEnabled ? expireISO : null,
      contentJson: {
        url: url.trim(),
        embedUrl,
      },
    });
    clearForm();
  };

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group mb="md">
        <IconStack2 size={20} />
        <Text fw={600}>Add Content Block</Text>
      </Group>

      <Stack gap="sm">
        <Select
          label="Block Type"
          data={BLOCK_TYPES as unknown as { value: string; label: string }[]}
          value={type}
          onChange={(value) => setType((value as ContentBlockType) || "text")}
        />

        <TextInput
          label="Title (optional)"
          placeholder="Add a heading"
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />

        {type === "text" && (
          <Textarea
            label="Text"
            placeholder="Write something for your audience"
            minRows={3}
            value={text}
            onChange={(event) => setText(event.currentTarget.value)}
          />
        )}

        {(type === "video" || type === "music") && (
          <TextInput
            label={type === "video" ? "Video URL" : "Music URL"}
            placeholder={
              type === "video"
                ? "https://www.youtube.com/watch?v=..."
                : "https://open.spotify.com/track/..."
            }
            value={url}
            onChange={(event) => setUrl(event.currentTarget.value)}
          />
        )}

        {type === "gallery" && (
          <Textarea
            label="Image URLs"
            placeholder="Add one URL per line"
            minRows={3}
            value={imagesInput}
            onChange={(event) => setImagesInput(event.currentTarget.value)}
          />
        )}

        <Switch
          label={isActive ? "Live" : "Draft"}
          checked={isActive}
          onChange={(event) => setIsActive(event.currentTarget.checked)}
        />

        <Switch
          label="Schedule this content block"
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

        <Button fullWidth onClick={handleSubmit}>
          Add Block
        </Button>
      </Stack>
    </Paper>
  );
}
