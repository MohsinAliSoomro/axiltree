"use client";
import { Group, Text, Box, Paper, Select } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { usernameThemes } from "@/app/utils/usernameThemes";

interface UsernameThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

export default function UsernameThemeSelector({
  selectedTheme,
  onThemeChange,
}: UsernameThemeSelectorProps) {
  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group mb="md">
        <IconUser size={20} />
        <Text fw={600}>User Name Theme</Text>
      </Group>

      <Select
        data={usernameThemes.map((t) => ({
          value: t.value,
          label: t.label,
        }))}
        value={selectedTheme}
        onChange={(value) => onThemeChange(value || "default")}
        mb="md"
      />

      <Box
        // style={{
        //   maxHeight: "200px",
        //   overflowY: "auto",
        //   overflowX: "hidden",
        //   paddingRight: "4px",
        // }}
      >
        <Group gap="xs" wrap="wrap">
          {usernameThemes.map((theme) => (
            <Box
              key={theme.value}
              onClick={() => onThemeChange(theme.value)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: theme.bg,
                border:
                  selectedTheme === theme.value
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
      </Box>
    </Paper>
  );
}

