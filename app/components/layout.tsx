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
              AxilTree
            </Title>
          </Group>
        </Group>
      </AppShell.Header>

      {/* 📚 NAVBAR */}
      <AppShell.Navbar p="md">
        <NavLink
          label="Profile"
          leftSection={<Home size={18} />}
          href="/account"
        />
        <NavLink
          label="Username"
          leftSection={<Home size={18} />}
          href="/account/username"
        />
        <NavLink
          label="Links"
          leftSection={<User size={18} />}
          href="/account/links"
        />
          <NavLink
          label="Analytics"
          leftSection={<User size={18} />}
          href="/account/analytics"
        />
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
