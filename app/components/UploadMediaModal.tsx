"use client";
import { useState, useRef } from "react";
import { Modal, Group, Text, Box, Stack } from "@mantine/core";
import { IconX, IconArrowLeft, IconFileUpload } from "@tabler/icons-react";
import ImageCropModal from "./ImageCropModal";

interface UploadMediaModalProps {
  opened: boolean;
  onClose: () => void;
  onBack?: () => void;
  onFileSelect?: (file: File) => void;
  accept?: string;
  hint?: string;
}

export default function UploadMediaModal({
  opened,
  onClose,
  onBack,
  onFileSelect,
  accept = "image/*",
  hint = "Please upload an image",
}: UploadMediaModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [cropModalOpened, setCropModalOpened] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setCropModalOpened(true);
  };

  const handleCropSave = (croppedImage: Blob | File) => {
    // Convert blob to file if needed
    const file = croppedImage instanceof File 
      ? croppedImage 
      : new File([croppedImage], selectedFile?.name || "cropped-image.png", { type: "image/png" });
    
    onFileSelect?.(file);
    setCropModalOpened(false);
    onClose();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="md"
      radius="md"
      withCloseButton={false}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      {/* Header */}
      <Group
        justify="space-between"
        p="md"
        style={{
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box
          onClick={onBack || onClose}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconArrowLeft size={20} />
        </Box>
        <Text fw={600} size="lg">
          Upload media
        </Text>
        <Box
          onClick={onClose}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconX size={20} />
        </Box>
      </Group>

      {/* Content */}
      <Box p="xl">
        <Box
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? "#228be6" : "#d0d0d0"}`,
            borderRadius: "8px",
            padding: "60px 40px",
            textAlign: "center",
            cursor: "pointer",
            background: isDragging ? "#f0f7ff" : "#fafafa",
            transition: "all 0.2s",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          {/* File Icon with folded corner */}
          <Box
            style={{
              position: "relative",
              width: "80px",
              height: "80px",
            }}
          >
            <IconFileUpload size={80} color="#999" />
            {/* Folded corner effect */}
            <Box
              style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                width: "24px",
                height: "24px",
                background: "#e0e0e0",
                borderRadius: "0 0 0 4px",
                borderLeft: "2px solid #ccc",
                borderBottom: "2px solid #ccc",
                transform: "rotate(45deg)",
              }}
            />
          </Box>

          <Stack gap="xs" align="center">
            <Text size="md" fw={500}>
              Select file to upload, or drag-and-drop file
            </Text>
            <Text size="sm" c="dimmed">
              {hint}
            </Text>
          </Stack>
        </Box>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />
      </Box>

      {/* Image Crop Modal */}
      <ImageCropModal
        opened={cropModalOpened}
        onClose={() => {
          setCropModalOpened(false);
        }}
        onBack={() => {
          setCropModalOpened(false);
        }}
        imageFile={selectedFile || undefined}
        onSave={handleCropSave}
        onEditCanva={() => {
          console.log("Edit in Canva clicked");
        }}
      />
    </Modal>
  );
}

