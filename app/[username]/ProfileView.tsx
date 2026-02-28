"use client";
import { Container, Stack, Avatar, Text, Box, Group } from "@mantine/core";
import { motion } from "framer-motion";
import { themesObject } from "../utils/theme";
import { usernameThemes } from "../utils/usernameThemes";
import { getAnimationVariants } from "../utils/animations";
import { createClient } from "../lib/supabase/client";
import { fetchLocation } from "../utils/location";
import Image from "next/image";
import { Carousel } from "@mantine/carousel";
import { useEffect, useState } from "react";

export default function ProfileView({
  profile,
  links,
}: {
  profile: any;
  links: any[];
}) {
  //@ts-ignore
  const theme = themesObject[profile?.theme] || themesObject.default;
  
  // Get username theme
  const currentUsernameTheme =
    usernameThemes.find((t) => t.value === profile?.username_theme) || usernameThemes[0];
  
  // Get animation variants
  const animationVariants = getAnimationVariants(profile?.animation || "none");
  const selectedLayout = profile?.layout || "stack";
  const [carouselApi, setCarouselApi] = useState<any>(null);

  useEffect(() => {
    if (selectedLayout !== "carousel" || !carouselApi || (links?.length || 0) < 2)
      return;

    const intervalId = setInterval(() => {
      carouselApi.scrollNext();
    }, 2200);

    return () => clearInterval(intervalId);
  }, [selectedLayout, carouselApi, links?.length]);
  
  const client = createClient();
  const handleClick = async (link: any) => {
    try {
      const location = await fetchLocation();
      await client.from("analytics").insert({
        link_id: link.id,
        action: "click",
        country: location?.location?.country?.name,
        ipAddress: location?.ip || "",
      });
    } catch (error) {
      console.error("Failed to open link:", error);
    }
  };
  return (
    <Box
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        fontFamily: `var(--font-${profile?.font || "inter"}), sans-serif`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box style={{ flex: 1, padding: "40px 20px" }}>
        <Container size="xs">
          <Stack align="center" gap="md">
            {profile?.banner_url && profile?.is_banner_show && (
              <Box
                style={{
                  width: "calc(100% + 40px)",
                  height: 220,
                  borderRadius: 0,
                  overflow: "hidden",
                  position: "relative",
                  marginTop: -40,
                  marginLeft: -20,
                  marginRight: -20,
                  backgroundImage: `url(${profile.banner_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <Box
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, ${theme.bg} 100%)`,
                  }}
                />
              </Box>
            )}

            <motion.div
            initial={animationVariants.initial}
            animate={animationVariants.animate}
            transition={{
              ...animationVariants.transition,
              delay: 0,
            }}
          >
            <Avatar
              src={profile?.avatar_url}
              size={100}
              radius="50%"
              mt={profile?.banner_url && profile?.is_banner_show ? -64 : 0}
              style={{ zIndex: 2, border: `4px solid ${theme.bg}` }}
            />
          </motion.div>
          
          <Stack gap={8} align="center">
            <motion.div
              initial={animationVariants.initial}
              animate={animationVariants.animate}
              transition={{
                ...animationVariants.transition,
                delay: profile?.animation !== "none" ? 0.1 : 0,
              }}
            >
              <Text size="xl" fw={700}>
                {profile?.full_name || "Name"}
              </Text>
            </motion.div>
            
            <motion.div
              initial={animationVariants.initial}
              animate={animationVariants.animate}
              transition={{
                ...animationVariants.transition,
                delay: profile?.animation !== "none" ? 0.2 : 0,
              }}
            >
              <Text
                size="md"
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
            </motion.div>
            
            <motion.div
              initial={animationVariants.initial}
              animate={animationVariants.animate}
              transition={{
                ...animationVariants.transition,
                delay: profile?.animation !== "none" ? 0.3 : 0,
              }}
            >
              <Text size="sm" ta="center" opacity={0.9} maw={400}>
                {profile?.bio || ""}
              </Text>
            </motion.div>
          </Stack>

          <Box style={{ width: "100%" }} mt="lg">
            {selectedLayout === "grid" ? (
              <Box
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 12,
                }}
              >
                {links?.map((link: any, index: number) => (
                  <ProfileLinkItem
                    key={link.id}
                    link={link}
                    index={index}
                    animationVariants={animationVariants}
                    hasAnimation={profile?.animation !== "none"}
                    buttonBg={theme.button}
                    buttonText={theme.buttonText}
                    onTrack={handleClick}
                    compact
                  />
                ))}
              </Box>
            ) : selectedLayout === "carousel" ? (
              <Carousel
                withIndicators
                slideSize="100%"
                slideGap={0}
                align="start"
                loop
                containScroll="trimSnaps"
                getEmblaApi={setCarouselApi}
                styles={{
                  viewport: {
                    paddingRight: 0,
                  },
                  container: {
                    marginRight: 0,
                  },
                  indicator: {
                    backgroundColor: theme.text,
                  },
                }}
              >
                {links?.map((link: any, index: number) => (
                  <Carousel.Slide key={link.id}>
                    <ProfileLinkItem
                      link={link}
                      index={index}
                      animationVariants={animationVariants}
                      hasAnimation={profile?.animation !== "none"}
                      buttonBg={theme.button}
                      buttonText={theme.buttonText}
                      onTrack={handleClick}
                      square
                    />
                  </Carousel.Slide>
                ))}
              </Carousel>
            ) : (
              <Stack gap="md" style={{ width: "100%" }}>
                {links?.map((link: any, index: number) => (
                  <ProfileLinkItem
                    key={link.id}
                    link={link}
                    index={index}
                    animationVariants={animationVariants}
                    hasAnimation={profile?.animation !== "none"}
                    buttonBg={theme.button}
                    buttonText={theme.buttonText}
                    onTrack={handleClick}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </Container>
      </Box>

      {/* Footer Branding */}
      <Box 
        py="lg" 
        style={{ 
          borderTop: `1px solid ${theme.text}30`,
          background: theme.bg,
        }}
      >
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
              width={24} 
              height={24}
              style={{
                filter: theme.text === "#ffffff" || theme.text === "white" 
                  ? "brightness(0) invert(1)" 
                  : "none"
              }}
            />
            <Text 
              size="sm" 
              fw={600} 
              opacity={0.7}
              style={{ color: theme.text }}
            >
              AxilTree
            </Text>
          </Group>
        </Box>
      </Box>
    </Box>
  );
}

function ProfileLinkItem({
  link,
  index,
  animationVariants,
  hasAnimation,
  buttonBg,
  buttonText,
  onTrack,
  compact = false,
  square = false,
}: {
  link: any;
  index: number;
  animationVariants: any;
  hasAnimation: boolean;
  buttonBg: string;
  buttonText: string;
  onTrack: (link: any) => void;
  compact?: boolean;
  square?: boolean;
}) {
  const staggerDelay = hasAnimation ? 0.4 + index * 0.1 : 0;

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
        href={link.url}
        onClick={() => onTrack(link)}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          aspectRatio: square ? "1 / 1" : undefined,
          background: buttonBg,
          color: buttonText,
          border: "none",
          padding: compact ? "13px 10px" : "16px 20px",
          borderRadius: square ? "8px" : compact ? "14px" : "50px",
          textAlign: "center",
          fontWeight: 500,
          fontSize: compact ? "14px" : "16px",
          textDecoration: "none",
          cursor: "pointer",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        }}
      >
        {link.title}
      </Box>
    </motion.div>
  );
}
