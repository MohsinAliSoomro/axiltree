"use client";

import {
  Anchor,
  Box,
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { ArrowLeft, Inbox, MailCheck, RefreshCw } from "lucide-react";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function VerifyEmailPage() {
  return (
    <Box style={{ minHeight: "100vh", background: "#f5f1ef" }}>
      <SiteHeader
        links={[
          { label: "Explore", href: "/" },
          { label: "Features", href: "/#features" },
          { label: "Log In", href: "/login" },
        ]}
        primaryActionLabel="Get Started"
        primaryActionHref="/signup"
      />

      <Container size="lg" py={24}>
        <Paper
          radius={32}
          p={0}
          style={{
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 22px 55px rgba(43, 18, 26, 0.08)",
            border: "1px solid rgba(0, 0, 0, 0.04)",
          }}
        >
          <Group align="stretch" gap={0} wrap="wrap">
            <Box
              style={{
                flex: "1 1 420px",
                minHeight: 560,
                background: "linear-gradient(180deg, #a20b28 0%, #bf0f37 52%, #a50c2d 100%)",
                color: "white",
                padding: "56px 42px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                position: "relative",
              }}
            >
              <Box
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 45% 35%, rgba(255,255,255,0.06), transparent 20%), radial-gradient(circle at 10% 15%, rgba(255,255,255,0.05), transparent 18%)",
                }}
              />

              <Box style={{ position: "relative", zIndex: 1, maxWidth: 320 }}>
                <Text
                  fw={700}
                  size="xs"
                  tt="uppercase"
                  style={{ letterSpacing: "0.35em", opacity: 0.92 }}
                >
                  The digital curator
                </Text>

                <Box
                  style={{
                    position: "absolute",
                    top: -120,
                    left: 42,
                    fontSize: 180,
                    fontWeight: 800,
                    lineHeight: 1,
                    color: "rgba(255, 255, 255, 0.08)",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  C1
                </Box>

                <Title
                  order={1}
                  style={{
                    color: "white",
                    fontSize: "clamp(2.4rem, 4vw, 4rem)",
                    lineHeight: 0.96,
                    letterSpacing: "-0.06em",
                    maxWidth: 270,
                    marginTop: 18,
                  }}
                >
                  Check your inbox.
                </Title>

                <Text mt={20} size="md" c="rgba(255,255,255,0.9)" style={{ lineHeight: 1.7, maxWidth: 290 }}>
                  We have sent a verification link to your email address. Confirm it to finish creating your account.
                </Text>
              </Box>
            </Box>

            <Box
              style={{
                flex: "1 1 360px",
                minHeight: 560,
                background: "#fff",
                padding: "58px 48px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Stack gap={20} maw={430} mx="auto" w="100%">
                <Box>
                  <Title order={2} style={{ fontSize: "clamp(2rem, 3vw, 2.55rem)", letterSpacing: "-0.04em", lineHeight: 1.02 }}>
                    Verify your email
                  </Title>
                  <Text c="#6b5156" size="sm" mt={8}>
                    Open the link in the message we just sent to continue.
                  </Text>
                </Box>

                <Box
                  style={{
                    borderRadius: 24,
                    padding: 22,
                    background: "#faf7f6",
                    border: "1px solid #ece4e1",
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                  }}
                >
                  <Box
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 999,
                      background: "#fde8ee",
                      color: "#bf0f37",
                      display: "grid",
                      placeItems: "center",
                      flex: "0 0 auto",
                    }}
                  >
                    <MailCheck size={22} />
                  </Box>
                  <Box>
                    <Text fw={700} c="#2a2a2a" size="sm">
                      Check your email
                    </Text>
                    <Text size="xs" c="#6c6c6c" mt={3} style={{ lineHeight: 1.6 }}>
                      The verification email can take a minute. If you do not see it, check spam or junk.
                    </Text>
                  </Box>
                </Box>

                <Stack gap={14}>
                  <Button
                    leftSection={<RefreshCw size={18} />}
                    variant="light"
                    radius="xl"
                    size="md"
                    styles={{ root: { background: "#f4f4f4", color: "#2b2b2b", fontWeight: 600 } }}
                  >
                    Resend verification email
                  </Button>

                  <Button
                    component={Link}
                    href="/login"
                    leftSection={<ArrowLeft size={18} />}
                    radius="xl"
                    size="md"
                    style={{
                      background: "linear-gradient(90deg, #c51646 0%, #d62f5a 100%)",
                      fontWeight: 700,
                      height: 40,
                      boxShadow: "0 16px 30px rgba(197, 22, 70, 0.22)",
                    }}
                  >
                    Back to log in
                  </Button>
                </Stack>

                <Text ta="center" size="sm" c="#4b4b4b" mt={2}>
                  Need a different account?{" "}
                  <Anchor component={Link} href="/signup" c="#c51646" fw={700} underline="never">
                    Create one here
                  </Anchor>
                </Text>
              </Stack>
            </Box>
          </Group>
        </Paper>
      </Container>

      <SiteFooter
        copyright="© 2026 AxilTree. The Digital Curator."
        links={[
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
          { label: "Support", href: "/" },
        ]}
      />
    </Box>
  );
}
