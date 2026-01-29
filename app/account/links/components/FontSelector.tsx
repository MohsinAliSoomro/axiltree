"use client";
import { Paper, Group, Text, Select, Stack } from "@mantine/core";
import { IconFileTypography } from "@tabler/icons-react";

interface FontSelectorProps {
  selectedFont: string;
  updateFont: (font: string) => void;
}

export const fontOptions = [
  {
    value: "inter",
    label: "Inter (Clean & Modern)",
    css: "var(--font-inter)",
  },
  {
    value: "poppins",
    label: "Poppins (Stylish)",
    css: "var(--font-poppins)",
  },
  {
    value: "space",
    label: "Space Mono (Techy)",
    css: "var(--font-space)",
  },
  {
    value: "quicksand",
    label: "Quicksand (Friendly)",
    css: "var(--font-quicksand)",
  },
  {
    value: "amarna",
    label: "Amarna (Elegant)",
    css: "var(--font-amarna)",
  },
  {
    value: "delius",
    label: "Delius (Handwritten)",
    css: "var(--font-delius)",
  },
  {
    value: "borel",
    label: "Borel (Playful)",
    css: "var(--font-borel)",
  },
  {
    value: "iceland",
    label: "Iceland (Futuristic)",
    css: "var(--font-iceland)",
  },
];

export default function FontSelector({ selectedFont, updateFont }: FontSelectorProps) {
  return (
    <Paper shadow="sm" p="md" withBorder mt="sm">
      <Group mb="md">
        <IconFileTypography size={20} />
        <Text fw={600}>Font </Text>
      </Group>

      <Stack gap="sm">
        {/* <Select
          label="Profile Font"
          placeholder="Choose a font"
          data={fontOptions.map((f) => ({
            value: f.value,
            label: f.label,
          }))}
          value={selectedFont}
          //@ts-ignore  
          onChange={updateFont}
        /> */}
      </Stack>
    </Paper>
  );
}