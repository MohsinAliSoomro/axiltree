"use client";
import { motion } from "framer-motion";
import { Box, Paper, Group, Text, Stack, Avatar } from "@mantine/core";
import { IconDeviceMobile } from "@tabler/icons-react";
import { getThemeAccentColor, getThemeConfig, themesArray } from "@/app/utils/theme";
import { getUsernameThemeConfig } from "@/app/utils/usernameThemes";
import {
  getAvatarAlignItems,
  getAvatarAlignment,
  getAvatarSize,
  getAvatarTextAlign,
} from "@/app/utils/avatarLayout";
import { getAnimationVariants } from "@/app/utils/animations";
import Image from "next/image";
import { Carousel } from "@mantine/carousel";
import { useEffect, useState } from "react";
import { isLinkVisibleNow } from "@/app/utils/linkSchedule";
import {
  getMusicEmbedUrl,
  getVideoEmbedUrl,
  type ContentBlock,
} from "@/app/utils/contentBlocks";
import { renderLucideIcon } from "@/app/utils/lucideIcons";
import {
  getReadableTextColor,
  type LinkStyleConfig,
} from "@/app/utils/linkStyle";

interface MobilePreviewProps {
  profile: any;
  links: any[];
  contentBlocks: ContentBlock[];
  products: any[];
  linkStyle: LinkStyleConfig;
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
  contentBlocks,
  products,
  linkStyle,
  selectedTheme, 
  selectedFont, 
  selectedAnimation,
  selectedUsernameTheme,
  selectedLayout,
}: MobilePreviewProps) {
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const displayLinks = links.filter((link) => isLinkVisibleNow(link));
  const displayBlocks = contentBlocks.filter((block) => isLinkVisibleNow(block));
  const displayProducts = products.filter((product) => isLinkVisibleNow(product));

  useEffect(() => {
    if (selectedLayout !== "carousel" || !carouselApi || displayLinks.length < 2) return;

    const intervalId = setInterval(() => {
      carouselApi.scrollNext();
    }, 2200);

    return () => clearInterval(intervalId);
  }, [selectedLayout, carouselApi, displayLinks.length]);

  const currentTheme = getThemeConfig(selectedTheme);
  const themeAccentColor = getThemeAccentColor(currentTheme.bg);

  const currentUsernameTheme = getUsernameThemeConfig(selectedUsernameTheme);
  const avatarSize = getAvatarSize(profile?.avatar_size, 80);
  const avatarAlignment = getAvatarAlignment(profile?.avatar_alignment);
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
          <Stack align={getAvatarAlignItems(avatarAlignment)} gap="md" style={{ width: "100%" }}>
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
                    background: `linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.16) 52%, ${themeAccentColor} 100%)`,
                  }}
                />
              </Box>
            )}

            <Avatar
              src={profile?.avatar_url}
              size={avatarSize}
              radius="50%"
              mt={profile?.banner_url && profile?.is_banner_show ? -Math.round(avatarSize * 0.58) : 0}
              style={{ zIndex: 2, border: `3px solid ${themeAccentColor}` }}
            />
            <Stack gap={4} align={getAvatarAlignItems(avatarAlignment)} style={{ width: "100%" }}>
              <Text size="xl" fw={700}>
                {profile?.full_name || "Your Name"}
              </Text>
              <Text
                size="sm"
                opacity={0.8}
                ta={getAvatarTextAlign(avatarAlignment) as any}
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
              <Text size="sm" ta={getAvatarTextAlign(avatarAlignment) as any} opacity={0.9}>
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
                  {displayLinks.map((link: any, index: number) => (
                    <PreviewLinkItem
                      key={`${link?.id}-${selectedAnimation}`}
                      link={link}
                      index={index}
                      selectedAnimation={selectedAnimation}
                      currentTheme={currentTheme}
                      linkStyle={linkStyle}
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
                  {displayLinks.map((link: any, index: number) => (
                    <Carousel.Slide key={`${link?.id}-${selectedAnimation}`}>
                      <PreviewLinkItem
                        link={link}
                        index={index}
                        selectedAnimation={selectedAnimation}
                        currentTheme={currentTheme}
                        linkStyle={linkStyle}
                        square
                      />
                    </Carousel.Slide>
                  ))}
                </Carousel>
              ) : (
                <Stack gap="sm" style={{ width: "100%" }}>
                  {displayLinks.map((link: any, index: number) => (
                    <PreviewLinkItem
                      key={`${link?.id}-${selectedAnimation}`}
                      link={link}
                      index={index}
                      selectedAnimation={selectedAnimation}
                      currentTheme={currentTheme}
                      linkStyle={linkStyle}
                    />
                  ))}
                </Stack>
              )}
            </Stack>

            {displayBlocks.length > 0 && (
              <Stack gap="sm" style={{ width: "100%" }} mt="sm">
                {displayBlocks.map((block) => (
                  <PreviewContentBlockItem
                    key={block.id}
                    block={block}
                    currentTheme={currentTheme}
                  />
                ))}
              </Stack>
            )}

            {displayProducts.length > 0 && (
              <Stack gap="xs" style={{ width: "100%" }} mt="sm">
                <Text size="sm" fw={700} opacity={0.9}>
                  Products
                </Text>
                {displayProducts.map((product, index) => (
                  <PreviewProductItem
                    key={`${product.id}-${index}`}
                    product={product}
                    currentTheme={currentTheme}
                  />
                ))}
              </Stack>
            )}

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

function PreviewProductItem({
  product,
  currentTheme,
}: {
  product: any;
  currentTheme: any;
}) {
  return (
    <Box
      component="a"
      href={product.buy_url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: currentTheme.button,
        color: currentTheme.buttonText,
        borderRadius: 12,
        padding: "10px",
        textDecoration: "none",
      }}
    >
      {product.image_url ? (
        <Box
          component="img"
          src={product.image_url}
          alt={product.title}
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
      ) : (
        <Box
          style={{
            width: 44,
            height: 44,
            borderRadius: 8,
            background: "rgba(255,255,255,0.2)",
            flexShrink: 0,
          }}
        />
      )}

      <Box style={{ minWidth: 0, flex: 1 }}>
        <Text size="sm" fw={600} truncate="end">
          {product.title}
        </Text>
        {product.price !== null && product.price !== undefined && (
          <Text size="xs" opacity={0.85}>
            ${Number(product.price).toFixed(2)}
          </Text>
        )}
      </Box>
    </Box>
  );
}

