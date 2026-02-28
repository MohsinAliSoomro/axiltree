"use client";
import { motion } from "framer-motion";
import { Box, Paper, Group, Text, Stack, Avatar } from "@mantine/core";
import { IconDeviceMobile } from "@tabler/icons-react";
import { themesArray } from "@/app/utils/theme";
import { usernameThemes } from "@/app/utils/usernameThemes";
import { getAnimationVariants } from "@/app/utils/animations";
import Image from "next/image";
import { Carousel } from "@mantine/carousel";
import { useEffect, useState } from "react";

interface MobilePreviewProps {
  profile: any;
  links: any[];
  selectedTheme: string;
  selectedFont: string;
  selectedAnimation: string;
  selectedUsernameTheme: string;
  selectedLayout: string;
}

const themes = themesArray;

export default function MobilePreview({ 
  profile, 
  links, 
  selectedTheme, 
  selectedFont, 
  selectedAnimation,
  selectedUsernameTheme,
  selectedLayout,
}: MobilePreviewProps) {
  const [carouselApi, setCarouselApi] = useState<any>(null);

  useEffect(() => {
    if (selectedLayout !== "carousel" || !carouselApi || links.length < 2) return;

    const intervalId = setInterval(() => {
      carouselApi.scrollNext();
    }, 2200);

    return () => clearInterval(intervalId);
  }, [selectedLayout, carouselApi, links.length]);

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
          className="hide-scrollbar"
          p="xl"
          style={{
            height: "100%",
            overflowY: "auto",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            color: currentTheme.text,
            fontFamily: `var(--font-${selectedFont || "inter"}), sans-serif`,
          }}
        >
          <Stack align="center" gap="md">
            {profile?.banner_url && profile?.is_banner_show && (
              <Box
                style={{
                  width: "calc(100% + (var(--mantine-spacing-xl) * 2))",
                  height: 160,
                  borderRadius: 0,
                  overflow: "hidden",
                  position: "relative",
                  marginTop: "calc(var(--mantine-spacing-xl) * -1)",
                  marginLeft: "calc(var(--mantine-spacing-xl) * -1)",
                  marginRight: "calc(var(--mantine-spacing-xl) * -1)",
                  backgroundImage: `url(${profile.banner_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Box
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, ${currentTheme.bg} 100%)`,
                  }}
                />
              </Box>
            )}

            <Avatar
              src={profile?.avatar_url}
              size={80}
              radius="50%"
              mt={profile?.banner_url && profile?.is_banner_show ? -46 : 0}
              style={{ zIndex: 2, border: `3px solid ${currentTheme.bg}` }}
            />
            <Stack gap={4} align="center">
              <Text size="xl" fw={700}>
                {profile?.full_name || "Your Name"}
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
              {selectedLayout === "grid" ? (
                <Box
                  style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {links.map((link: any, index: number) => (
                    <PreviewLinkItem
                      key={`${link?.id}-${selectedAnimation}`}
                      link={link}
                      index={index}
                      selectedAnimation={selectedAnimation}
                      currentTheme={currentTheme}
                      compact
                    />
                  ))}
                </Box>
              ) : selectedLayout === "carousel" ? (
                <Carousel
                  withIndicators
                  slideSize="100%"
                  slideGap={0}
                  emblaOptions={{ align: "start", containScroll: "trimSnaps", loop: true }}
                  getEmblaApi={setCarouselApi}
                  styles={{
                    viewport: {
                      paddingRight: 0,
                    },
                    container: {
                      marginRight: 0,
                    },
                    indicator: {
                      backgroundColor: currentTheme.text,
                    },
                  }}
                >
                  {links.map((link: any, index: number) => (
                    <Carousel.Slide key={`${link?.id}-${selectedAnimation}`}>
                      <PreviewLinkItem
                        link={link}
                        index={index}
                        selectedAnimation={selectedAnimation}
                        currentTheme={currentTheme}
                        square
                      />
                    </Carousel.Slide>
                  ))}
                </Carousel>
              ) : (
                <Stack gap="sm" style={{ width: "100%" }}>
                  {links.map((link: any, index: number) => (
                    <PreviewLinkItem
                      key={`${link?.id}-${selectedAnimation}`}
                      link={link}
                      index={index}
                      selectedAnimation={selectedAnimation}
                      currentTheme={currentTheme}
                    />
                  ))}
                </Stack>
              )}
            </Stack>

            {/* Footer Branding */}
            <Box mt="xl" pt="lg" style={{ borderTop: `1px solid ${currentTheme.text}30` }}>
              <Box
                component="a"
                href="https://www.axiltree.tech/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: "none",
                  display: "block",
                  cursor: "pointer",
                }}
              >
                <Group justify="center" gap="xs">
                  <Image 
                    src="/logo.png" 
                    alt="AxilTree Logo" 
                    width={20} 
                    height={20}
                    style={{
                      filter: currentTheme.text === "#ffffff" || currentTheme.text === "white" 
                        ? "brightness(0) invert(1)" 
                        : "none"
                    }}
                  />
                  <Text 
                    size="sm" 
                    fw={600} 
                    opacity={0.7}
                    style={{ color: currentTheme.text }}
                  >
                    AxilTree
                  </Text>
                </Group>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
}

function PreviewLinkItem({
  link,
  index,
  selectedAnimation,
  currentTheme,
  compact = false,
  square = false,
}: {
  link: any;
  index: number;
  selectedAnimation: string;
  currentTheme: any;
  compact?: boolean;
  square?: boolean;
}) {
  const animationVariants = getAnimationVariants(selectedAnimation);
  const staggerDelay = selectedAnimation !== "none" ? index * 0.1 : 0;

  return (
    <motion.div
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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          aspectRatio: square ? "1 / 1" : undefined,
          background: currentTheme.button,
          color: currentTheme.buttonText,
          border: "none",
          padding: compact ? "12px 10px" : "16px 20px",
          borderRadius: square ? "8px" : compact ? "14px" : "50px",
          textAlign: "center",
          fontWeight: 500,
          fontSize: compact ? "13px" : "16px",
          textDecoration: "none",
        }}
      >
        {link?.title}
      </Box>
    </motion.div>
  );
}