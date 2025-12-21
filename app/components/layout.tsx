"use client";

import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Title,
  Box,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Home, User, Settings, LogOut } from "lucide-react";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      {/* 🔥 HEADER */}
      <AppShell.Header
        style={{
          background:
            "linear-gradient(45deg, var(--mantine-color-grape-5), var(--mantine-color-red-4))",
        }}
      >
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              color="white"
            />
            <Title order={4} c="white">
              My App
            </Title>
          </Group>
        </Group>
      </AppShell.Header>

      {/* 📚 NAVBAR */}
      <AppShell.Navbar p="md">
        <NavLink label="Dashboard" leftSection={<Home size={18} />} />
        <NavLink label="Profile" leftSection={<User size={18} />} />
        <NavLink label="Settings" leftSection={<Settings size={18} />} />
        <form action="/auth/signout" method="post">
          <Button
            type="submit"
            variant="gradient"
            leftSection={<LogOut size={18} />}
          >
            Sign Out
          </Button>
        </form>
      </AppShell.Navbar>

      {/* 📄 MAIN */}
      <AppShell.Main>
        <Box>{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
}
