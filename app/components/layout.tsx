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
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, User, Settings, LogOut } from "lucide-react";
import { IconCopy, IconCheck, IconLink } from "@tabler/icons-react";
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
  const pathname = usePathname();

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

  const navItemStyle = (isActive: boolean) => ({
    borderRadius: 10,
    marginBottom: 6,
    padding: "8px 12px",
    background: isActive
      ? "linear-gradient(90deg, rgba(162,11,40,0.95) 0%, rgba(191,15,55,0.95) 52%)"
      : "transparent",
    color: isActive ? "white" : undefined,
    boxShadow: isActive ? "0 6px 18px rgba(162,11,40,0.08)" : undefined,
  });

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={{
        main: {
          background: "#f5f1ef",
          minHeight: "100vh",
        },
      }}
    >
      {/* 🔥 HEADER */}
      <AppShell.Header
        style={{
          background:
            "linear-gradient(90deg, #a20b28 0%, #bf0f37 52%, #a50c2d 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 10px 30px rgba(43, 18, 26, 0.12)",
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
      <AppShell.Navbar
        p="md"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(18px)",
          borderRight: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        <Box pb="sm" mb="sm" style={{ borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
          <Group style={{ justifyContent: "space-between", alignItems: "center" }}>
            <Group>
              <Image src="/logo.png" alt="logo" width={28} height={28} />
              <Box>
                <Text fw={700}>{username || "Profile"}</Text>
                <Text size="xs" c="dimmed">Manage your account</Text>
              </Box>
            </Group>
            {username && (
              <Tooltip label={copied ? "Copied!" : "Copy link"}>
                <ActionIcon onClick={handleCopyLink} color={copied ? "green" : "grape"}>
                  {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Box>

        <NavLink
          component={Link}
          href="/account"
          label="Profile"
          leftSection={<Home size={18} />}
          active={Boolean(pathname && pathname === "/account")}
          style={navItemStyle(Boolean(pathname && pathname === "/account"))}
        />

        <NavLink
          component={Link}
          href="/account/username"
          label="Username"
          leftSection={<User size={18} />}
          active={Boolean(pathname && pathname.startsWith("/account/username"))}
          style={navItemStyle(Boolean(pathname && pathname.startsWith("/account/username")))}
        />

        <NavLink
          component={Link}
          href="/account/links"
          label="Links"
          leftSection={<IconLink size={18} />}
          active={Boolean(pathname && pathname.startsWith("/account/links"))}
          style={navItemStyle(Boolean(pathname && pathname.startsWith("/account/links")))}
        />

        <NavLink
          component={Link}
          href="/account/analytics"
          label="Analytics"
          leftSection={<Home size={18} />}
          active={Boolean(pathname && pathname.startsWith("/account/analytics"))}
          style={navItemStyle(Boolean(pathname && pathname.startsWith("/account/analytics")))}
        />

        <NavLink
          component={Link}
          href="#"
          label="Settings"
          leftSection={<Settings size={18} />}
          style={navItemStyle(false)}
        />

        <form action="/auth/signout" method="post">
          <Button
            type="submit"
            variant="gradient"
            gradient={{ from: "#a20b28", to: "#bf0f37", deg: 90 }}
            leftSection={<LogOut size={18} color="white" />}
            fullWidth
            style={{ marginTop: 8 }}
          >
            Sign Out
          </Button>
        </form>
      </AppShell.Navbar>

      {/* 📄 MAIN */}
      <AppShell.Main style={{ paddingTop: 72 }}>
        <Box>{children}</Box>
      </AppShell.Main>
    </AppShell>
  );
}