function PreviewContentBlockItem({
  block,
  currentTheme,
}: {
  block: ContentBlock;
  currentTheme: any;
}) {
  if (block.type === "text") {
    return (
      <Box
        style={{
          background: `${currentTheme.button}20`,
          color: currentTheme.text,
          borderRadius: 12,
          padding: "12px 14px",
        }}
      >
        {block.title && (
          <Text size="sm" fw={700} mb={4}>
            {block.title}
          </Text>
        )}
        <Text size="sm">{block.content_json?.text || ""}</Text>
      </Box>
    );
  }

  if (block.type === "gallery") {
    const images = block.content_json?.images || [];
    return (
      <Stack gap={6}>
        {block.title && (
          <Text size="sm" fw={700}>
            {block.title}
          </Text>
        )}
        <Box
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          {images.slice(0, 4).map((imageUrl, index) => (
            <Box
              key={`${block.id}-preview-${index}`}
              component="img"
              src={imageUrl}
              alt={block.title || "Gallery image"}
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                objectFit: "cover",
                borderRadius: 10,
                border: `1px solid ${currentTheme.text}20`,
              }}
            />
          ))}
        </Box>
      </Stack>
    );
  }

  const fallbackUrl = block.content_json?.url || "";
  const embedUrl =
    block.content_json?.embedUrl ||
    (block.type === "video"
      ? getVideoEmbedUrl(fallbackUrl)
      : getMusicEmbedUrl(fallbackUrl));

  return (
    <Stack gap={4}>
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
            height: block.type === "video" ? 180 : 120,
            border: "none",
            borderRadius: 12,
            background: `${currentTheme.button}20`,
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
            background: currentTheme.button,
            color: currentTheme.buttonText,
            borderRadius: 12,
            padding: "10px 12px",
            textDecoration: "none",
            display: "inline-block",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          Open {block.type}
        </Box>
      )}
    </Stack>
  );
}

function PreviewLinkItem({
  link,
  index,
  selectedAnimation,
  currentTheme,
  linkStyle,
  compact = false,
  square = false,
}: {
  link: any;
  index: number;
  selectedAnimation: string;
  currentTheme: any;
  linkStyle: LinkStyleConfig;
  compact?: boolean;
  square?: boolean;
}) {
  const animationVariants = getAnimationVariants(selectedAnimation);
  const staggerDelay = selectedAnimation !== "none" ? index * 0.1 : 0;
  const fontSize = compact ? Math.max(12, linkStyle.fontSize - 1) : linkStyle.fontSize;
  const borderRadius = square
    ? `${Math.max(6, Math.min(linkStyle.borderRadius, 24))}px`
    : `${linkStyle.borderRadius}px`;
  const minHeight = compact
    ? Math.max(40, linkStyle.height - 8)
    : linkStyle.height;
  const borderColor = linkStyle.borderWidth > 0 ? linkStyle.borderColor : "transparent";
  const linkBg = linkStyle.linkColor || currentTheme.button;
  const linkText = linkStyle.linkColor
    ? getReadableTextColor(linkBg)
    : currentTheme.buttonText;

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
          justifyContent: "space-between",
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
          gap: 10,
        }}
      >
        <Box style={{ width: 20, display: "flex", justifyContent: "flex-start", flexShrink: 0 }}>
          {link?.left_icon_name ? renderLucideIcon(link.left_icon_name, 16) : null}
        </Box>
        <Box style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
          <span>{link?.title}</span>
        </Box>
        <Box style={{ width: 20, display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>
          {link?.right_icon_name ? renderLucideIcon(link.right_icon_name, 16) : null}
        </Box>
      </Box>
    </motion.div>
  );
}