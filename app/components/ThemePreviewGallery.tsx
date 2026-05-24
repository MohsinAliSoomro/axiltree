"use client";

import {
  Avatar,
  Box,
  Card,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandPinterest,
  IconBrandTwitter,
  IconBrandYoutube,
} from "@tabler/icons-react";

type PreviewCategory = {
  value: string;
  label: string;
  name: string;
  bio: string;
  cta: string;
  chips: string[];
  bg: string;
  text: string;
  button: string;
  buttonText: string;
};

const previewCategories: PreviewCategory[] = [
  {
    value: "fashion",
    label: "Fashion",
    name: "Mila Stone",
    bio: "Stylist, creator, and capsule wardrobe curator.",
    cta: "Shop the edit",
    chips: ["New season drops", "Outfit ideas", "Lookbook"],
    bg: "linear-gradient(180deg, #f8d7e6 0%, #ffdbe8 45%, #fff6fa 100%)",
    text: "#24111d",
    button: "#111111",
    buttonText: "#ffffff",
  },
  {
    value: "real-estate",
    label: "Real Estate",
    name: "Jordan Lee",
    bio: "Modern homes, listings, and open house updates.",
    cta: "View listings",
    chips: ["Open houses", "Featured homes", "Market updates"],
    bg: "linear-gradient(180deg, #dce8ff 0%, #edf3ff 45%, #f8fbff 100%)",
    text: "#10213d",
    button: "#123b78",
    buttonText: "#ffffff",
  },
  {
    value: "ecommerce",
    label: "Ecommerce",
    name: "Studio Cart",
    bio: "Small-batch products, bundles, and bestsellers.",
    cta: "Shop now",
    chips: ["Best sellers", "Bundles", "New arrivals"],
    bg: "linear-gradient(180deg, #dff8ed 0%, #effdf6 45%, #fbfffc 100%)",
    text: "#103522",
    button: "#10724f",
    buttonText: "#ffffff",
  },
  {
    value: "editorial-coach",
    label: "Coach",
    name: "Olivia Wilson",
    bio: "Business coach, workbook creator, and growth strategist.",
    cta: "Learn more",
    chips: ["Work with me", "Visit website", "Subscribe for freebies"],
    bg: "#f7efe8",
    text: "#6f4f3e",
    button: "#ffffff",
    buttonText: "#6f4f3e",
  },
];

