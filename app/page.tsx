import {
  Container,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Card,
} from "@mantine/core";
import { Camera } from "lucide-react";
import Why from "./components/why";
import { createClient } from "./lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #fafafa, #ffffff)",
      }}
    >
      {/* Header */}
      <Container size="lg" style={{ padding: "1.5rem 1rem" }}>
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Camera size={28} color="#E4405F" />
            <Text size="xl" fw={700} style={{ color: "#262626" }}>
              AxilTree
            </Text>
          </Group>
          <Button
            variant="gradient"
            color="dark"
            size="sm"
            component="a"
            href={user ? "/account" : "/login"}
          >
            {user ? "Account" : "Login"}
          </Button>
        </Group>
      </Container>

      {/* Hero Section */}
      <Container size="md" style={{ padding: "4rem 1rem 3rem" }}>
        <Stack align="center" gap="xl">
          <Stack align="center" gap="md" style={{ textAlign: "center" }}>
            <Title
              order={1}
              size="2.5rem"
              fw={800}
              style={{
                color: "#262626",
                lineHeight: 1.2,
                maxWidth: "600px",
              }}
            >
              Share all your important links with one bio link
            </Title>
            <Text
              size="lg"
              c="dimmed"
              style={{ maxWidth: "500px", lineHeight: 1.6 }}
            >
              All your links, one place. Start free. Set up in minutes.
            </Text>
          </Stack>

          <Button size="lg" radius="xl" variant="gradient" px={40}>
            Create Your Page
          </Button>

          <Text size="sm" c="dimmed">
            ✨ Free forever • No credit card required
          </Text>
        </Stack>
      </Container>

      {/* Preview Section */}
      <Container size="sm" style={{ padding: "3rem 1rem" }}>
        <Card
          shadow="xl"
          radius="xl"
          style={{
            padding: "2.5rem",
            background: "white",
            border: "1px solid #f0f0f0",
          }}
        >
          <Stack align="center" gap="lg">
            <div
              style={{
                width: "280px",
                height: "560px",
                borderRadius: "40px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "12px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "32px",
                  background: "white",
                  padding: "2rem 1.5rem",
                  overflow: "hidden",
                }}
              >
                <Stack gap="md" align="center">
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #E4405F, #C13584)",
                      marginBottom: "0.5rem",
                    }}
                  />
                  <Text fw={700} size="lg">
                    @yourusername
                  </Text>
                  <Stack gap="xs" style={{ width: "100%" }}>
                    {["YouTube", "Shop", "Blog", "Contact"].map((item, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "1rem",
                          borderRadius: "12px",
                          background: "#f8f9fa",
                          textAlign: "center",
                          fontWeight: 500,
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </Stack>
                </Stack>
              </div>
            </div>
          </Stack>
        </Card>
      </Container>

      {/* Benefits Section */}
      <Container size="lg" style={{ padding: "4rem 1rem" }}>
        <Stack gap="xl">
          <Title order={2} ta="center" fw={700} size="2rem">
            Why Choose?
          </Title>
          <Why />
        </Stack>
      </Container>

      {/* How It Works */}
      <Container size="md" style={{ padding: "4rem 1rem" }}>
        <Stack gap="xl">
          <Title order={2} ta="center" fw={700} size="2rem">
            How It Works
          </Title>

          <Stack gap="lg">
            {[
              {
                num: "1",
                title: "Sign Up",
                desc: "Create your account using email or social login",
              },
              {
                num: "2",
                title: "Add Links",
                desc: "Add all your important links in one place",
              },
              {
                num: "3",
                title: "Share",
                desc: "Put your unique link in your Instagram bio!",
              },
            ].map((step, i) => (
              <Card
                key={i}
                shadow="sm"
                radius="lg"
                style={{ padding: "1.5rem" }}
              >
                <Group gap="lg" align="flex-start" variant="gradient">
                  <div
                    style={{
                      minWidth: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #E4405F, #C13584)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                    }}
                  >
                    {step.num}
                  </div>
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Text fw={600} size="lg">
                      {step.title}
                    </Text>
                    <Text c="dimmed">{step.desc}</Text>
                  </Stack>
                </Group>
              </Card>
            ))}
          </Stack>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Button size="lg" radius="xl" variant="gradient" px={40}>
              Start Now - It's Free
            </Button>
          </div>
        </Stack>
      </Container>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          padding: "2rem 0",
          marginTop: "4rem",
          background: "#fafafa",
        }}
      >
        <Container size="lg">
          <Group justify="center" gap="xl">
            <Text size="sm" c="dimmed" style={{ cursor: "pointer" }}>
              Privacy Policy
            </Text>
            <Text size="sm" c="dimmed" style={{ cursor: "pointer" }}>
              Terms of Service
            </Text>
            <Text size="sm" c="dimmed" style={{ cursor: "pointer" }}>
              Contact
            </Text>
          </Group>
          <Text ta="center" size="xs" c="dimmed" style={{ marginTop: "1rem" }}>
            © 2024 AxilTree. All rights reserved.
          </Text>
        </Container>
      </div>
    </div>
  );
}
