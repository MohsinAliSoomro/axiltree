"use client";
import { Box, Paper, Group, Text, Select, Stack } from "@mantine/core";
import { IconBrandFunimation } from "@tabler/icons-react";
import { animationOptions } from "@/app/utils/animations";

interface AnimationSelectorProps {
  selectedAnimation: string;
  updateAnimation: (animation: string) => void;
}

export default function AnimationSelector({ selectedAnimation, updateAnimation }: AnimationSelectorProps) {
  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group mb="md">
        <IconBrandFunimation size={20} />
        <Text fw={600}>Animation</Text>
      </Group>

      <Select
        data={animationOptions.map((a) => ({
          value: a.value,
          label: a.label,
        }))}
        value={selectedAnimation}
        onChange={updateAnimation}
        mb="md"
      />

      <Box
        style={{
          maxHeight: "240px",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "4px",
        }}
      >
        <Group gap="xs" wrap="wrap">
          {animationOptions.map((animation) => (
            <Box
              key={animation.value}
              onClick={() => updateAnimation(animation.value)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "#f8f9fa",
                border:
                  selectedAnimation === animation.value
                    ? "3px solid #228be6"
                    : "2px solid #ddd",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                transition: "all 0.2s",
                overflow: "hidden",
                flexShrink: 0,
              }}
              title={animation.label}
            >
              <span style={{
                display: "inline-block",
                lineHeight: 1,
                maxWidth: "100%",
                maxHeight: "100%",
              }}>
                {animation.icon}
              </span>
            </Box>
          ))}
        </Group>
      </Box>
    </Paper>
  );
}