"use client";

import { ActionIcon, Anchor, Box, Container, Group, Text } from "@mantine/core";
import { IconBrandInstagram, IconBrandTiktok } from "@tabler/icons-react";
import Link from "next/link";

type SiteFooterProps = {
  brandName?: string;
  copyright?: string;
  links?: Array<{ label: string; href: string }>;
};

export default function SiteFooter({
  brandName = "AxilTree",
  copyright = "© 2024 AxilTree. The Digital Curator.",
  links = [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Support", href: "/" },
  ],
}: SiteFooterProps) {
  return (
    <Box style={{ borderTop: "1px solid #e7e7e7", padding: "18px 0 24px", background: "#f3f3f4" }}>
      <Container size="lg">
        <Group justify="space-between" align="center" wrap="wrap" gap="xs">
          <Box>
            <Text fw={700} c="#171717">
              {brandName}
            </Text>
            <Text size="xs" c="#7a6d6d" mt={4}>
              {copyright}
            </Text>
          </Box>

          <Group gap={18}>
            {links.map((link) => (
              <Anchor
                key={link.label}
                component={Link}
                href={link.href}
                size="xs"
                c="#777"
                style={{ textDecoration: "none" }}
              >
                {link.label}
              </Anchor>
            ))}
          </Group>

          <Group gap={8}>
            <ActionIcon variant="subtle" color="gray" radius="xl" size="sm">
              <IconBrandInstagram size={14} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray" radius="xl" size="sm">
              <IconBrandTiktok size={14} />
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