export default function ThemePreviewGallery({
}: Record<string, never>) {
  return (
    <Box>
    
      <Box style={{ display: "grid", gap: 40, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {previewCategories.map((category) => (
          <MobileCategoryPreview key={category.value} category={category} />
        ))}
      </Box>
    </Box>
  );
}

function MobileCategoryPreview({ category }: { category: PreviewCategory }) {
  const darkText = category.text === "#10213d" || category.text === "#103522";
  const coachLayout = category.value === "editorial-coach";

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        background:"white",
        padding: 12,
        borderRadius: 30,
        boxShadow: "0 20px 36px rgba(0,0,0,0.22)",
      }}
    >
      <Box
        style={{
          width: "100%",
          maxWidth: 270,
          borderRadius: 30,
          background: "#171717",
          padding: 8,
          boxShadow: "0 20px 36px rgba(0,0,0,0.22)",
        }}
      >
        <Box
          style={{
            borderRadius: 28,
            overflow: "hidden",
            background: category.bg,
            color: category.text,
            minHeight: coachLayout ? 560 : 500,
            position: "relative",
          }}
        >
          {coachLayout ? (
            <Box style={{ padding: 18, position: "relative" }}>
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 86,
                  height: 16,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  background: "#171717",
                  zIndex: 3,
                }}
              />

              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: 12,
                }}
              >
                <Box
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: "50%",
                    border: "4px solid #f2e3d8",
                    background:
                      "radial-gradient(circle at 35% 35%, #d9c0a7 0 10%, #f7efe8 11% 20%, #c79d76 21% 35%, #f7efe8 36% 100%)",
                    boxShadow: "0 6px 18px rgba(111,79,62,0.12)",
                  }}
                />
              </Box>

              <Stack align="center" gap={2} mt={12} mb={10}>
                <Text fw={700} ta="center" style={{ fontSize: 26, lineHeight: 1.05, letterSpacing: "0.02em" }}>
                  {category.name}
                </Text>
                <Text size="sm" ta="center" c="#8b6b58" style={{ letterSpacing: "0.01em" }}>
                  Business Coach
                </Text>
              </Stack>

              <Group justify="center" gap={12} mb={18}>
                {[
                  IconBrandInstagram,
                  IconBrandYoutube,
                  IconBrandPinterest,
                  IconBrandTwitter,
                ].map((Icon, index) => (
                  <Box
                    key={index}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      border: "1.5px solid #8b6b58",
                      display: "grid",
                      placeItems: "center",
                      color: "#8b6b58",
                    }}
                  >
                    <Icon size={14} />
                  </Box>
                ))}
              </Group>

              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: "88px 1fr",
                  gap: 14,
                  alignItems: "center",
                  background: "#ead3c1",
                  borderRadius: 2,
                  padding: 14,
                  marginBottom: 16,
                }}
              >
                <Box
                  style={{
                    width: 88,
                    height: 110,
                    transform: "rotate(-8deg)",
                    borderRadius: 4,
                    border: "3px solid #1f1a17",
                    background: "#f8f3ec",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.14)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 8,
                    color: "#6f4f3e",
                  }}
                >
                  <Text size="10px" fw={700} style={{ letterSpacing: "0.08em" }}>
                    WORKBOOK
                  </Text>
                  <Box style={{ flex: 1, margin: "6px 0", background: "linear-gradient(180deg, #dcc0a8 0%, #f4e7db 100%)", borderRadius: 2 }} />
                  <Text size="10px" ta="right" fw={500}>
                    by {category.name.split(" ")[0]}
                  </Text>
                </Box>

                <Stack gap={6}>
                  <Text fw={700} size="md" style={{ lineHeight: 1.1 }}>
                    MAIN OFFER HERE
                  </Text>
                  <Text size="xs" c="#8b6b58" style={{ lineHeight: 1.45 }}>
                    Short description that introduces the workbook, coaching offer, or lead magnet.
                  </Text>
                  <Box
                    style={{
                      width: "fit-content",
                      borderRadius: 6,
                      background: "#ffffff",
                      color: "#6f4f3e",
                      border: "1px solid rgba(111,79,62,0.16)",
                      padding: "8px 16px",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                    }}
                  >
                    LEARN MORE
                  </Box>
                </Stack>
              </Box>

              <Stack gap={10} px={2} pb={4}>
                {category.chips.map((chip) => (
                  <Box
                    key={chip}
                    style={{
                      borderRadius: 8,
                      background: "#f7efe8",
                      border: "1px solid rgba(111,79,62,0.06)",
                      color: "#6f4f3e",
                      padding: "14px 16px",
                      fontSize: 12,
                      fontWeight: 700,
                      textAlign: "center",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {chip.toUpperCase()}
                  </Box>
                ))}
              </Stack>
            </Box>
          ) : (
            <>
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 86,
                  height: 16,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  background: "#171717",
                  zIndex: 3,
                }}
              />

              <Box
                style={{
                  height: 160,
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.26), rgba(255,255,255,0.06))",
                }}
              />

              <Stack align="center" gap={4} mt={-34} mb={16}>
                <Avatar
                  radius="xl"
                  size={68}
                  color="pink"
                  style={{ border: "3px solid rgba(255,255,255,0.7)" }}
                >
                  {category.label[0]}
                </Avatar>
                <Text fw={700} size="lg" ta="center" style={{ lineHeight: 1.1 }}>
                  {category.name}
                </Text>
                <Text size="xs" ta="center" c={darkText ? "rgba(0,0,0,0.68)" : "rgba(255,255,255,0.74)"}>
                  {category.bio}
                </Text>
              </Stack>

              <Stack gap={10} px={14} pb={16}>
                <Box style={{ borderRadius: 999, background: category.button, color: category.buttonText, padding: "12px 16px", fontSize: 12, fontWeight: 700, textAlign: "center" }}>
                  {category.cta}
                </Box>
                {category.chips.map((chip) => (
                  <Box
                    key={chip}
                    style={{
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.16)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      color: category.text,
                      padding: "12px 16px",
                      fontSize: 12,
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  >
                    {chip}
                  </Box>
                ))}
              </Stack>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}