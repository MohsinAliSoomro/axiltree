"use client";
import { Box, Paper, Group, Text } from "@mantine/core";
import { IconFileTypography } from "@tabler/icons-react";

interface FontSelectorProps {
  selectedFont: string;
  updateFont: (font: string) => void;
}

export const fontOptions = [
  { value: "inter", label: "Inter (Clean & Modern)", css: "var(--font-inter)" },
  { value: "poppins", label: "Poppins (Stylish)", css: "var(--font-poppins)" },
  { value: "space", label: "Space Mono (Techy)", css: "var(--font-space)" },
  { value: "quicksand", label: "Quicksand (Friendly)", css: "var(--font-quicksand)" },
  { value: "amarna", label: "Amarna (Elegant)", css: "var(--font-amarna)" },
  { value: "delius", label: "Delius (Handwritten)", css: "var(--font-delius)" },
  { value: "borel", label: "Borel (Playful)", css: "var(--font-borel)" },
  { value: "iceland", label: "Iceland (Futuristic)", css: "var(--font-iceland)" },
];

const BOX_BG_COLORS = [
  "#e8f4fd", "#f3e8fd", "#e8fdf5", "#fff4e6", "#fef9e8", "#fce8f0", "#e6f2ff", "#f0e8fd",
];

function getShortName(label: string) {
  return label.split(" (")[0] ?? label;
}

export default function FontSelector({ selectedFont, updateFont }: FontSelectorProps) {
  return (
    <Paper shadow="sm" p="md" withBorder radius="md" mt="sm">
      <Group mb="md" gap="xs">
        <IconFileTypography size={20} stroke={1.5} />
        <Text fw={600} size="sm">Font</Text>
      </Group>

      <Box
        className="font-selector-grid"
        style={{ padding: 4 }}
      >
        <style>{`
          .font-selector-grid .font-box {
            transition: transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease, border-color 0.12s ease;
          }
          .font-selector-grid .font-box:hover {
            transform: scale(1.02);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            filter: brightness(1.03);
            border-color: #ced4da !important;
          }
          .font-selector-grid .font-box:active {
            transform: scale(0.98);
          }
        `}</style>
        <Group gap={8} wrap="wrap">
          {fontOptions.map((font, index) => {
            const isSelected = selectedFont === font.value;
            const boxBg = BOX_BG_COLORS[index % BOX_BG_COLORS.length];
            const shortName = getShortName(font.label);
            return (
              <Box
                key={font.value}
                className="font-box"
                onClick={() => updateFont(font.value)}
                style={{
                  minWidth: 100,
                  height: 44,
                  paddingLeft: 12,
                  paddingRight: 12,
                  borderRadius: 10,
                  background: isSelected ? "#e7f5ff" : boxBg,
                  border: isSelected ? "2px solid #228be6" : "1px solid rgba(0,0,0,0.06)",
                  boxShadow: isSelected ? "0 1px 4px rgba(34, 139, 230, 0.25)" : "0 1px 2px rgba(0,0,0,0.04)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
                title={font.label}
              >
                <Text
                  size="xs"
                  fw={600}
                  ta="center"
                  lineClamp={1}
                  style={{
                    fontFamily: font.css,
                  }}
                >
                  {shortName}
                </Text>
              </Box>
            );
          })}
        </Group>
      </Box>
    </Paper>
  );
}