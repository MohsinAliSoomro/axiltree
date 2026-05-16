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
import {
  getMusicEmbedUrl,
  getVideoEmbedUrl,
  type ContentBlock,
} from "../utils/contentBlocks";
import { renderLucideIcon } from "../utils/lucideIcons";
import {
  getLinkStyleFromProfile,
  getReadableTextColor,
  type LinkStyleConfig,
} from "../utils/linkStyle";

export default function ProfileView({
  profile,
  links,
  contentBlocks,
  products,
}: {
  profile: any;
  links: any[];
  contentBlocks: ContentBlock[];
  products: any[];
}) {
  const theme =
    themesObject[profile?.theme] ||
    themesObject.default || {
      bg: "#ffffff",
      text: "#000000",
      button: "#000000",
      buttonText: "#ffffff",
    };
  
  // Get username theme
  const currentUsernameTheme =
    usernameThemes.find((t) => t.value === profile?.username_theme) || usernameThemes[0];
  
  // Get animation variants
  const animationVariants = getAnimationVariants(profile?.animation || "none");
  const selectedLayout = profile?.layout || "stack";
  const linkStyle = getLinkStyleFromProfile(profile);
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

  const linkBg = linkStyle.linkColor || theme.button;
  const linkText = linkStyle.linkColor
    ? getReadableTextColor(linkBg)
    : theme.buttonText;
  return (
    <Box
      className="hide-scrollbar"
      style={{
        height: "100vh",
        overflowY: "auto",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
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
                    linkStyle={linkStyle}
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
                      linkStyle={linkStyle}
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
                    linkStyle={linkStyle}
                    onTrack={handleClick}
                  />
                ))}
              </Stack>
            )}
          </Box>

          {contentBlocks?.length > 0 && (
            <Stack gap="md" style={{ width: "100%" }} mt="md">
              {contentBlocks.map((block: ContentBlock, index: number) => (
                <ProfileContentBlockItem
                  key={block.id}
                  block={block}
                  index={index}
                  animationVariants={animationVariants}
                  hasAnimation={profile?.animation !== "none"}
                  buttonBg={theme.button}
                  buttonText={theme.buttonText}
                />
              ))}
            </Stack>
          )}

          {products?.length > 0 && (
            <Stack gap="sm" style={{ width: "100%" }} mt="md">
              <Text size="sm" fw={700} opacity={0.85}>
                Products
              </Text>
              <Stack gap="xs" style={{ width: "100%" }}>
                {products.map((product: any, index: number) => (
                  <ProfileProductItem
                    key={product.id}
                    product={product}
                    index={index}
                    animationVariants={animationVariants}
                    hasAnimation={profile?.animation !== "none"}
                    buttonBg={theme.button}
                    buttonText={theme.buttonText}
                  />
                ))}
              </Stack>
            </Stack>
          )}
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

