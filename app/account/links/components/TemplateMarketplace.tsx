"use client";

import {
  Badge,
  Box,
  Button,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { profileTemplates, type ProfileTemplate } from "@/app/utils/templates";
import { themesArray } from "@/app/utils/theme";

interface TemplateMarketplaceProps {
  onApplyTemplate: (template: ProfileTemplate) => void;
}

export default function TemplateMarketplace({
  onApplyTemplate,
}: TemplateMarketplaceProps) {
  return (
    <Paper shadow="sm" p="md" withBorder mb="sm">
      <Group justify="space-between" mb="md">
        <Title order={5}>Template Marketplace (Test)</Title>
        <Badge variant="light">{profileTemplates.length} Templates</Badge>
      </Group>

      <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} spacing="sm">
        {profileTemplates.map((template) => (
          <Paper key={template.id} p="sm" withBorder radius="md">
            <Stack gap="xs">
              {(() => {
                const matchedTheme =
                  themesArray.find((theme) => theme.value === template.theme) ||
                  themesArray[0];

                return (
                  <Box
                    style={{
                      width: "100%",
                      height: 56,
                      borderRadius: 10,
                      background: matchedTheme.bg,
                      border: "1px solid #dee2e6",
                      padding: 8,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      style={{
                        width: "65%",
                        height: 5,
                        borderRadius: 999,
                        background: matchedTheme.text,
                        opacity: 0.75,
                      }}
                    />
                    <Box
                      style={{
                        width: "100%",
                        height: 12,
                        borderRadius: 999,
                        background: matchedTheme.button,
                      }}
                    />
                  </Box>
                );
              })()}

              <Stack gap={2} style={{ minWidth: 0 }}>
                <Text fw={600} size="sm" lineClamp={1}>
                  {template.name}
                </Text>
                <Text size="xs" c="dimmed" lineClamp={2}>
                  {template.description}
                </Text>
              </Stack>

              <Group gap={4}>
                <Badge size="xs" variant="outline">
                  {template.theme}
                </Badge>
                <Badge size="xs" variant="outline">
                  {template.font}
                </Badge>
                <Badge size="xs" variant="outline">
                  {template.animation}
                </Badge>
              </Group>

              <Button size="xs" variant="light" fullWidth onClick={() => onApplyTemplate(template)}>
                Apply
              </Button>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Paper>
  );
}