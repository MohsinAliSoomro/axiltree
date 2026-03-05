"use client";
import { useState, useRef, useEffect } from "react";
import { Modal, Group, Text, Box, Button } from "@mantine/core";
import { IconX, IconArrowLeft } from "@tabler/icons-react";

interface ImageCropModalProps {
  opened: boolean;
  onClose: () => void;
  onBack?: () => void;
  imageFile?: File | string;
  onSave?: (croppedImage: Blob | File) => void;
  onEditCanva?: () => void;
}

export default function ImageCropModal({
  opened,
  onClose,
  onBack,
  imageFile,
  onSave,
  onEditCanva,
}: ImageCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [cropBox, setCropBox] = useState({ x: 50, y: 50, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageFile) {
      if (typeof imageFile === "string") {
        setImageSrc(imageFile);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageSrc(e.target?.result as string);
        };
        reader.readAsDataURL(imageFile);
      }
    }
  }, [imageFile]);

  useEffect(() => {
    if (imageSrc && imageRef.current && containerRef.current) {
      // Initialize crop box to center when image loads
      const img = imageRef.current;
      img.onload = () => {
        const containerWidth = containerRef.current?.clientWidth || 500;
        const containerHeight = containerRef.current?.clientHeight || 400;
        const cropSize = Math.min(containerWidth * 0.6, containerHeight * 0.6, 300);
        setCropBox({
          x: (containerWidth - cropSize) / 2,
          y: (containerHeight - cropSize) / 2,
          width: cropSize,
          height: cropSize,
        });
      };
    }
  }, [imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - cropBox.x, y: e.clientY - cropBox.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - dragStart.x, rect.width - cropBox.width));
      const y = Math.max(0, Math.min(e.clientY - dragStart.y, rect.height - cropBox.height));
      setCropBox({ ...cropBox, x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    if (imageSrc && imageRef.current) {
      // Create canvas for cropping
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx && imageRef.current) {
        canvas.width = cropBox.width;
        canvas.height = cropBox.height;
        ctx.drawImage(
          imageRef.current,
          cropBox.x,
          cropBox.y,
          cropBox.width,
          cropBox.height,
          0,
          0,
          cropBox.width,
          cropBox.height
        );
        canvas.toBlob((blob) => {
          if (blob) {
            onSave?.(blob as Blob);
            onClose();
          }
        }, "image/png");
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="lg"
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

      {/* Image Crop Area */}
      <Box
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          minHeight: "400px",
          maxHeight: "500px",
          background: "repeating-conic-gradient(#f0f0f0 0% 25%, #ffffff 0% 50%) 50% / 20px 20px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {imageSrc && (
          <Box
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop"
              style={{
                maxWidth: "100%",
                maxHeight: "500px",
                height: "auto",
                display: "block",
              }}
            />
            
            {/* Crop Box */}
            <Box
              onMouseDown={handleMouseDown}
              style={{
                position: "absolute",
                left: `${cropBox.x}px`,
                top: `${cropBox.y}px`,
                width: `${cropBox.width}px`,
                height: `${cropBox.height}px`,
                border: "2px solid #228be6",
                cursor: isDragging ? "grabbing" : "move",
                boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)",
                zIndex: 10,
              }}
            >
              {/* Grid Lines */}
              <Box
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                }}
              >
                {/* Vertical lines */}
                <Box
                  style={{
                    position: "absolute",
                    left: "33.33%",
                    top: 0,
                    width: "1px",
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.5)",
                    borderLeft: "1px dashed rgba(255, 255, 255, 0.8)",
                  }}
                />
                <Box
                  style={{
                    position: "absolute",
                    left: "66.66%",
                    top: 0,
                    width: "1px",
                    height: "100%",
                    background: "rgba(255, 255, 255, 0.5)",
                    borderLeft: "1px dashed rgba(255, 255, 255, 0.8)",
                  }}
                />
                {/* Horizontal lines */}
                <Box
                  style={{
                    position: "absolute",
                    top: "33.33%",
                    left: 0,
                    height: "1px",
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.5)",
                    borderTop: "1px dashed rgba(255, 255, 255, 0.8)",
                  }}
                />
                <Box
                  style={{
                    position: "absolute",
                    top: "66.66%",
                    left: 0,
                    height: "1px",
                    width: "100%",
                    background: "rgba(255, 255, 255, 0.5)",
                    borderTop: "1px dashed rgba(255, 255, 255, 0.8)",
                  }}
                />
              </Box>

              {/* Corner Handles */}
              {[
                { top: "-4px", left: "-4px", cursor: "nw-resize" },
                { top: "-4px", right: "-4px", cursor: "ne-resize" },
                { bottom: "-4px", left: "-4px", cursor: "sw-resize" },
                { bottom: "-4px", right: "-4px", cursor: "se-resize" },
              ].map((handle, index) => (
                <Box
                  key={index}
                  style={{
                    position: "absolute",
                    width: "8px",
                    height: "8px",
                    background: "#228be6",
                    borderRadius: "50%",
                    border: "2px solid #fff",
                    ...handle,
                  }}
                />
              ))}

              {/* Side Handles */}
              {[
                { top: "50%", left: "-4px", cursor: "w-resize", transform: "translateY(-50%)" },
                { top: "50%", right: "-4px", cursor: "e-resize", transform: "translateY(-50%)" },
                { top: "-4px", left: "50%", cursor: "n-resize", transform: "translateX(-50%)" },
                { bottom: "-4px", left: "50%", cursor: "s-resize", transform: "translateX(-50%)" },
              ].map((handle, index) => (
                <Box
                  key={index}
                  style={{
                    position: "absolute",
                    width: "8px",
                    height: "8px",
                    background: "#228be6",
                    borderRadius: "50%",
                    border: "2px solid #fff",
                    ...handle,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Action Buttons */}
      <Group justify="space-between" p="md" style={{ borderTop: "1px solid #e0e0e0" }}>
        <Button
          variant="default"
          onClick={onEditCanva}
          leftSection={
            <Box
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "4px",
                background: "linear-gradient(135deg, #00c4cc 0%, #7b2ff7 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text size="xs" fw={700} c="white" style={{ fontFamily: "Arial" }}>
                C
              </Text>
            </Box>
          }
          style={{
            background: "#fff",
            border: "1px solid #ddd",
          }}
        >
          Edit in Canva
        </Button>
        <Button
          onClick={handleSave}
          style={{
            background: "#000",
            color: "#fff",
          }}
        >
          Save
        </Button>
      </Group>
    </Modal>
  );
}

