"use client";

import { Box, Group, Paper, Text } from "@mantine/core";
import { IconLayoutList, IconLayoutGrid, IconCarouselHorizontal } from "@tabler/icons-react";

interface LayoutSelectorProps {
  selectedLayout: string;
  updateLayout: (layout: string) => void;
}

const layoutOptions = [
  { value: "stack", label: "Stack", icon: IconLayoutList },
  { value: "grid", label: "Grid", icon: IconLayoutGrid },
  { value: "carousel", label: "Carousel", icon: IconCarouselHorizontal },
];

export default function LayoutSelector({
  selectedLayout,
  updateLayout,
}: LayoutSelectorProps) {
  return (
    <Paper shadow="sm" p="md" withBorder mb="sm">
      <Group mb="md">
        <IconLayoutGrid size={20} />
        <Text fw={600}>Showcase Layout</Text>
      </Group>

      <Group gap="xs">
        {layoutOptions.map((option) => {
          const Icon = option.icon;

          return (
            <Box
              key={option.value}
              onClick={() => updateLayout(option.value)}
              style={{
                width: 88,
                borderRadius: 10,
                border:
                  selectedLayout === option.value
                    ? "2px solid #228be6"
                    : "1px solid #dee2e6",
                background: selectedLayout === option.value ? "#edf2ff" : "#fff",
                cursor: "pointer",
                padding: "10px 8px",
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              <Group justify="center" mb={6}>
                <Icon size={18} />
              </Group>
              <Text size="xs" fw={600}>
                {option.label}
              </Text>
            </Box>
          );
        })}
      </Group>
    </Paper>
  );
}
