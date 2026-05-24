"use client";

import {
  Box,
  Button,
  ColorInput,
  Group,
  Paper,
  Slider,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { IconBrush } from "@tabler/icons-react";
import {
  defaultLinkStyle,
  type LinkStyleConfig,
} from "@/app/utils/linkStyle";

interface LinkStyleSelectorProps {
  linkStyle: LinkStyleConfig;
  updateStyleField: (field: string, value: string | number | boolean) => void;
}

type StyleField = {
  key: keyof LinkStyleConfig;
  label: string;
  min: number;
  max: number;
  step: number;
};

const styleFields: StyleField[] = [
  { key: "height", label: "Link Height", min: 36, max: 96, step: 2 },
  { key: "borderRadius", label: "Border Radius", min: 0, max: 60, step: 1 },
  { key: "fontSize", label: "Font Size", min: 12, max: 24, step: 1 },
  { key: "fontWeight", label: "Font Weight", min: 400, max: 800, step: 100 },
  {
    key: "horizontalPadding",
    label: "Horizontal Padding",
    min: 8,
    max: 36,
    step: 1,
  },
  { key: "borderWidth", label: "Border Width", min: 0, max: 6, step: 1 },
];

const profileFieldMap: Record<keyof LinkStyleConfig, string> = {
  height: "link_height",
  borderRadius: "link_border_radius",
  fontSize: "link_font_size",
  fontWeight: "link_font_weight",
  horizontalPadding: "link_horizontal_padding",
  borderWidth: "link_border_width",
  linkColor: "link_color",
  borderColor: "link_border_color",
  shadow: "link_shadow",
};

export default function LinkStyleSelector({
  linkStyle,
  updateStyleField,
}: LinkStyleSelectorProps) {
  const visibleBorderColor =
    linkStyle.borderColor && linkStyle.borderColor !== "transparent"
      ? linkStyle.borderColor
      : "#d1d5db";

  return (
    <Paper shadow="sm" p="md" withBorder>
      {/* <Group mb="md">
        <IconBrush size={20} />
        <Text fw={600}>Link Style</Text>
      </Group> */}

      <Stack gap="md">
        {styleFields.map((field) => (
          <Box key={field.key}>
            <Group justify="space-between" mb={4}>
              <Text size="sm" fw={500}>
                {field.label}
              </Text>
              <Text size="sm" c="dimmed">
                {linkStyle[field.key]}
              </Text>
            </Group>
            <Slider
              min={field.min}
              max={field.max}
              step={field.step}
              value={Number(linkStyle[field.key] as any) || 0}
              onChange={(value) =>
                updateStyleField(profileFieldMap[field.key as keyof LinkStyleConfig],
                  Number(value)
                )
              }
            />
          </Box>
        ))}

        <ColorInput
          label="Link Color"
          value={linkStyle.linkColor || "#000000"}
          onChange={(value) => updateStyleField("link_color", value)}
          popoverProps={{ withinPortal: true }}
        />

        <ColorInput
          label="Border Color"
          value={visibleBorderColor}
          onChange={(value) => updateStyleField("link_border_color", value)}
          popoverProps={{ withinPortal: true }}
        />

        <Switch
          label="Shadow"
          checked={linkStyle.shadow}
          onChange={(event) =>
            updateStyleField("link_shadow", event.currentTarget.checked)
          }
        />

        <Box style={{ marginTop: 6, zIndex: 2 }}>
          <Button
            fullWidth
            size="sm"
            color="grape"
            variant="filled"
            onClick={() => {
              updateStyleField("link_height", defaultLinkStyle.height);
              updateStyleField("link_border_radius", defaultLinkStyle.borderRadius);
              updateStyleField("link_font_size", defaultLinkStyle.fontSize);
              updateStyleField("link_font_weight", defaultLinkStyle.fontWeight);
              updateStyleField(
                "link_horizontal_padding",
                defaultLinkStyle.horizontalPadding
              );
              updateStyleField("link_color", defaultLinkStyle.linkColor);
              updateStyleField("link_border_width", defaultLinkStyle.borderWidth);
              updateStyleField("link_border_color", defaultLinkStyle.borderColor);
              updateStyleField("link_shadow", defaultLinkStyle.shadow);
            }}
          >
            Reset Link Style
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
