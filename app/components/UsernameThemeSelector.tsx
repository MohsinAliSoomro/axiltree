"use client";
import { ColorInput, Group, Text, Paper, Box, Stack } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import {
  getUsernameThemePickerColor,
  usernameThemes,
} from "@/app/utils/usernameThemes";

interface UsernameThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

export default function UsernameThemeSelector({
  selectedTheme,
  onThemeChange,
}: UsernameThemeSelectorProps) {
  const swatches = [
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
    "#facc15",
  ];

  const presetThemes = usernameThemes;

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group mb="md">
        <IconUser size={20} />
        <Text fw={600}>Username Color</Text>
      </Group>

      <Stack gap="sm">
        <Group gap="xs" wrap="wrap">
          {presetThemes.map((theme) => (
            <Box
              key={theme.value}
              onClick={() => onThemeChange(theme.value)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: theme.bg,
                border:
                  selectedTheme === theme.value || selectedTheme === theme.color
                    ? "3px solid #228be6"
                    : "2px solid #ddd",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                overflow: "hidden",
                flexShrink: 0,
              }}
              title={theme.label}
            />
          ))}
        </Group>

        <ColorInput
          value={getUsernameThemePickerColor(selectedTheme)}
          onChange={onThemeChange}
          format="hex"
          swatches={swatches}
          swatchesPerRow={6}
          popoverProps={{ withinPortal: true }}
        />
      </Stack>
    </Paper>
  );
}

