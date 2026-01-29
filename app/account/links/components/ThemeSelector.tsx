"use client";
import { Box, Paper, Group, Text, Select, Stack } from "@mantine/core";
import { IconPalette } from "@tabler/icons-react";
import { themesArray } from "@/app/utils/theme";

interface ThemeSelectorProps {
  selectedTheme: string;
  updateTheme: (theme: string) => void;
}

const themes = themesArray;

export default function ThemeSelector({ selectedTheme, updateTheme }: ThemeSelectorProps) {
  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group mb="md">
        <IconPalette size={20} />
        <Text fw={600}>Theme</Text>
      </Group>

      <Select
        data={themes.map((t) => ({
          value: t.value,
          label: t.label,
        }))}
        value={selectedTheme}
        onChange={updateTheme}
        mb="md"
      />

      <Group gap="xs">
        {themes.map((theme) => (
          <Box
            key={theme.value}
            onClick={() => updateTheme(theme.value)}
            style={{
              width: 40,
              height: 40,
              background: theme.bg,
              borderRadius: 8,
              cursor: "pointer",
              border:
                selectedTheme === theme.value
                  ? "3px solid #228be6"
                  : "2px solid #ddd",
            }}
          />
        ))}
      </Group>
    </Paper>
  );
}