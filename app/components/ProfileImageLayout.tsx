"use client";
import { useState, useEffect } from "react";
import { Group, Text, Box, Button } from "@mantine/core";
import { IconUser, IconBolt } from "@tabler/icons-react";
import ProfileImageModal from "./ProfileImageModal";

type LayoutType = "classic" | "hero";

interface ProfileImageLayoutProps {
  selectedLayout?: LayoutType;
  onLayoutChange?: (layout: LayoutType) => void;
  onImageSave?: (file: File | Blob) => void;
}

export default function ProfileImageLayout({
  selectedLayout = "classic",
  onLayoutChange,
  onImageSave,
}: ProfileImageLayoutProps) {
  const [layout, setLayout] = useState<LayoutType>(selectedLayout);
  
  // Update layout when selectedLayout prop changes
  useEffect(() => {
    setLayout(selectedLayout);
  }, [selectedLayout]);
  const [modalOpened, setModalOpened] = useState(false);

  const handleLayoutChange = (newLayout: LayoutType) => {
    setLayout(newLayout);
    onLayoutChange?.(newLayout);
  };

  return (
    <Group gap="md" mt="md">
      {/* Classic Layout */}
      <Button
        variant="default"
        onClick={() => handleLayoutChange("classic")}
        style={{
          width: "245px",
          height: "40px",
          padding: 0,
          background: "#f8f9fa",
          border: layout === "classic" ? "3px solid #000" : "1px solid #ddd",
          borderRadius: "8px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
          }}
        >
          <Box
            style={{
              width: "25px",
              height: "25px",
              borderRadius: "50%",
              border: "2px solid #666",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconUser size={14} color="#666" />
          </Box>
          <Text size="xs" fw={500} c="dimmed">
            Classic
          </Text>
        </Box>
      </Button>

      {/* Hero Layout */}
      <Button
        variant="default"
        onClick={() => {
          setModalOpened(true);
          handleLayoutChange("hero");
        }}
        style={{
          width: "245px",
          height: "40px",
          padding: 0,
          background: "#f8f9fa",
          border: layout === "hero" ? "3px solid #000" : "1px solid #ddd",
          borderRadius: "8px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2px",
            position: "relative",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Lightning bolt icon in top right */}
          {layout === "hero" && (
            <Box
              style={{
                position: "absolute",
                top: "4px",
                right: "0px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconBolt size={12} color="#fff" />
            </Box>
          )}
          
          {/* Hero icon with square and brackets */}
          <Box
            style={{
              width: "25px",
              height: "25px",
              border: "2px solid #666",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <IconUser size={10} color="#666" />
            {/* Corner brackets */}
            <Box
              style={{
                position: "absolute",
                top: "-2px",
                left: "-2px",
                width: "8px",
                height: "8px",
                borderTop: "2px solid #666",
                borderLeft: "2px solid #666",
              }}
            />
            <Box
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                width: "8px",
                height: "8px",
                borderTop: "2px solid #666",
                borderRight: "2px solid #666",
              }}
            />
            <Box
              style={{
                position: "absolute",
                bottom: "-2px",
                left: "-2px",
                width: "8px",
                height: "8px",
                borderBottom: "2px solid #666",
                borderLeft: "2px solid #666",
              }}
            />
            <Box
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                width: "8px",
                height: "8px",
                borderBottom: "2px solid #666",
                borderRight: "2px solid #666",
              }}
            />
          </Box>
          <Text size="xs" fw={500} c="dimmed">
            Hero
          </Text>
        </Box>
      </Button>

      {/* Profile Image Modal */}
      <ProfileImageModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSelectImage={() => {
          setModalOpened(false);
        }}
        onSelectVideo={() => {
          setModalOpened(false);
        }}
        onGenerateAI={() => {
          setModalOpened(false);
        }}
        onDesignCanva={() => {
          setModalOpened(false);
        }}
        onImageSave={(file) => {
          onImageSave?.(file);
          setModalOpened(false);
        }}
      />
    </Group>
  );
}