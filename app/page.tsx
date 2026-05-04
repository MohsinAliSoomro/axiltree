import {
  ActionIcon,
  Anchor,
  Avatar,
  Center,
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
  Divider,
} from "@mantine/core";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import ContactForm from "./components/ContactForm";
import ThemePreviewGallery from "./components/ThemePreviewGallery";
import {
  IconBolt,
  IconCircleCheck,
  IconDots,
  IconRocket,
  IconShield,
  IconStar,
} from "@tabler/icons-react";
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
  
  const ctaHref = user ? "/account" : "/signup";
  const altHref = user && username ? `/${username}` : "/login";
  return (
    <Box style={{ background: "#f4f4f5", minHeight: "100vh", color: "#191919", fontFamily: "var(--font-poppins), var(--font-inter), sans-serif" }}>
      <SiteHeader
        links={[
          { label: "Features", href: "#features" },
          { label: "Templates", href: "#templates" },
          { label: "Pricing", href: "#pricing" },
          { label: "Showcase", href: "#showcase" },
        ]}
        activeHref="#features"
        primaryActionLabel="Sign Up"
        primaryActionHref={ctaHref}
        secondaryActionLabel="Log in"
        secondaryActionHref={user ? "/account" : "/login"}
      />

      <Container size="md" pt={74} pb={72}>
        <Stack align="center" gap={14}>
          <Badge radius="xl" color="pink" variant="light" style={{ textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "10px", fontWeight: 700, background: "#f7d8e1", color: "#c9174f", border: "1px solid #efbfd0" }}>
            Elevate your presence
          </Badge>

          <Title ta="center" style={{ fontSize: "clamp(2.2rem, 7vw, 4.05rem)", lineHeight: 1.02, letterSpacing: "-0.045em", maxWidth: 700, fontWeight: 700 }}>
            Share all your important
            <br />
            links with <span style={{ color: "#cc1049" }}>one bio link</span>
          </Title>

          <Text ta="center" c="#666" maw={510} size="sm" style={{ lineHeight: 1.7 }}>
            Transform your digital footprint into a high-end editorial
            experience. Curate your content, products, and social identity with
            AxilTree.
          </Text>

          <Text ta="center" c="#595959" size="xs">AxilTree</Text>

          <Group mt="sm" gap="sm">
            <Button component="a" href={ctaHref} radius="xl" size="md" style={{ background: "#cf1048", paddingInline: "1.35rem" }}>
              Create Your Page
            </Button>
            <Button component="a" href={altHref} radius="xl" size="md" variant="default" style={{ borderColor: "#dadada", background: "#f7f7f7" }}>
              View Templates
            </Button>
          </Group>

          <Group mt={12} gap={16} c="#7d7d7d">
            <Group gap={4}><IconShield size={13} /><Text size="xs">Trusted by 10K+ creators</Text></Group>
            <Group gap={4}><IconStar size={13} /><Text size="xs">4.9/5 rating</Text></Group>
            <Group gap={4}><IconBolt size={13} /><Text size="xs">Lightning fast setup</Text></Group>
          </Group>
        </Stack>
      </Container>

      <Container size="lg" pb={88}>
        <Card radius={30} p={{ base: 20, md: 40 }} style={{ background: "#ededee", border: "1px solid #e4e4e5" }}>
          <Group align="center" wrap="wrap" gap={42}>
            <Center style={{ flex: "0 0 330px", minHeight: 390 }}>
              <Box style={{ width: 240, borderRadius: 38, background: "#171717", padding: 9, boxShadow: "0 18px 32px rgba(0,0,0,0.25)" }}>
                <Box style={{ borderRadius: 30, background: "#f4f4f4", overflow: "hidden", position: "relative" }}>
                  <Box style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 80, height: 16, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, background: "#171717", zIndex: 3 }} />

                  <Box style={{ height: 165, background: "linear-gradient(130deg, #0f1532 0%, #11234f 55%, #ff8d2f 56%, #ef4f42 100%)" }} />

                  <Center style={{ marginTop: -34, marginBottom: 8, position: "relative", zIndex: 2 }}>
                    <Avatar radius="xl" size={68} color="pink" style={{ border: "3px solid #f4f4f4" }}>SJ</Avatar>
                  </Center>

                  <Stack gap={4} align="center" mb={14}>
                    <Text fw={700} size="xl" style={{ lineHeight: 1.1 }}>Sarah Jenkins</Text>
                    <Text size="sm" c="#6b6b6b">Digital Artist & Curator</Text>
                  </Stack>

                  <Stack gap={10} px={16} pb={16}>
                    <Group justify="space-between" style={{ background: "#f1f1f1", border: "1px solid #e5e5e5", borderRadius: 999, padding: "12px 16px" }}>
                      <Text fw={600} size="sm">Latest Portfolio</Text>
                      <Text c="#cc1148" fw={700}>›</Text>
                    </Group>
                    <Group justify="space-between" style={{ background: "#fdfdfd", border: "2px solid #ebc6d3", borderRadius: 999, padding: "12px 16px" }}>
                      <Text fw={600} size="sm">Shop My Prints</Text>
                      <Text c="#cc1148" fw={700}>⬢</Text>
                    </Group>
                    <Group justify="space-between" style={{ background: "#f1f1f1", border: "1px solid #e5e5e5", borderRadius: 999, padding: "12px 16px" }}>
                      <Text fw={600} size="sm">Photography Course</Text>
                      <Text c="#cc1148" fw={700}>●</Text>
                    </Group>
                  </Stack>
                </Box>
              </Box>
            </Center>

            <Stack gap={15} style={{ flex: 1, minWidth: 280, maxWidth: 560 }}>
              <Title order={2} fw={600} style={{ fontSize: "clamp(2rem, 4vw, 3.45rem)", letterSpacing: "-0.03em", lineHeight: 1.08 }}>
                Craft your narrative with
                <br />
                absolute precision
              </Title>
              <Text size="xl" c="#6a5e60" maw={500} style={{ lineHeight: 1.55 }}>
                Your bio link should not just be a list; it is your digital
                storefront. AxilTree gives you the editorial tools to present
                your work with the dignity it deserves.
              </Text>
              <Stack gap={12} mt={6}>
                <Group align="flex-start" gap={10} wrap="nowrap">
                  <IconCircleCheck size={18} color="#c9154c" style={{ marginTop: 2 }} />
                  <Stack gap={0}>
                    <Text fw={700} size="xl" style={{ lineHeight: 1.2 }}>Dynamic Content Blocks</Text>
                    <Text c="#6f6f6f" size="sm">Embed videos, music, and products directly.</Text>
                  </Stack>
                </Group>
                <Group align="flex-start" gap={10} wrap="nowrap">
                  <IconCircleCheck size={18} color="#c9154c" style={{ marginTop: 2 }} />
                  <Stack gap={0}>
                    <Text fw={700} size="xl" style={{ lineHeight: 1.2 }}>Premium Aesthetics</Text>
                    <Text c="#6f6f6f" size="sm">High-end typography and layout controls.</Text>
                  </Stack>
                </Group>
              </Stack>
            </Stack>
          </Group>
        </Card>
      </Container>

      <Container size="lg" id="features" pb={86}>
        <Stack align="center" gap={5} mb={34}>
          <Title order={2} ta="center" style={{ fontSize: "clamp(1.8rem, 4.2vw, 2.7rem)", letterSpacing: "-0.03em" }}>
            Everything you can publish
          </Title>
          <Text ta="center" c="#767676" size="sm">
            More than just links, built for comprehensive expression by your audience.
          </Text>
        </Stack>

        <Stack gap={14}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={14}>
            <Card radius={14} p={16} style={{ background: "#f7f7f7", border: "1px solid #ebebeb", minHeight: 138 }}>
              <ActionIcon variant="light" radius="xl" color="pink" size={28}><IconDots size={14} /></ActionIcon>
              <Text fw={600} mt={12} mb={6}>Links + Social Profiles</Text>
              <Text size="xs" c="#767676" style={{ lineHeight: 1.6 }}>Connect all your social profiles in one place, cohesive feed, stream-like card destinations.</Text>
            </Card>
            <Card radius={14} p={16} style={{ background: "#f7f7f7", border: "1px solid #ebebeb", minHeight: 138 }}>
              <ActionIcon variant="light" radius="xl" color="indigo" size={28}><IconShield size={14} /></ActionIcon>
              <Text fw={600} mt={12} mb={6}>Products</Text>
              <Text size="xs" c="#767676" style={{ lineHeight: 1.6 }}>Send products or digital products directly from your bio link with a seamless checkout.</Text>
            </Card>
          </SimpleGrid>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={14}>
            {[
              { title: "Content Blocks", desc: "Embed videos, playlists, and TikTok feeds to keep your users engaged on your page.", icon: <IconBolt size={14} /> },
              { title: "Smart Scheduling", desc: "Enable links to appear and disappear at specific times for limited launches.", icon: <IconRocket size={14} /> },
              { title: "Advanced Insights", desc: "Track CTR, location, and device data with granular privacy-first analytics.", icon: <IconStar size={14} /> },
              { title: "Audience Tools", desc: "Use templates, sections, and profile-level filters for polished growth loops.", icon: <IconDots size={14} /> },
            ].map((item) => (
              <Card key={item.title} radius={14} p={16} style={{ background: "#f7f7f7", border: "1px solid #ebebeb", minHeight: 136 }}>
                <ActionIcon variant="light" radius="xl" color="pink" size={28}>{item.icon}</ActionIcon>
                <Text fw={600} mt={12} mb={6}>{item.title}</Text>
                <Text size="xs" c="#767676" style={{ lineHeight: 1.6 }}>{item.desc}</Text>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>

      <Box id="templates" style={{ background: "#17191d", color: "white", padding: "76px 0" }}>
        <Container size="lg">
          <Group align="stretch" gap={24} wrap="wrap">
            <Stack gap={14} style={{ flex: "1 1 300px", maxWidth: 430 }} justify="center">
              <Title order={2} style={{ fontSize: "clamp(1.85rem, 4vw, 2.7rem)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
                Why Choose
                <br />
                AxilTree?
              </Title>
              <Group align="flex-start" gap={9} wrap="nowrap">
                <IconCircleCheck size={16} color="#ff4f7f" />
                <Text size="sm" c="#d0d3d8">Unrivaled performance with better loading speed and conversion paths.</Text>
              </Group>
              <Group align="flex-start" gap={9} wrap="nowrap">
                <IconCircleCheck size={16} color="#ff4f7f" />
                <Text size="sm" c="#d0d3d8">Editorial design controls for themes, overlays, and visual order.</Text>
              </Group>
            </Stack>

            <Box style={{ flex: "1 1 320px", minHeight: 280, borderRadius: 18, background: "linear-gradient(145deg, #ff2e74, #7f3dff 55%, #2a57ff)", position: "relative", overflow: "hidden" }}>
              <Box style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 75% 10%, rgba(255,255,255,0.26), transparent 38%), linear-gradient(170deg, rgba(255,255,255,0.12), transparent 35%)" }} />
              <Center style={{ position: "absolute", inset: 0, padding: 20 }}>
                <Text fw={700} ta="center" style={{ fontSize: "clamp(1.3rem, 2.8vw, 2rem)", maxWidth: 360 }}>
                  Built for creators who value intentionality.
                </Text>
              </Center>
            </Box>
          </Group>

          <Box mt={28}>
            <ThemePreviewGallery />
          </Box>
        </Container>
      </Box>

      <Container size="lg" py={78} id="showcase">
        <Stack align="center" gap={4} mb={30}>
          <Title order={2} ta="center" style={{ letterSpacing: "-0.03em" }}>Go live in minutes</Title>
          <Text size="sm" c="#777">The fastest way to personalize your bio.</Text>
        </Stack>

        <Divider mb={24} color="#dfdfdf" />
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={20}>
          {[
            { n: "01", title: "Claim Your Handle", desc: "Register your unique username and launch your URL in seconds." },
            { n: "02", title: "Curate Content", desc: "Add links, videos, and products with intuitive drag-and-drop editor." },
            { n: "03", title: "Share Everywhere", desc: "Place your new profile in all social bios and watch engagement grow." },
          ].map((step) => (
            <Stack key={step.n} align="center" gap={8}>
              <Badge radius="xl" size="lg" style={{ background: "#efefef", color: "#2b2b2b", paddingInline: 12, border: "1px solid #e4e4e4" }}>{step.n}</Badge>
              <Text fw={600} ta="center" size="sm">{step.title}</Text>
              <Text ta="center" size="xs" c="#7a7a7a" maw={250}>{step.desc}</Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Container>

      <Container size="lg" pb={76} id="pricing">
        <Card radius={16} p={{ base: 20, md: 28 }} style={{ background: "linear-gradient(135deg, #d00f45, #e13369)", color: "white", border: "1px solid rgba(255,255,255,0.22)" }}>
          <Group justify="space-between" align="center" wrap="wrap" gap={24}>
            <Stack gap={6} style={{ flex: "1 1 280px" }}>
              <Title order={2} style={{ lineHeight: 1.05, letterSpacing: "-0.03em" }}>
                Android App
                <br />
                Coming Soon
              </Title>
              <Text size="sm" c="#ffe3ea" maw={430}>
                Manage your bio link on the go. Get early access to better edits,
                analytics, and quick campaign updates.
              </Text>
              <Button radius="xl" w="fit-content" size="sm" style={{ background: "white", color: "#cf1048", fontWeight: 700 }}>
                Notify Me
              </Button>
            </Stack>
            <Box style={{ width: 120, height: 140, borderRadius: 24, border: "2px solid rgba(255,255,255,0.24)", transform: "rotate(8deg)", opacity: 0.45 }} />
          </Group>
        </Card>
      </Container>

      <Box style={{ borderTop: "1px solid #e7e7e7", borderBottom: "1px solid #e7e7e7", padding: "54px 0" }}>
        <Container size="lg">
          <Stack align="center" gap={12}>
            <Text fw={500}>Join thousands of creators worldwide</Text>
            <Group gap={-9}>
              {[
                "linear-gradient(135deg, #242424, #545454)",
                "linear-gradient(135deg, #3a0ca3, #4361ee)",
                "linear-gradient(135deg, #f72585, #ff7d00)",
                "linear-gradient(135deg, #118ab2, #06d6a0)",
                "linear-gradient(135deg, #ef476f, #ffd166)",
              ].map((bg, i) => (
                <Avatar key={i} size={30} radius="xl" style={{ border: "2px solid #f3f3f4", background: bg }} />
              ))}
            </Group>
            <Text size="xs" c="#7a7a7a" ta="center" maw={500}>
              AxilTree changed how I showcase my personal brand. It is an extension of my craft.
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container size="sm" py={82}>
        <Stack align="center" gap={8} mb={22}>
          <Title order={2} ta="center" style={{ letterSpacing: "-0.03em" }}>Get in Touch</Title>
        </Stack>

        <Card radius={18} p={{ base: 16, md: 24 }} style={{ background: "#f7f7f7", border: "1px solid #e7e7e7" }}>
          <ContactForm />
        </Card>
      </Container>

      <SiteFooter
        links={[
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
          { label: "Help Center", href: "/" },
          { label: "Contact Us", href: "/" },
        ]}
      />
    </Box>
  );
}