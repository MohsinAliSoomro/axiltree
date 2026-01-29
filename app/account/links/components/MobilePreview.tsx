"use client";
import { motion } from "framer-motion";
import { Box, Paper, Group, Text, Stack, Avatar } from "@mantine/core";
import { IconDeviceMobile } from "@tabler/icons-react";
import { themesArray } from "@/app/utils/theme";
import { usernameThemes } from "@/app/utils/usernameThemes";
import { getAnimationVariants } from "@/app/utils/animations";

interface MobilePreviewProps {
  profile: any;
  links: any[];
  selectedTheme: string;
  selectedFont: string;
  selectedAnimation: string;
  selectedUsernameTheme: string;
}

const themes = themesArray;

export default function MobilePreview({ 
  profile, 
  links, 
  selectedTheme, 
  selectedFont, 
  selectedAnimation,
  selectedUsernameTheme
}: MobilePreviewProps) {
  const currentTheme =
    themes.find((t) => t.value === selectedTheme) || themes[0];

  const currentUsernameTheme =
    usernameThemes.find((t) => t.value === selectedUsernameTheme) || usernameThemes[0];

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group mb="md">
        <IconDeviceMobile size={20} />
        <Text fw={600}>Live Preview</Text>
      </Group>

      {/* Mobile Frame */}
      <Box
        style={{
          width: "100%",
          maxWidth: 375,
          height: 667,
          margin: "0 auto",
          border: "16px solid #000",
          borderRadius: 36,
          overflow: "hidden",
          background: currentTheme.bg,
        }}
      >
        <Box
          p="xl"
          style={{
            height: "100%",
            overflowY: "auto",
            color: currentTheme.text,
          }}
        >
          <Stack align="center" gap="md">
            <Avatar src={profile?.avatar_url} size={80} radius="xl" />
            <Stack gap={4} align="center">
              <Text size="xl" fw={700}>
                {profile?.display_name || "Your Name"}
              </Text>
              <Text
                size="sm"
                opacity={0.8}
                style={{
                  background: currentUsernameTheme.color.includes("gradient")
                    ? currentUsernameTheme.color
                    : undefined,
                  color: currentUsernameTheme.color.includes("gradient")
                    ? "transparent"
                    : currentUsernameTheme.color,
                  WebkitBackgroundClip: currentUsernameTheme.color.includes("gradient")
                    ? "text"
                    : undefined,
                  WebkitTextFillColor: currentUsernameTheme.color.includes("gradient")
                    ? "transparent"
                    : undefined,
                  backgroundClip: currentUsernameTheme.color.includes("gradient")
                    ? "text"
                    : undefined,
                }}
              >
                @{profile?.username || "username"}
              </Text>
              <Text size="sm" ta="center" opacity={0.9}>
                {profile?.bio || "Your bio goes here"}
              </Text>
            </Stack>

            <Stack gap="sm" style={{ width: "100%" }} mt="md">
              {links.map((link: any, index: number) => {
                const animationVariants = getAnimationVariants(selectedAnimation);
                // Add stagger delay for links
                const staggerDelay = selectedAnimation !== "none" ? index * 0.1 : 0;

                return (
                  <motion.div
                    key={`${link?.id}-${selectedAnimation}`}
                    initial={animationVariants.initial}
                    animate={animationVariants.animate}
                    transition={{
                      ...animationVariants.transition,
                      delay: staggerDelay,
                    }}
                    style={{ width: "100%" }}
                  >
                    <Box
                      component="a"
                      href={link?.url}
                      target="_blank"
                      style={{
                        display: "block",
                        width: "100%",
                        background: currentTheme.button,
                        color: currentTheme.buttonText,
                        border: "none",
                        padding: "16px 20px",
                        borderRadius: "50px",
                        textAlign: "center",
                        fontWeight: 500,
                        fontSize: "16px",
                        textDecoration: "none",
                      }}
                    >
                      {link?.title}
                    </Box>
                  </motion.div>
                );
              })}
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
}