"use client";
import { Box, Paper, Group, Text, ColorInput, Stack } from "@mantine/core";
import { IconPalette } from "@tabler/icons-react";
import {
  getThemeConfig,
  getThemePickerColor,
  themesArray,
} from "@/app/utils/theme";

interface ThemeSelectorProps {
  selectedTheme: string;
  updateTheme: (theme: string) => void;
}

const themes = themesArray;

export default function ThemeSelector({ selectedTheme, updateTheme }: ThemeSelectorProps) {
  const presetThemes = themes;

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group mb="md">
        <IconPalette size={20} />
        <Text fw={600}>Theme</Text>
      </Group>

      <Stack gap="sm">
        <Group gap="xs" wrap="wrap">
          {presetThemes.map((theme) => (
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

        <ColorInput
          value={getThemePickerColor(selectedTheme)}
          onChange={updateTheme}
          format="hex"
          swatches={[
            "#ffffff",
            "#111827",
            "#1d4ed8",
            "#0ea5e9",
            "#10b981",
            "#f59e0b",
            "#ef4444",
            "#ec4899",
            "#8b5cf6",
            "#14b8a6",
            "#d946ef",
            "#f97316",
          ]}
          swatchesPerRow={6}
          popoverProps={{ withinPortal: true }}
        />
      </Stack>
    </Paper>
  );
}