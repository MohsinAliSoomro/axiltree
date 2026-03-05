"use client";
import { Box, Paper, Group, Text } from "@mantine/core";
import { IconBrandFunimation } from "@tabler/icons-react";
import { animationOptions, getAnimationVariants } from "@/app/utils/animations";
import { motion } from "framer-motion";
import {
  Sparkles,
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  RotateCw,
  FlipHorizontal,
  ZoomIn,
  ZoomOut,
  Waves,
  CircleDot,
} from "lucide-react";

interface AnimationSelectorProps {
  selectedAnimation: string;
  updateAnimation: (animation: string) => void;
}

const iconByAnimation: Record<string, React.ComponentType<{ size?: number }>> = {
  none: CircleDot,
  fade: Sparkles,
  "slide-up": MoveUp,
  "slide-down": MoveDown,
  "slide-left": MoveLeft,
  "slide-right": MoveRight,
  bounce: CircleDot,
  scale: ZoomIn,
  rotate: RotateCw,
  flip: FlipHorizontal,
  "zoom-in": ZoomIn,
  "zoom-out": ZoomOut,
  shake: Waves,
  pulse: CircleDot,
  wiggle: Waves,
  glow: Sparkles,
  float: Sparkles,
  elastic: Waves,
  spring: CircleDot,
  "fade-up": MoveUp,
  "fade-down": MoveDown,
  "fade-left": MoveLeft,
  "fade-right": MoveRight,
  spin: RotateCw,
  rubber: CircleDot,
  swing: MoveRight,
  tada: Sparkles,
  heartbeat: CircleDot,
  flash: Sparkles,
  "slide-rotate": RotateCw,
  "zoom-rotate": RotateCw,
};

export default function AnimationSelector({ selectedAnimation, updateAnimation }: AnimationSelectorProps) {
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
        <Group gap="xs" wrap="wrap">
          {animationOptions.map((animation) => (
            <AnimationPreviewBox
              key={animation.value}
              value={animation.value}
              label={animation.label}
              selected={selectedAnimation === animation.value}
              onClick={() => updateAnimation(animation.value)}
            />
          ))}
        </Group>
      </Box>
    </Paper>
  );
}

function AnimationPreviewBox({
  value,
  label,
  selected,
  onClick,
}: {
  value: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  const variants = getAnimationVariants(value);
  const IconComponent = iconByAnimation[value] || Sparkles;

  return (
    <Box
      onClick={onClick}
      style={{
        width: 40,
        height: 40,
        borderRadius: 8,
        background: "#f8f9fa",
        border: selected ? "3px solid #228be6" : "2px solid #ddd",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        overflow: "hidden",
        flexShrink: 0,
      }}
      title={label}
    >
      <motion.div
        initial={variants.initial as any}
        animate={variants.animate as any}
        transition={
          value === "none"
            ? { duration: 0 }
            : {
                duration: 1.1,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }
        }
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <IconComponent size={16} />
      </motion.div>
    </Box>
  );
}