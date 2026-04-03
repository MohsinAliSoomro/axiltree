"use client";
import { login, siginWithGoogle } from "./actions";
import {
  Anchor,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconBrandGoogle,
  IconBrandX,
  IconLock,
  IconMail,
} from "@tabler/icons-react";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function LoginPage() {
  return (
    <Box style={{ minHeight: "100vh", background: "#f5f1ef" }}>
      <SiteHeader
        links={[
          { label: "Explore", href: "/" },
          { label: "Features", href: "/#features" },
          { label: "Log In", href: "/login" },
        ]}
        activeHref="/login"
        primaryActionLabel="Get Started"
        primaryActionHref="/signup"
      />

      <Container size="lg" py={24}>
        <Card
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
                    maxWidth: 250,
                    marginTop: 18,
                  }}
                >
                  Design your identity.
                </Title>

                <Text mt={20} size="md" c="rgba(255,255,255,0.9)" style={{ lineHeight: 1.7, maxWidth: 290 }}>
                  Join the world&apos;s most intentional creators in building a digital presence that feels like a premium magazine.
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
                    Welcome back
                  </Title>
                  <Text c="#6b5156" size="sm" mt={8}>
                    Please enter your details to continue.
                  </Text>
                </Box>

                <form action={siginWithGoogle}>
                  <Button
                    type="submit"
                    fullWidth
                    radius="xl"
                    size="md"
                    variant="light"
                    styles={{ root: { background: "#f4f4f4", color: "#222", fontWeight: 600 } }}
                    leftSection={<IconBrandGoogle size={18} />}
                  >
                    Continue with Google
                  </Button>
                </form>

                <Group gap={12} align="center">
                  <Divider style={{ flex: 1 }} color="#e7e0de" />
                  <Text size="xs" c="#8b7676" tt="uppercase" style={{ letterSpacing: "0.18em" }}>
                    Or continue with
                  </Text>
                  <Divider style={{ flex: 1 }} color="#e7e0de" />
                </Group>

                <Group grow gap={12}>
                  <Button
                    variant="light"
                    radius="xl"
                    size="md"
                    styles={{ root: { background: "#f4f4f4", color: "#2b2b2b", fontWeight: 600 } }}
                    leftSection={<IconBrandGoogle size={16} />}
                  >
                    Google
                  </Button>
                  <Button
                    variant="light"
                    radius="xl"
                    size="md"
                    disabled
                    styles={{ root: { background: "#f4f4f4", color: "#2b2b2b", fontWeight: 600 } }}
                    leftSection={<IconBrandX size={16} />}
                  >
                    Twitter
                  </Button>
                </Group>

                <Paper component="form" action={login} radius={0} withBorder={false} style={{ background: "transparent" }}>
                  <Stack gap={14}>
                    <Box>
                      <Group justify="space-between" mb={7}>
                        <Text size="xs" fw={700} tt="uppercase" c="#6c5054" style={{ letterSpacing: "0.18em" }}>
                          Email address
                        </Text>
                      </Group>
                      <TextInput
                        name="email"
                        type="email"
                        placeholder="curator@axiltree.com"
                        required
                        radius={0}
                        size="md"
                        styles={{
                          input: {
                            background: "#e1dfdf",
                            border: "none",
                            color: "#222",
                            height: 38,
                          },
                        }}
                        leftSection={<IconMail size={16} />}
                      />
                    </Box>

                    <Box>
                      <Group justify="space-between" mb={7}>
                        <Text size="xs" fw={700} tt="uppercase" c="#6c5054" style={{ letterSpacing: "0.18em" }}>
                          Password
                        </Text>
                        <Anchor component={Link} href="/forgot-password" size="xs" c="#c51646" style={{ textDecoration: "none" }}>
                          Forgot?
                        </Anchor>
                      </Group>
                      <PasswordInput
                        name="password"
                        placeholder="••••••••"
                        required
                        radius={0}
                        size="md"
                        styles={{
                          input: {
                            background: "#e1dfdf",
                            border: "none",
                            color: "#222",
                            height: 38,
                          },
                        }}
                        leftSection={<IconLock size={16} />}
                      />
                    </Box>

                    <Button
                      formAction={login}
                      type="submit"
                      fullWidth
                      radius="xl"
                      size="md"
                      style={{
                        background: "linear-gradient(90deg, #c51646 0%, #d62f5a 100%)",
                        fontWeight: 700,
                        height: 40,
                        boxShadow: "0 16px 30px rgba(197, 22, 70, 0.22)",
                      }}
                    >
                      Log In
                    </Button>
                  </Stack>
                </Paper>

                <Text ta="center" size="sm" c="#4b4b4b" mt={2}>
                  Don&apos;t have an account?{" "}
                  <Anchor component={Link} href="/signup" c="#c51646" fw={700} underline="never">
                    Sign up for free
                  </Anchor>
                </Text>
              </Stack>
            </Box>
          </Group>
        </Card>
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
