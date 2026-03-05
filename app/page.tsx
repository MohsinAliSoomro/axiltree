import {
  Container,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Card,
  Badge,
  Box,
  SimpleGrid,
} from "@mantine/core";
import Why from "./components/why";
import ContactForm from "./components/ContactForm";
import Header from "./components/Header";
import { createClient } from "./lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  // Fetch username if user is authenticated
  let username = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();
    username = profile?.username;
  }
  
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f8f9fa 0%, #ffffff 50%)",
      }}
    >
      {/* Header */}
      <Box
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Container size="lg" style={{ padding: "1.25rem 1rem" }}>
          <Header isAuthenticated={!!user} username={username} />
        </Container>
      </Box>

      {/* Hero Section */}
      <Container size="md" style={{ padding: "5rem 1rem 4rem" }}>
        <Stack align="center" gap={32}>
          {/* Badge */}
          <Badge
            size="lg"
            radius="xl"
            variant="light"
            gradient={{ from: "pink", to: "purple", deg: 45 }}
            style={{
              padding: "0.5rem 1.25rem",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              background: "linear-gradient(135deg, rgba(228, 64, 95, 0.1), rgba(193, 53, 132, 0.1))",
              color: "#C13584",
              border: "1px solid rgba(193, 53, 132, 0.2)",
            }}
          >
            🎉 Join thousands of creators worldwide
          </Badge>

          {/* Main Heading */}
          <Stack align="center" gap={20} style={{ textAlign: "center" }}>
            <Title
              order={1}
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 800,
                color: "#1a1a1a",
                lineHeight: 1.15,
                maxWidth: "700px",
                letterSpacing: "-0.02em",
              }}
            >
              Share all your important links with{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #E4405F, #C13584)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                one bio link
              </span>
            </Title>
            
            <Text
              size="xl"
              style={{
                color: "#666",
                maxWidth: "540px",
                lineHeight: 1.7,
                fontSize: "1.125rem",
              }}
            >
              Publish links, products, and rich content blocks in one page.
              Start free and launch in minutes.
            </Text>
          </Stack>

          {/* CTA Button */}
          <Stack align="center" gap={16}>
            <Button
              size="xl"
              radius="xl"
              style={{
                background: "linear-gradient(135deg, #E4405F, #C13584)",
                padding: "0 3rem",
                height: "56px",
                fontSize: "1.05rem",
                fontWeight: 600,
                boxShadow: "0 8px 24px rgba(228, 64, 95, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              Create Your Page
            </Button>

            <Group gap={24} style={{ marginTop: "0.5rem" }}>
              <Group gap={8}>
                <Text size="sm" style={{ color: "#666" }}>
                  ✨ Free forever
                </Text>
              </Group>
              <Text size="sm" style={{ color: "#d0d0d0" }}>
                •
              </Text>
              <Group gap={8}>
                <Text size="sm" style={{ color: "#666" }}>
                  🚀 Setup in 2 minutes
                </Text>
              </Group>
              <Text size="sm" style={{ color: "#d0d0d0" }}>
                •
              </Text>
              <Group gap={8}>
                <Text size="sm" style={{ color: "#666" }}>
                  💳 No credit card
                </Text>
              </Group>
            </Group>
          </Stack>
        </Stack>
      </Container>

      {/* Preview Section */}
      <Container size="md" style={{ padding: "4rem 1rem" }}>
        <Card
          shadow="xl"
          radius="xl"
          style={{
            padding: "3rem 2rem",
            background: "white",
            border: "1px solid #e9ecef",
            position: "relative",
            overflow: "visible",
          }}
        >
          {/* Decorative Elements */}
          <div
            style={{
              position: "absolute",
              top: "-20px",
              left: "-20px",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(228, 64, 95, 0.1), rgba(193, 53, 132, 0.1))",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20px",
              right: "-20px",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(193, 53, 132, 0.1), rgba(102, 126, 234, 0.1))",
              filter: "blur(50px)",
            }}
          />

          <Stack align="center" gap="xl">
            <Stack align="center" gap="sm" style={{ marginBottom: "1rem" }}>
              <Title order={3} fw={700} ta="center" size="1.5rem">
                See it in action
              </Title>
              <Text size="md" c="dimmed" ta="center" style={{ maxWidth: "400px" }}>
                A beautiful mobile-optimized page for all your links
              </Text>
            </Stack>

            {/* Phone Mockup */}
            <div
              style={{
                width: "300px",
                height: "600px",
                borderRadius: "48px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "14px",
                boxShadow: "0 30px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.1)",
                position: "relative",
              }}
            >
              {/* Phone Notch */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "120px",
                  height: "26px",
                  background: "#1a1a1a",
                  borderRadius: "0 0 20px 20px",
                  zIndex: 10,
                }}
              />

              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "36px",
                  background: "white",
                  padding: "2.5rem 1.75rem",
                  overflow: "hidden",
                }}
              >
                <Stack gap="lg" align="center">
                  {/* Profile Image */}
                  <div
                    style={{
                      width: "96px",
                      height: "96px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #E4405F, #C13584)",
                      marginBottom: "0.25rem",
                      boxShadow: "0 8px 20px rgba(228, 64, 95, 0.3)",
                    }}
                  />
                  
                  {/* Username */}
                  <Stack gap={4} align="center">
                    <Text fw={700} size="xl" style={{ color: "#1a1a1a" }}>
                      @yourusername
                    </Text>
                    <Text size="sm" c="dimmed">
                      Content Creator
                    </Text>
                  </Stack>

                  {/* Links */}
                  <Stack gap="sm" style={{ width: "100%", marginTop: "0.5rem" }}>
                    {[
                      { icon: "📺", text: "YouTube Channel" },
                      { icon: "🛍️", text: "Shop My Store" },
                      { icon: "✍️", text: "Read My Blog" },
                      { icon: "📧", text: "Contact Me" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "1.125rem 1.25rem",
                          borderRadius: "14px",
                          background: "#f8f9fa",
                          textAlign: "center",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          border: "1px solid #e9ecef",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                        }}
                      >
                        {item.icon} {item.text}
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
      <Container size="lg" style={{ padding: "1rem 1rem 5rem" }}>
        <Stack gap={36}>
          <Stack align="center" gap="md">
            <Title
              order={2}
              ta="center"
              fw={700}
              style={{
                fontSize: "2.2rem",
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
              }}
            >
              Everything you can publish
            </Title>
            <Text
              size="lg"
              c="dimmed"
              ta="center"
              style={{ maxWidth: "700px" }}
            >
              AxilTree is more than basic bio links — manage campaigns,
              products, and media from one dashboard.
            </Text>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            {[
              {
                title: "Links + Social Profiles",
                desc: "Add unlimited links and arrange them with drag & drop for the best click flow.",
                badge: "Core",
              },
              {
                title: "Products",
                desc: "Show product cards with price, image, and buy links to drive direct sales.",
                badge: "Commerce",
              },
              {
                title: "Content Blocks",
                desc: "Publish text, video embeds, music embeds, and image galleries beyond standard links.",
                badge: "Content",
              },
              {
                title: "Smart Scheduling",
                desc: "Set publish and expiry times for links, products, and content for timed campaigns.",
                badge: "Automation",
              },
              {
                title: "Advanced Analytics",
                desc: "Track clicks with date ranges, countries, and export reports to improve performance.",
                badge: "Insights",
              },
              {
                title: "Templates + Bulk Import",
                desc: "Use ready templates and import products via CSV or JSON to launch faster.",
                badge: "Scale",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                shadow="sm"
                radius="xl"
                style={{
                  padding: "1.5rem",
                  background: "white",
                  border: "1px solid #e9ecef",
                  height: "100%",
                }}
              >
                <Stack gap={10}>
                  <Badge variant="light" radius="xl" style={{ width: "fit-content" }}>
                    {feature.badge}
                  </Badge>
                  <Text fw={700} size="lg" style={{ color: "#1a1a1a" }}>
                    {feature.title}
                  </Text>
                  <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                    {feature.desc}
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      <Container size="lg" style={{ padding: "5rem 1rem" }}>
        <Stack gap={48}>
          <Stack align="center" gap="md">
            <Title
              order={2}
              ta="center"
              fw={700}
              style={{
                fontSize: "2.5rem",
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
              }}
            >
              Why Choose AxilTree?
            </Title>
            <Text
              size="lg"
              c="dimmed"
              ta="center"
              style={{ maxWidth: "600px" }}
            >
              Everything you need to manage and share your online presence
            </Text>
          </Stack>
          <Why />
        </Stack>
      </Container>

      {/* How It Works */}
      <Box
        style={{
          background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
          padding: "5rem 0",
        }}
      >
        <Container size="md">
          <Stack gap={48}>
            <Stack align="center" gap="md">
              <Title
                order={2}
                ta="center"
                fw={700}
                style={{
                  fontSize: "2.5rem",
                  color: "#1a1a1a",
                  letterSpacing: "-0.02em",
                }}
              >
                How It Works
              </Title>
              <Text
                size="lg"
                c="dimmed"
                ta="center"
                style={{ maxWidth: "600px" }}
              >
                Get started in three simple steps
              </Text>
            </Stack>

            <Stack gap={24}>
              {[
                {
                  num: "1",
                  title: "Sign Up",
                  desc: "Create your account using email or social login. It takes less than 30 seconds.",
                  icon: "👤",
                },
                {
                  num: "2",
                  title: "Build Your Page",
                  desc: "Add links, products, and content blocks, then style everything to match your brand.",
                  icon: "🔗",
                },
                {
                  num: "3",
                  title: "Schedule & Scale",
                  desc: "Schedule campaigns, review analytics, and keep improving your conversion over time.",
                  icon: "🚀",
                },
              ].map((step, i) => (
                <Card
                  key={i}
                  shadow="sm"
                  radius="xl"
                  style={{
                    padding: "2rem",
                    background: "white",
                    border: "1px solid #e9ecef",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Group gap={24} align="flex-start" wrap="nowrap">
                    <div
                      style={{
                        minWidth: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #E4405F, #C13584)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        boxShadow: "0 8px 20px rgba(228, 64, 95, 0.25)",
                        flexShrink: 0,
                      }}
                    >
                      {step.num}
                    </div>
                    <Stack gap={12} style={{ flex: 1 }}>
                      <Group gap={12}>
                        <Text size="2rem" style={{ lineHeight: 1 }}>
                          {step.icon}
                        </Text>
                        <Text fw={700} size="xl" style={{ color: "#1a1a1a" }}>
                          {step.title}
                        </Text>
                      </Group>
                      <Text size="md" c="dimmed" style={{ lineHeight: 1.6 }}>
                        {step.desc}
                      </Text>
                    </Stack>
                  </Group>
                </Card>
              ))}
            </Stack>

            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <Button
                size="xl"
                radius="xl"
                style={{
                  background: "linear-gradient(135deg, #E4405F, #C13584)",
                  padding: "0 3rem",
                  height: "56px",
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  boxShadow: "0 8px 24px rgba(228, 64, 95, 0.3)",
                }}
              >
                Start Now - It's Free
              </Button>
            </div>
          </Stack>
        </Container>
      </Box>

      {/* Contact Us Section */}
      <Container size="sm" style={{ padding: "5rem 1rem" }}>
        <Stack gap={40}>
          <Stack align="center" gap="md">
            <Title
              order={2}
              ta="center"
              fw={700}
              style={{
                fontSize: "2.5rem",
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
              }}
            >
              Get in Touch
            </Title>
            <Text
              size="lg"
              c="dimmed"
              ta="center"
              style={{ maxWidth: "540px", lineHeight: 1.7 }}
            >
              Have questions or feedback? We'd love to hear from you. Send us a
              message and we'll respond as soon as possible.
            </Text>
          </Stack>

          <Card
            shadow="md"
            radius="xl"
            style={{
              padding: "2.5rem",
              background: "white",
              border: "1px solid #e9ecef",
            }}
          >
            <ContactForm />
          </Card>
        </Stack>
      </Container>

      {/* Android App Coming Soon */}
      <Box
        style={{
          background: "linear-gradient(to bottom, #ffffff, #f8f9fa)",
          padding: "2rem 1rem 5rem",
        }}
      >
        <Container size="sm">
          <Card
            shadow="sm"
            radius="xl"
            style={{
              padding: "2.25rem",
              background: "white",
              border: "1px solid #e9ecef",
              textAlign: "center",
            }}
          >
            <Stack align="center" gap={12}>
              <Badge variant="light" size="lg" radius="xl">
                Android
              </Badge>
              <Title order={3} fw={700} style={{ color: "#1a1a1a" }}>
                Android App Coming Soon
              </Title>
              <Text c="dimmed" size="md" style={{ maxWidth: "520px", lineHeight: 1.7 }}>
                We are building the AxilTree Android app for faster profile edits,
                quick analytics, and on-the-go campaign updates.
              </Text>
              <Button variant="light" radius="xl" disabled>
                Coming Soon on Play Store
              </Button>
            </Stack>
          </Card>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        style={{
          borderTop: "1px solid #e9ecef",
          padding: "3rem 0",
          background: "#f8f9fa",
        }}
      >
        <Container size="lg">
          <Stack gap={24}>
            <Group justify="center" gap={32}>
              <Text
                component="a"
                href="/privacy"
                size="sm"
                style={{
                  color: "#666",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                Privacy Policy
              </Text>
              <Text
                component="a"
                href="/terms"
                size="sm"
                style={{
                  color: "#666",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                Terms of Service
              </Text>
              <Text
                size="sm"
                style={{
                  color: "#666",
                  cursor: "pointer",
                  transition: "color 0.2s ease",
                }}
              >
                Contact
              </Text>
            </Group>
            <Text ta="center" size="sm" c="dimmed">
              © 2026 AxilTree. All rights reserved.
            </Text>
          </Stack>
        </Container>
      </Box>
    </div>
  );
}