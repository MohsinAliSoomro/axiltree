"use client";
import { Container, Stack, Avatar, Text, Button, Box } from "@mantine/core";
import { themesObject } from "../utils/theme";
import { createClient } from "../lib/supabase/client";
import { fetchLocation } from "../utils/location";

export default function ProfileView({
  profile,
  links,
}: {
  profile: any;
  links: any[];
}) {
  //@ts-ignore
  const theme = themesObject[profile?.theme] || themes.default;
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
      ff={`var(--font-${profile?.font || "inter"}), sans-serif`}
      style={{
        minHeight: "100vh",
        background: theme.bg,
        color: theme.text,
        padding: "40px 20px",
      }}
    >
      <Container size="xs">
        <Stack align="center" gap="md">
          <Avatar src={profile?.avatar_url} size={100} radius="xl" />
          <Stack gap={8} align="center">
            <Text size="xl" fw={700}>
              {profile?.display_name || "Name"}
            </Text>
            <Text size="md" opacity={0.8}>
              @{profile?.username || "username"}
            </Text>
            <Text size="sm" ta="center" opacity={0.9} maw={400}>
              {profile?.bio || ""}
            </Text>
          </Stack>

          <Stack gap="md" style={{ width: "100%" }} mt="lg">
            {links?.map((link) => (
              <Button
                key={link.id}
                component="a"
                onClick={() => handleClick(link)}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                fullWidth
                size="lg"
                radius="xl"
                style={{
                  background: theme.button,
                  color: theme.buttonText,
                  border: "none",
                  transition: "transform 0.2s",
                }}
                styles={{
                  root: {
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  },
                }}
              >
                {link.title}
              </Button>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
