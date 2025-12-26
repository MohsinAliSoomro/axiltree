"use client";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import {
  Container,
  Grid,
  Paper,
  TextInput,
  Button,
  Stack,
  Group,
  Select,
  Text,
  Avatar,
  Textarea,
  ActionIcon,
  Box,
  Card,
  Badge,
} from "@mantine/core";
import {
  IconGripVertical,
  IconTrash,
  IconPlus,
  IconLink,
  IconUser,
  IconPalette,
  IconDeviceMobile,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandFacebook,
  IconFileTypographyFilled,
  IconFileTypography,
  IconBrandFunimation,
} from "@tabler/icons-react";
import { createClient } from "../../lib/supabase/client";
import AppShellLayout from "../../components/layout";
import { User } from "@supabase/supabase-js";
import { themesArray } from "@/app/utils/theme";
import { Footprints } from "lucide-react";

const SOCIALS = [
  {
    label: "Instagram",
    value: "Instagram",
    icon: <IconBrandInstagram size={16} />,
  },
  { label: "TikTok", value: "TikTok", icon: <IconBrandTiktok size={16} /> },
  { label: "Twitter", value: "Twitter", icon: <IconBrandTwitter size={16} /> },
  {
    label: "Facebook",
    value: "Facebook",
    icon: <IconBrandFacebook size={16} />,
  },
  {
    label: "Whatsapp",
    value: "Whatsapp",
    icon: <IconBrandFacebook size={16} />,
  },
];
export const fontOptions = [
  {
    value: "inter",
    label: "Inter (Clean & Modern)",
    css: "var(--font-inter)",
  },
  {
    value: "poppins",
    label: "Poppins (Stylish)",
    css: "var(--font-poppins)",
  },
  {
    value: "space",
    label: "Space Mono (Techy)",
    css: "var(--font-space)",
  },
  {
    value: "quicksand",
    label: "Quicksand (Friendly)",
    css: "var(--font-quicksand)",
  },
  {
    value: "amarna",
    label: "Amarna (Elegant)",
    css: "var(--font-amarna)",
  },
  {
    value: "delius",
    label: "Delius (Handwritten)",
    css: "var(--font-delius)",
  },
  {
    value: "borel",
    label: "Borel (Playful)",
    css: "var(--font-borel)",
  },
  {
    value: "iceland",
    label: "Iceland (Futuristic)",
    css: "var(--font-iceland)",
  },
];

const themes = themesArray;

// Animation options
const animationOptions = [
  {
    value: "none",
    label: "None",
    icon: "⚪",
    description: "No Animation",
  },
  {
    value: "fade",
    label: "Fade In",
    icon: "✨",
    description: "Fade In",
  },
  {
    value: "slide-up",
    label: "Slide Up",
    icon: "⬆️",
    description: "Slide Up",
  },
  {
    value: "slide-down",
    label: "Slide Down",
    icon: "⬇️",
    description: "Slide Down",
  },
  {
    value: "slide-left",
    label: "Slide Left",
    icon: "⬅️",
    description: "Slide Left",
  },
  {
    value: "slide-right",
    label: "Slide Right",
    icon: "➡️",
    description: "Slide Right",
  },
  {
    value: "bounce",
    label: "Bounce",
    icon: "🔴",
    description: "Bounce",
  },
  {
    value: "scale",
    label: "Scale",
    icon: "🔍",
    description: "Scale",
  },
  {
    value: "rotate",
    label: "Rotate",
    icon: "🔄",
    description: "Rotate",
  },
  {
    value: "flip",
    label: "Flip",
    icon: "🔄",
    description: "Flip",
  },
  {
    value: "zoom-in",
    label: "Zoom In",
    icon: "🔍",
    description: "Zoom In",
  },
  {
    value: "zoom-out",
    label: "Zoom Out",
    icon: "🔍",
    description: "Zoom Out",
  },
  {
    value: "shake",
    label: "Shake",
    icon: "📳",
    description: "Shake",
  },
  {
    value: "pulse",
    label: "Pulse",
    icon: "💓",
    description: "Pulse",
  },
  {
    value: "wiggle",
    label: "Wiggle",
    icon: "〰️",
    description: "Wiggle",
  },
  {
    value: "glow",
    label: "Glow",
    icon: "✨",
    description: "Glow",
  },
  {
    value: "float",
    label: "Float",
    icon: "☁️",
    description: "Float",
  },
  {
    value: "elastic",
    label: "Elastic",
    icon: "🔗",
    description: "Elastic",
  },
  {
    value: "spring",
    label: "Spring",
    icon: "🌱",
    description: "Spring",
  },
];

