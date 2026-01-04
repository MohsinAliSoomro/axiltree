"use client";
import { useState } from "react";
import { Modal, Group, Text, Box, Stack } from "@mantine/core";
import {
  IconX,
  IconPhoto,
  IconPlayerPlay,
  IconWand,
  IconChevronRight,
  IconBolt,
} from "@tabler/icons-react";
import UploadMediaModal from "./UploadMediaModal";

interface ProfileImageModalProps {
  opened: boolean;
  onClose: () => void;
  onSelectImage?: () => void;
  onSelectVideo?: () => void;
  onGenerateAI?: () => void;
  onDesignCanva?: () => void;
  onImageSave?: (file: File | Blob) => void;
}

export default function ProfileImageModal({
  opened,
  onClose,
  onSelectImage,
  onSelectVideo,
  onGenerateAI,
  onDesignCanva,
  onImageSave,
}: ProfileImageModalProps) {
  const [uploadModalOpened, setUploadModalOpened] = useState(false);

  const handleSelectImage = () => {
    onSelectImage?.();
    setUploadModalOpened(true);
  };

  const handleFileSelect = (file: File | Blob) => {
    onImageSave?.(file);
  };
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Profile Image"
      centered
      size="md"
      radius="md"
      styles={{
        title: {
          fontSize: "18px",
          fontWeight: 600,
        },
      }}
      closeButtonProps={{
        icon: <IconX size={18} />
      }}
    >
      <Stack gap="xs">
        {/* Select image or GIF */}
        <Box
          onClick={handleSelectImage}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8f9fa";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <Box
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fff",
            }}
          >
            <IconPhoto size={20} color="#666" />
          </Box>
          <Text size="sm" style={{ flex: 1 }}>
            Select image or GIF
          </Text>
          <IconChevronRight size={18} color="#999" />
        </Box>

        {/* Select video */}
        <Box
          onClick={onSelectVideo}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8f9fa";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <Box
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "6px",
              background: "#ffd43b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconPlayerPlay size={20} color="#fff" fill="#fff" />
          </Box>
          <Text size="sm" style={{ flex: 1 }}>
            Select video
          </Text>
          <IconChevronRight size={18} color="#999" />
        </Box>

        {/* Generate with AI */}
        <Box
          onClick={onGenerateAI}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8f9fa";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <Box
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconWand size={20} color="#fff" />
          </Box>
          <Group gap="xs" style={{ flex: 1 }}>
            <Text size="sm">Generate with AI</Text>
            <IconBolt size={14} color="#999" />
          </Group>
          <IconChevronRight size={18} color="#999" />
        </Box>

        {/* Design with Canva */}
        <Box
          onClick={onDesignCanva}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f8f9fa";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <Box
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, #00c4cc 0%, #7b2ff7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Text
              size="xs"
              fw={700}
              c="white"
              style={{
                fontFamily: "Arial, sans-serif",
                letterSpacing: "-0.5px",
              }}
            >
              C
            </Text>
          </Box>
          <Text size="sm" style={{ flex: 1 }}>
            Design with Canva
          </Text>
          <IconChevronRight size={18} color="#999" />
        </Box>
      </Stack>

      {/* Upload Media Modal */}
      <UploadMediaModal
        opened={uploadModalOpened}
        onClose={() => {
          setUploadModalOpened(false);
          onClose();
        }}
        onBack={() => {
          setUploadModalOpened(false);
        }}
        onFileSelect={handleFileSelect}
        accept="image/*,image/gif"
        hint="Please upload an image"
      />
    </Modal>
  );
}

