"use client";

import { Anchor, Button, Container, Group, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

export type SiteHeaderLink = {
  label: string;
  href: string;
};

type SiteHeaderProps = {
  links: SiteHeaderLink[];
  activeHref?: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
};

export default function SiteHeader({
  links,
  activeHref,
  primaryActionLabel,
  primaryActionHref,
  secondaryActionLabel,
  secondaryActionHref,
}: SiteHeaderProps) {
  return (
    <Container size="lg" py="sm">
      <Group justify="space-between" align="center" wrap="nowrap">
        <Group gap={8} wrap="nowrap">
          <Image src="/logo.png" alt="AxilTree logo" width={24} height={24} />
          <Text fw={700} size="sm" style={{ letterSpacing: "-0.02em" }}>
            AxilTree
          </Text>
        </Group>

        <Group gap={28} visibleFrom="sm">
          {links.map((link) => {
            const isActive = activeHref === link.href;

            return (
              <Anchor
                key={link.href}
                href={link.href}
                component={Link}
                c={isActive ? "#c0184d" : "#3c3c3c"}
                size="sm"
                fw={isActive ? 700 : 400}
                style={{
                  textDecoration: isActive ? "none" : "none",
                  borderBottom: isActive ? "2px solid #c0184d" : "2px solid transparent",
                  paddingBottom: 2,
                }}
              >
                {link.label}
              </Anchor>
            );
          })}
        </Group>

        <Group gap={8} wrap="nowrap">
          {secondaryActionLabel && secondaryActionHref ? (
            <Button
              component={Link}
              href={secondaryActionHref}
              variant="subtle"
              color="dark"
              radius="xl"
              size="compact-sm"
              styles={{ root: { fontWeight: 500 } }}
            >
              {secondaryActionLabel}
            </Button>
          ) : null}
          <Button
            component={Link}
            href={primaryActionHref}
            radius="xl"
            size="compact-sm"
            style={{ background: "#cf1048", color: "white", fontWeight: 600 }}
          >
            {primaryActionLabel}
          </Button>
        </Group>
      </Group>
    </Container>
  );
}
