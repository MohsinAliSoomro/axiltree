"use client";

import { Group, Button, Text, ActionIcon, Tooltip } from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import Image from "next/image";
import { useMediaQuery } from "@mantine/hooks";

interface HeaderProps {
  isAuthenticated: boolean;
  username?: string | null;
}

export default function Header({ isAuthenticated, username }: HeaderProps) {
  const [copied, setCopied] = useState(false);
  const isMobile = useMediaQuery("(max-width: 48em)");
  
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
    <Group justify="space-between" align="center" wrap="nowrap">
      <Group gap="xs">
        <Image src="/logo.png" alt="AxilTree Logo" width={isMobile ? 28 : 32} height={isMobile ? 28 : 32} />
        <Text size={isMobile ? "lg" : "xl"} fw={700} style={{ color: "#262626" }}>
          AxilTree
        </Text>
      </Group>
      
      <Group gap="xs" wrap="nowrap">
        {isAuthenticated && username && (
          <Tooltip label={copied ? "Copied!" : "Copy your profile link"}>
            <ActionIcon
              variant="light"
              size={isMobile ? "md" : "lg"}
              onClick={handleCopyLink}
              color={copied ? "green" : "blue"}
              style={{ minWidth: 44, minHeight: 44 }}
            >
              {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
            </ActionIcon>
          </Tooltip>
        )}
        
        <Button
          variant="gradient"
          color="dark"
          size={isMobile ? "xs" : "sm"}
          component="a"
          href={isAuthenticated ? "/account" : "/login"}
          style={{ minHeight: 40 }}
        >
          {isAuthenticated ? "Account" : "Login"}
        </Button>
      </Group>
    </Group>
  );
}
