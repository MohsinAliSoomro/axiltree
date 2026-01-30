"use client";
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Title,
  Box,
  Button,
  ActionIcon,
  Tooltip,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Home, User, Settings, LogOut } from "lucide-react";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase/client";
import Image from "next/image";

export default function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const [username, setUsername] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUsername = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();
        setUsername(profile?.username || null);
      }
    };
    fetchUsername();
  }, []);

  const handleCopyLink = () => {
    if (!username) return;

    const profileUrl = `https://www.axiltree.tech/${username}`;
    navigator.clipboard.writeText(profileUrl);

    setCopied(true);
    notifications.show({
      title: "Link copied!",
      message: "Your profile link has been copied to clipboard.",
      color: "green",
      icon: <IconCheck size={18} />,
    });

    setTimeout(() => setCopied(false), 2000);
  };

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
          <Group gap="xs">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              color="white"
            />
            <Image
              src="/logo.png"
              alt="AxilTree Logo"
              width={32}
              height={32}
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <Title order={4} c="white">
              AxilTree
            </Title>
          </Group>

          {username && (
            <Tooltip label={copied ? "Copied!" : "Copy your profile link"}>
              <ActionIcon
                variant="white"
                size="lg"
                onClick={handleCopyLink}
                color={copied ? "green" : "grape"}
              >
                {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
              </ActionIcon>
            </Tooltip>
          )}
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