function ProfileProductItem({
  product,
  index,
  animationVariants,
  hasAnimation,
  buttonBg,
  buttonText,
}: {
  product: any;
  index: number;
  animationVariants: any;
  hasAnimation: boolean;
  buttonBg: string;
  buttonText: string;
}) {
  const staggerDelay = hasAnimation ? 0.6 + index * 0.1 : 0;

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
        href={product.buy_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "100%",
          padding: "12px",
          textDecoration: "none",
          color: buttonText,
          background: buttonBg,
          borderRadius: 14,
        }}
      >
        {product.image_url ? (
          <Box
            component="img"
            src={product.image_url}
            alt={product.title}
            style={{
              width: 54,
              height: 54,
              objectFit: "cover",
              borderRadius: 10,
              flexShrink: 0,
            }}
          />
        ) : (
          <Box
            style={{
              width: 54,
              height: 54,
              borderRadius: 10,
              background: "rgba(255,255,255,0.2)",
              flexShrink: 0,
            }}
          />
        )}
        <Box style={{ minWidth: 0, flex: 1 }}>
          <Text fw={600} size="sm" truncate="end">
            {product.title}
          </Text>
          {product.price !== null && product.price !== undefined && (
            <Text size="xs" opacity={0.85}>
              ${Number(product.price).toFixed(2)}
            </Text>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}

function ProfileContentBlockItem({
  block,
  index,
  animationVariants,
  hasAnimation,
  buttonBg,
  buttonText,
}: {
  block: ContentBlock;
  index: number;
  animationVariants: any;
  hasAnimation: boolean;
  buttonBg: string;
  buttonText: string;
}) {
  const staggerDelay = hasAnimation ? 0.4 + index * 0.1 : 0;

  if (block.type === "text") {
    return (
      <motion.div
        initial={animationVariants.initial}
        animate={animationVariants.animate}
        transition={{
          ...animationVariants.transition,
          delay: staggerDelay,
        }}
      >
        <Box
          style={{
            width: "100%",
            background: `${buttonBg}20`,
            borderRadius: 14,
            padding: "14px 16px",
          }}
        >
          {block.title && (
            <Text size="sm" fw={700} mb={6}>
              {block.title}
            </Text>
          )}
          <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
            {block.content_json?.text || ""}
          </Text>
        </Box>
      </motion.div>
    );
  }

  if (block.type === "gallery") {
    const images = block.content_json?.images || [];
    return (
      <motion.div
        initial={animationVariants.initial}
        animate={animationVariants.animate}
        transition={{
          ...animationVariants.transition,
          delay: staggerDelay,
        }}
      >
        <Stack gap="xs">
          {block.title && (
            <Text size="sm" fw={700}>
              {block.title}
            </Text>
          )}
          <Box
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 10,
            }}
          >
            {images.map((imageUrl, imageIndex) => (
              <Box
                key={`${block.id}-${imageIndex}`}
                component="img"
                src={imageUrl}
                alt={block.title || "Gallery image"}
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
            ))}
          </Box>
        </Stack>
      </motion.div>
    );
  }

  const fallbackUrl = block.content_json?.url || "";
  const embedUrl =
    block.content_json?.embedUrl ||
    (block.type === "video"
      ? getVideoEmbedUrl(fallbackUrl)
      : getMusicEmbedUrl(fallbackUrl));

  return (
    <motion.div
      initial={animationVariants.initial}
      animate={animationVariants.animate}
      transition={{
        ...animationVariants.transition,
        delay: staggerDelay,
      }}
    >
      <Stack gap="xs">
        {block.title && (
          <Text size="sm" fw={700}>
            {block.title}
          </Text>
        )}
        {embedUrl ? (
          <Box
            component="iframe"
            src={embedUrl}
            title={block.title || `${block.type} embed`}
            style={{
              width: "100%",
              height: block.type === "video" ? 260 : 160,
              border: "none",
              borderRadius: 12,
              background: buttonBg,
            }}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Box
            component="a"
            href={fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: buttonBg,
              color: buttonText,
              borderRadius: 12,
              padding: "12px 14px",
              textDecoration: "none",
              display: "inline-block",
              fontWeight: 600,
            }}
          >
            Open {block.type}
          </Box>
        )}
      </Stack>
    </motion.div>
  );
}

function ProfileLinkItem({
  link,
  index,
  animationVariants,
  hasAnimation,
  buttonBg,
  buttonText,
  linkStyle,
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
  linkStyle: LinkStyleConfig;
  onTrack: (link: any) => void;
  compact?: boolean;
  square?: boolean;
}) {
  const staggerDelay = hasAnimation ? 0.4 + index * 0.1 : 0;
  const fontSize = compact ? Math.max(12, linkStyle.fontSize - 1) : linkStyle.fontSize;
  const borderRadius = square
    ? `${Math.max(6, Math.min(linkStyle.borderRadius, 24))}px`
    : `${linkStyle.borderRadius}px`;
  const minHeight = compact
    ? Math.max(40, linkStyle.height - 8)
    : linkStyle.height;
  const borderColor = linkStyle.borderWidth > 0 ? linkStyle.borderColor : "transparent";
  const linkBg = linkStyle.linkColor || buttonBg;
  const linkText = linkStyle.linkColor
    ? getReadableTextColor(linkBg)
    : buttonText;

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
          background: linkBg,
          color: linkText,
          border: `${linkStyle.borderWidth}px solid ${borderColor}`,
          boxShadow: linkStyle.shadow ? "0 10px 24px rgba(0, 0, 0, 0.18)" : "none",
          padding: `0 ${Math.max(8, linkStyle.horizontalPadding)}px`,
          minHeight,
          borderRadius,
          textAlign: "center",
          fontWeight: linkStyle.fontWeight,
          fontSize,
          textDecoration: "none",
          cursor: "pointer",
          transition: "transform 0.2s",
          gap: 10,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = "scale(1)";
        }}
      >
        <Box style={{ width: 20, display: "flex", justifyContent: "flex-start", flexShrink: 0 }}>
          {link?.left_icon_name ? renderLucideIcon(link.left_icon_name, 16) : null}
        </Box>
        <Box style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
          <span>{link.title}</span>
        </Box>
        <Box style={{ width: 20, display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
          {link?.right_icon_name ? renderLucideIcon(link.right_icon_name, 16) : null}
        </Box>
      </Box>
    </motion.div>
  );
}