export default function LinkTreeDashboard({ user }: { user: User | null }) {
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any>([]);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [selectedFont, setSelectedFont] = useState("inter");
  const [selectedAnimation, setSelectedAnimation] = useState("none");
  const supabase = createClient();
  useEffect(() => {
    loadData();

    // Setup real-time subscription
    const channel = supabase
      .channel("links-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "links" },
        handleRealtimeUpdate
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    // Load profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();
    if (profileData) {
      setProfile(profileData);
      setSelectedTheme(profileData.theme || "default");
      setSelectedFont(profileData.font || "inter");
      setSelectedAnimation(profileData.animation || "none");
    }

    // Load links
    const { data: linksData } = await supabase
      .from("links")
      .select("*")
      .eq("profile_id", user?.id)
      .order("position");

    if (linksData) {
      setLinks(linksData as any);
    }
  };
  const handleRealtimeUpdate = (payload: any) => {
    if (payload.eventType === "INSERT") {
      setLinks((prev: any) =>
        [...prev, payload.new].sort((a, b) => a.position - b.position)
      );
    } else if (payload.eventType === "UPDATE") {
      setLinks((prev: any) =>
        prev.map((link: any) =>
          link.id === payload.new.id ? payload.new : link
        )
      );
    } else if (payload.eventType === "DELETE") {
      setLinks((prev: any) =>
        prev.filter((link: any) => link.id !== payload.old.id)
      );
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedLinks: any = items.map((link, index) => ({
      ...(link as any),
      position: index,
    }));

    setLinks(updatedLinks);

    // Update positions in database
    await supabase.from("links").upsert(updatedLinks);
  };

  const validateUrl = (social: string, url: string) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      switch (social) {
        case "Instagram":
          return parsed.hostname.includes("instagram.com");
        case "TikTok":
          return parsed.hostname.includes("tiktok.com");
        case "Twitter":
          return parsed.hostname.includes("x.com");
        case "Facebook":
          return parsed.hostname.includes("facebook.com");
        case "Whatsapp":
          return (
            parsed.hostname.includes("wa.me") ||
            parsed.hostname.includes("whatsapp.com")
          );
        default:
          return false;
      }
    } catch {
      return false;
    }
  };
  const addLink = async () => {
    if (!newLink.title || !newLink.url) return;
    if (!validateUrl(newLink.title, newLink.url)) {
      alert("Please enter a valid URL for the selected social network.");
      return;
    }
    const linkData = {
      profile_id: user?.id,
      title: newLink.title,
      url: newLink.url,
      position: links.length,
      is_active: true,
    };
    const { data, error } = await supabase
      .from("links")
      .insert([linkData])
      .select("*");
    if (data) {
      setLinks([...links, data[0]] as any);
      setNewLink({ title: "", url: "" });
    }
  };

  const deleteLink = async (id: any) => {
    await supabase.from("links").delete().eq("id", id);
    setLinks(links.filter((link: any) => link?.id !== id));
  };

  const updateProfile = async (field: any, value: any) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    await supabase
      .from("profiles")
      .update({ [field]: value })
      .eq("id", user?.id);
  };

  const updateTheme = async (theme: any) => {
    setSelectedTheme(theme);
    await updateProfile("theme", theme);
  };
  const updateFont = async (font: any) => {
    setSelectedFont(font);
    await updateProfile("font", font);
  };

  const updateAnimation = async (animation: any) => {
    setSelectedAnimation(animation);
    await updateProfile("animation", animation);
  };

  const currentTheme =
    themes.find((t) => t.value === selectedTheme) || themes[0];

  // Get animation variants for framer-motion
  const getAnimationVariants = (animationType: string) => {
    const baseVariants = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5 },
    };

    switch (animationType) {
      case "none":
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          transition: { duration: 0 },
        };
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.6 },
        };
      case "slide-up":
        return {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] as const },
        };
      case "slide-down":
        return {
          initial: { opacity: 0, y: -50 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] as const },
        };
      case "slide-left":
        return {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] as const },
        };
      case "slide-right":
        return {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] as const },
        };
      case "bounce":
        return {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
          transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 20,
          },
        };
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.5 },
        };
      case "rotate":
        return {
          initial: { opacity: 0, rotate: -180 },
          animate: { opacity: 1, rotate: 0 },
          transition: { duration: 0.6 },
        };
      case "flip":
        return {
          initial: { opacity: 0, rotateY: -90 },
          animate: { opacity: 1, rotateY: 0 },
          transition: { duration: 0.6 },
        };
      case "zoom-in":
        return {
          initial: { opacity: 0, scale: 0.5 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.5 },
        };
      case "zoom-out":
        return {
          initial: { opacity: 0, scale: 1.5 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.5 },
        };
      case "shake":
        return {
          initial: { x: 0 },
          animate: {
            x: [0, -10, 10, -10, 10, 0],
            opacity: 1,
          },
          transition: {
            duration: 0.5,
            opacity: { duration: 0.3 },
          },
        };
      case "pulse":
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: {
            opacity: 1,
            scale: 1.05,
          },
          transition: {
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse" as const,
            repeatDelay: 1,
          },
        };
      case "wiggle":
        return {
          initial: { rotate: 0 },
          animate: {
            rotate: [0, -5, 5, -5, 5, 0],
            opacity: 1,
          },
          transition: {
            duration: 0.5,
            opacity: { duration: 0.3 },
          },
        };
      case "glow":
        return {
          initial: { opacity: 0, boxShadow: "0 0 0px rgba(255,255,255,0)" },
          animate: {
            opacity: 1,
            boxShadow: [
              "0 0 0px rgba(255,255,255,0)",
              "0 0 20px rgba(255,255,255,0.5)",
              "0 0 0px rgba(255,255,255,0)",
            ],
          },
          transition: {
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse" as const,
          },
        };
      case "float":
        return {
          initial: { opacity: 0, y: 0 },
          animate: {
            opacity: 1,
            y: [0, -10, 0],
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: [0.4, 0, 0.6, 1] as const,
          },
        };
      case "elastic":
        return {
          initial: { opacity: 0, scale: 0 },
          animate: {
            opacity: 1,
            scale: 1,
          },
          transition: {
            type: "spring" as const,
            stiffness: 200,
            damping: 10,
            bounce: 0.5,
          },
        };
      case "spring":
        return {
          initial: { opacity: 0, y: 50 },
          animate: {
            opacity: 1,
            y: 0,
          },
          transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 15,
          },
        };
      default:
        return baseVariants;
    }
  };

  return (
    <AppShellLayout>
      <Container size="xl" py="md">
        <Grid gutter="lg">
          {/* Left Side - Editor */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}> 
                {/* <Grid.Col span={{ base: 12, md: 8 }}> changes by shahzad  */}

                  <Paper shadow="sm" p="md" withBorder>
                    <Group mb="md">
                      <IconUser size={20} />
                      <Text fw={600}>Profile Information</Text>
                    </Group>

                    <Stack gap="sm">
                      <Group>
                        <Avatar
                          src={profile?.avatar_url}
                          size="lg"
                          radius="xl"
                        />
                        <Stack gap={4} style={{ flex: 1 }}>
                          <TextInput
                            placeholder="Display Name"
                            value={profile?.full_name || ""}
                            onChange={(e) =>
                              updateProfile("full_name", e.target.value)
                            }
                            disabled
                          />
                          <TextInput
                            placeholder="@username"
                            value={profile?.username || ""}
                            onChange={(e) =>
                              updateProfile("username", e.target.value)
                            }
                            disabled
                          />
                        </Stack>
                      </Group>

                      <Textarea
                        placeholder="Bio"
                        value={profile?.bio || ""}
                        onChange={(e) => updateProfile("bio", e.target.value)}
                        minRows={2}
                      />
                    </Stack>
                  </Paper>
                  <Paper shadow="sm" p="md" withBorder mt="sm">
                    <Group mb="md">
                      <IconFileTypography size={20} />
                      <Text fw={600}>Font </Text>
                    </Group>

                    <Stack gap="sm">
                      <Select
                        label="Profile Font"
                        placeholder="Choose a font"
                        data={fontOptions.map((f) => ({
                          value: f.value,
                          label: f.label,
                        }))}
                        value={selectedFont}
                        onChange={updateFont}
                      />
                    </Stack>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  {/* Theme Selection */}
                  <Paper shadow="sm" p="md" withBorder>
                    <Group mb="md">
                      <IconPalette size={20} />
                      <Text fw={600}>Theme</Text>
                    </Group>

                    <Select
                      data={themes.map((t) => ({
                        value: t.value,
                        label: t.label,
                      }))}
                      value={selectedTheme}
                      onChange={updateTheme}
                      mb="md"
                    />

                    <Group gap="xs">
                      {themes.map((theme) => (
                        <Box
                          key={theme.value}
                          onClick={() => updateTheme(theme.value)}
                          style={{
                            width: 40,
                            height: 40,
                            background: theme.bg,
                            borderRadius: 8,
                            cursor: "pointer",
                            border:
                              selectedTheme === theme.value
                                ? "3px solid #228be6"
                                : "2px solid #ddd",
                          }}
                        />
                      ))}
                    </Group>
                  </Paper>
                </Grid.Col>
                {/* // Animation Section // */}
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Paper shadow="sm" p="md" withBorder>
                    <Group mb="md">
                      <IconBrandFunimation size={20} /> 
                      <Text fw={600}>Animation</Text>
                    </Group>

                    <Select
                      data={animationOptions.map((a) => ({
                        value: a.value,
                        label: a.label,
                      }))}
                      value={selectedAnimation}
                      onChange={updateAnimation}
                      mb="md"
                    />

                    <Group gap="xs" wrap="wrap">
                      {animationOptions.map((animation) => (
                        <Box
                          key={animation.value}
                          onClick={() => updateAnimation(animation.value)}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 8,
                            background: "#f8f9fa",
                            border:
                              selectedAnimation === animation.value
                                ? "3px solid #228be6"
                                : "2px solid #ddd",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            transition: "all 0.2s",
                          }}
                          title={animation.label}
                        >
                          {animation.icon}
                        </Box>
                      ))}
                    </Group>
                  </Paper>
                </Grid.Col>
              </Grid>
              {/* Profile Section */}

              {/* Add Link Section */}
              <Paper shadow="sm" p="md" withBorder>
                <Group mb="md">
                  <IconPlus size={20} />
                  <Text fw={600}>Add New Link</Text>
                </Group>

                <Stack gap="sm">
                  <Select
                    label="Social Network"
                    placeholder="Select social network"
                    data={SOCIALS.map((s) => ({
                      value: s.value,
                      label: s.label,
                      icon: s.icon,
                    }))}
                    value={newLink.title}
                    onChange={(value: any) =>
                      setNewLink({ ...newLink, title: value })
                    }
                  />

                  <TextInput
                    label="URL"
                    placeholder="Enter link URL"
                    value={newLink.url}
                    onChange={(e) =>
                      setNewLink({ ...newLink, url: e.currentTarget.value })
                    }
                    leftSection={<IconLink size={16} />}
                  />

                  <Button onClick={addLink} fullWidth>
                    Add Link
                  </Button>
                </Stack>
              </Paper>

              {/* Links List with Drag and Drop */}
              <Paper shadow="sm" p="md" withBorder>
                <Group mb="md">
                  <IconLink size={20} />
                  <Text fw={600}>Your Links</Text>
                  <Badge>{links.length}</Badge>
                </Group>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="links">
                    {(provided) => (
                      <Stack
                        gap="xs"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {links.map((link: any, index: number) => (
                          <Draggable
                            key={link.id}
                            draggableId={link.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                shadow="xs"
                                p="sm"
                                style={{
                                  ...provided.draggableProps.style,
                                  background: snapshot.isDragging
                                    ? "#f8f9fa"
                                    : "white",
                                }}
                              >
                                <Group wrap="nowrap">
                                  <div {...provided.dragHandleProps}>
                                    <IconGripVertical
                                      size={20}
                                      style={{ cursor: "grab" }}
                                    />
                                  </div>
                                  <Stack gap={0} style={{ flex: 1 }}>
                                    <Text size="sm" fw={500}>
                                      {link?.title}
                                    </Text>
                                    <Text size="xs" c="dimmed" truncate>
                                      {link?.url}
                                    </Text>
                                  </Stack>
                                  <ActionIcon
                                    color="red"
                                    variant="subtle"
                                    onClick={() => deleteLink(link?.id)}
                                  >
                                    <IconTrash size={16} />
                                  </ActionIcon>
                                </Group>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Stack>
                    )}
                  </Droppable>
                </DragDropContext>
              </Paper>
            </Stack>
          </Grid.Col>

          {/* Right Side - Mobile Preview */}
          <Grid.Col span={{ base: 12, md: 4 }} ff={`var(--font-${selectedFont}), sans-serif`}>
            <Box pos="sticky" style={{ top: 20 }}>
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
                    p="xl"
                    style={{
                      height: "100%",
                      overflowY: "auto",
                      color: currentTheme.text,
                    }}
                  >
                    <Stack align="center" gap="md">
                      <motion.div
                        key={`avatar-${selectedAnimation}`}
                        {...getAnimationVariants(selectedAnimation)}
                      >
                        <Avatar src={profile?.avatar_url} size={80} radius="xl" />
                      </motion.div>
                      <motion.div
                        key={`name-${selectedAnimation}`}
                        {...getAnimationVariants(selectedAnimation)}
                      >
                        <Stack gap={4} align="center">
                          <Text size="xl" fw={700}>
                            {profile?.display_name || "Your Name"}
                          </Text>
                          <Text size="sm" opacity={0.8}>
                            @{profile?.username || "username"}
                          </Text>
                          <Text size="sm" ta="center" opacity={0.9}>
                            {profile?.bio || "Your bio goes here"}
                          </Text>
                        </Stack>
                      </motion.div>

                      <Stack gap="sm" style={{ width: "100%" }} mt="md">
                        {links.map((link: any, index: number) => {
                          const animationVariants = getAnimationVariants(selectedAnimation);
                          // Add stagger delay for links
                          const staggerDelay = selectedAnimation !== "none" ? index * 0.1 : 0;
                          
                          return (
                            <motion.div
                              key={`${link?.id}-${selectedAnimation}`}
                              initial={animationVariants.initial}
                              animate={animationVariants.animate}
                              transition={{
                                ...animationVariants.transition,
                                delay: staggerDelay,
                              }}
                              style={{ width: "100%" }}
                            >
                              <Button
                                component="a"
                                href={link?.url}
                                target="_blank"
                                fullWidth
                                size="lg"
                                radius="xl"
                                style={{
                                  background: currentTheme.button,
                                  color: currentTheme.buttonText,
                                  border: "none",
                                }}
                              >
                                {link?.title}
                              </Button>
                            </motion.div>
                          );
                        })}
                      </Stack>
                    </Stack>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </AppShellLayout>
  );
}
