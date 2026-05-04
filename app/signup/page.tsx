"use client";

import { signup } from "./actions";
import {
  Anchor,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconBrandApple,
  IconBrandGoogle,
  IconArrowRight,
  IconSparkles,
  IconUser,
  IconMail,
  IconLock,
} from "@tabler/icons-react";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function Signup() {
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

              <Box style={{ position: "relative", zIndex: 1, maxWidth: 330 }}>
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
                    maxWidth: 300,
                    marginTop: 18,
                  }}
                >
                  Curate your online identity in minutes.
                </Title>

                <Text mt={20} size="md" c="rgba(255,255,255,0.9)" style={{ lineHeight: 1.7, maxWidth: 300 }}>
                  Join the community of digital creators building intentional, beautiful link experiences.
                </Text>

                <Card
                  radius={20}
                  p={18}
                  mt={28}
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(255,255,255,0.65)",
                    boxShadow: "0 18px 36px rgba(0,0,0,0.08)",
                    maxWidth: 260,
                  }}
                >
                  <Group gap={12} align="flex-start" wrap="nowrap">
                    <Box
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 999,
                        background: "#edf0ff",
                        color: "#1f2a68",
                        display: "grid",
                        placeItems: "center",
                        flex: "0 0 auto",
                      }}
                    >
                      <IconSparkles size={18} />
                    </Box>
                    <Box>
                      <Text fw={700} c="#2a2a2a" size="sm">
                        Smart Layouts
                      </Text>
                      <Text size="xs" c="#6c6c6c" mt={2}>
                        Editorial-grade design for every user.
                      </Text>
                    </Box>
                  </Group>
                </Card>
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
              <Stack gap={18} maw={430} mx="auto" w="100%">
                <Box>
                  <Title order={2} style={{ fontSize: "clamp(2rem, 3vw, 2.55rem)", letterSpacing: "-0.04em", lineHeight: 1.02 }}>
                    Create your account
                  </Title>
                  <Text c="#6b5156" size="sm" mt={8}>
                    Start your journey as a Digital Curator today.
                  </Text>
                </Box>

                <Group grow gap={12}>
                  <Button
                    variant="light"
                    radius="xl"
                    size="md"
                    styles={{ root: { background: "#f4f4f4", color: "#2b2b2b", fontWeight: 600 } }}
                    leftSection={<IconBrandGoogle size={16} />}
                    disabled
                  >
                    Google
                  </Button>
                  <Button
                    variant="light"
                    radius="xl"
                    size="md"
                    styles={{ root: { background: "#f4f4f4", color: "#2b2b2b", fontWeight: 600 } }}
                    leftSection={<IconBrandApple size={16} />}
                    disabled
                  >
                    Apple
                  </Button>
                </Group>

                <Group gap={12} align="center">
                  <Divider style={{ flex: 1 }} color="#e7e0de" />
                  <Text size="xs" c="#8b7676" tt="uppercase" style={{ letterSpacing: "0.18em" }}>
                    Or continue with
                  </Text>
                  <Divider style={{ flex: 1 }} color="#e7e0de" />
                </Group>

                <Box component="form" action={signup}>
                  <Stack gap={14}>
                    <Box>
                      <Text size="xs" fw={700} tt="uppercase" c="#6c5054" style={{ letterSpacing: "0.18em" }}>
                        Claim your handle
                      </Text>
                      <Group gap={0} mt={7} grow>
                        <Box
                          style={{
                            height: 38,
                            background: "#e1dfdf",
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            border: "none",
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: 14,
                            color: "#7a7a7a",
                            fontSize: 14,
                            width: 92,
                          }}
                        >
                          axiltree.tech/
                        </Box>
                        <TextInput
                          name="username"
                          placeholder="yourname"
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
                        />
                      </Group>
                    </Box>

                    <Group grow align="flex-start">
                      <Box>
                        <Text size="xs" fw={700} tt="uppercase" c="#6c5054" style={{ letterSpacing: "0.18em" }}>
                          Full Name
                        </Text>
                        <TextInput
                          mt={7}
                          name="full_name"
                          placeholder="John Doe"
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
                          leftSection={<IconUser size={16} />}
                        />
                      </Box>

                      <Box>
                        <Text size="xs" fw={700} tt="uppercase" c="#6c5054" style={{ letterSpacing: "0.18em" }}>
                          Email Address
                        </Text>
                        <TextInput
                          mt={7}
                          name="email"
                          type="email"
                          placeholder="hello@example.com"
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
                    </Group>

                    <Box>
                      <Text size="xs" fw={700} tt="uppercase" c="#6c5054" style={{ letterSpacing: "0.18em" }}>
                        Password
                      </Text>
                      <PasswordInput
                        mt={7}
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
                      formAction={signup}
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
                      rightSection={<IconArrowRight size={16} />}
                    >
                      Sign Up
                    </Button>
                  </Stack>
                </Box>

                <Text ta="center" size="sm" c="#4b4b4b" mt={4}>
                  By signing up, you agree to our{" "}
                  <Anchor component={Link} href="/terms" c="#c51646" fw={700} underline="never">
                    Terms of Service
                  </Anchor>
                  {" "}and{" "}
                  <Anchor component={Link} href="/privacy" c="#c51646" fw={700} underline="never">
                    Privacy Policy
                  </Anchor>
                </Text>

                <Text ta="center" size="sm" c="#4b4b4b">
                  Already have an account?{" "}
                  <Anchor component={Link} href="/login" c="#c51646" fw={700} underline="never">
                    Log in
                  </Anchor>
                </Text>
              </Stack>
            </Box>
          </Group>
        </Card>
      </Container>

      <SiteFooter
        links={[
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
          { label: "Support", href: "/" },
        ]}
      />
    </Box>
  );
}
