"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Box, Paper, Group, Text } from "@mantine/core";
import { IconBrandFunimation } from "@tabler/icons-react";
import { animationOptions, getAnimationVariants } from "@/app/utils/animations";

interface AnimationSelectorProps {
  selectedAnimation: string;
  updateAnimation: (animation: string) => void;
}

const BOX_BG_COLORS = [
  "#e8f4fd", // soft blue
  "#f3e8fd", // lavender
  "#e8fdf5", // mint
  "#fff4e6", // peach
  "#fef9e8", // cream
  "#fce8f0", // pink
  "#e6f2ff", // sky
  "#f0e8fd", // violet
  "#e8faf0", // green
  "#fff8e6", // warm
];

export default function AnimationSelector({ selectedAnimation, updateAnimation }: AnimationSelectorProps) {
  const [replayKeys, setReplayKeys] = useState<Record<string, number>>({});

  const replayAnimation = (value: string) => {
    setReplayKeys((prev) => ({ ...prev, [value]: (prev[value] ?? 0) + 1 }));
  };

  return (
    <Paper shadow="sm" p="md" withBorder radius="md">
      <Group mb="md" gap="xs">
        <IconBrandFunimation size={20} stroke={1.5} />
        <Text fw={600} size="sm">Animation</Text>
      </Group>

      <Box
        className="animation-selector-grid"
        style={{
          maxHeight: 260,
          overflowY: "auto",
          overflowX: "hidden",
          padding: 4,
        }}
      >
        <style>{`
          .animation-selector-grid {
            scrollbar-width: thin;
            scrollbar-color: #c1c9d2 transparent;
          }
          .animation-selector-grid::-webkit-scrollbar { width: 6px; }
          .animation-selector-grid::-webkit-scrollbar-track { background: transparent; }
          .animation-selector-grid::-webkit-scrollbar-thumb {
            background: #c1c9d2;
            border-radius: 3px;
          }
          .anim-box {
            transition: transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease, border-color 0.12s ease;
          }
          .anim-box:hover {
            transform: scale(1.06);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            filter: brightness(1.05);
            border-color: #ced4da !important;
          }
          .anim-box:active {
            transform: scale(0.97);
          }
        `}</style>
        <Group gap={6} wrap="wrap">
          {animationOptions.map((animation, index) => {
            const isSelected = selectedAnimation === animation.value;
            const boxBg = BOX_BG_COLORS[index % BOX_BG_COLORS.length];
            const variants = getAnimationVariants(animation.value);
            return (
              <Box
                key={animation.value}
                className="anim-box"
                onClick={() => updateAnimation(animation.value)}
                onMouseEnter={() => replayAnimation(animation.value)}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: isSelected ? "#e7f5ff" : boxBg,
                  border: isSelected ? "2px solid #228be6" : "1px solid rgba(0,0,0,0.06)",
                  boxShadow: isSelected ? "0 1px 4px rgba(34, 139, 230, 0.25)" : "0 1px 2px rgba(0,0,0,0.04)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  overflow: "hidden",
                  flexShrink: 0,
                }}
                title={animation.label}
              >
                <motion.span
                  key={`${animation.value}-${replayKeys[animation.value] ?? 0}`}
                  style={{
                    display: "inline-block",
                    lineHeight: 1,
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                  initial={variants.initial}
                  animate={variants.animate}
                  transition={variants.transition}
                >
                  {animation.icon}
                </motion.span>
              </Box>
            );
          })}
        </Group>
      </Box>
    </Paper>
  );
}