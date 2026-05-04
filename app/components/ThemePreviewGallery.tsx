"use client";

import {
  Avatar,
  Box,
  Card,
  Group,
  Stack,
  Text,
} from "@mantine/core";

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
            minHeight: 500,
            position: "relative",
          }}
        >
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
            {/* <Box style={{ borderRadius: 999, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.14)", color: category.text, padding: "12px 16px", fontSize: 12, fontWeight: 700, textAlign: "center" }}>
              Mobile-friendly layout
            </Box> */}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}