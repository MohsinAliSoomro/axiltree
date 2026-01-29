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
  Tabs,
  rem,
  ScrollArea,
} from "@mantine/core";
import {
  IconGripVertical,
  IconTrash,
  IconPlus,
  IconLink,
  IconUser,
  IconPalette,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandFacebook,
  IconEye,
} from "@tabler/icons-react";
import { createClient } from "../../lib/supabase/client";
import AppShellLayout from "../../components/layout";
import UsernameThemeSelector from "../../components/UsernameThemeSelector";
import { User } from "@supabase/supabase-js";
import { themesArray } from "@/app/utils/theme";
import { animationOptions, getAnimationVariants } from "@/app/utils/animations";
import { usernameThemes } from "@/app/utils/usernameThemes";

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
  { value: "inter", label: "Inter", css: "var(--font-inter)" },
  { value: "poppins", label: "Poppins", css: "var(--font-poppins)" },
  { value: "space", label: "Space Mono", css: "var(--font-space)" },
  { value: "quicksand", label: "Quicksand", css: "var(--font-quicksand)" },
  { value: "amarna", label: "Amarna", css: "var(--font-amarna)" },
  { value: "delius", label: "Delius", css: "var(--font-delius)" },
  { value: "borel", label: "Borel", css: "var(--font-borel)" },
  { value: "iceland", label: "Iceland", css: "var(--font-iceland)" },
];

const themes = themesArray;

export default function LinkTreeDashboard({ user }: { user: User | null }) {
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any>([]);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [selectedFont, setSelectedFont] = useState("inter");
  const [selectedAnimation, setSelectedAnimation] = useState("none");
  const [selectedUsernameTheme, setSelectedUsernameTheme] = useState("default");
  const [activeTab, setActiveTab] = useState("profile");
  const supabase = createClient();

  useEffect(() => {
    loadData();

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
      setSelectedUsernameTheme(profileData.username_theme || "default");
    }

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

  const updateUsernameTheme = async (theme: any) => {
    setSelectedUsernameTheme(theme);
    await updateProfile("username_theme", theme);
  };

  const currentTheme =
    themes.find((t) => t.value === selectedTheme) || themes[0];

  const currentUsernameTheme =
    usernameThemes.find((t) => t.value === selectedUsernameTheme) ||
    usernameThemes[0];

  return (
    <AppShellLayout>
      <Box
        style={{
          background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
          height: "calc(100vh - 60px)",
          overflow: "hidden",
        }}
      >
        <Container size="xl" h="100%">
          <Grid gutter="md" h="100%">
            {/* Left Side - Tabbed Editor */}
            <Grid.Col span={{ base: 12, lg: 8 }} h="100%">
              <Paper
                shadow="md"
                radius="lg"
                h="100%"
                style={{
                  border: "1px solid #e9ecef",
                  background: "white",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Tabs
                  value={activeTab}
                  onChange={setActiveTab}
                  style={{ height: "100%", display: "flex", flexDirection: "column" }}
                >
                  <Tabs.List>
                    <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
                      Profile
                    </Tabs.Tab>
                    <Tabs.Tab value="design" leftSection={<IconPalette size={16} />}>
                      Design
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="links"
                      leftSection={<IconLink size={16} />}
                      rightSection={
                        <Badge size="sm" variant="filled" color="violet">
                          {links.length}
                        </Badge>
                      }
                    >
                      Links
                    </Tabs.Tab>
                  </Tabs.List>

                  <Box style={{ flex: 1, overflow: "hidden" }}>
                    <ScrollArea h="calc(100vh - 180px)" p="lg">
                      {/* Profile Tab */}
                      <Tabs.Panel value="profile">
                        <Stack gap="lg">
                          <Group wrap="nowrap" align="flex-start">
                            <Avatar
                              src={profile?.avatar_url}
                              size={80}
                              radius="xl"
                              style={{ border: "3px solid #667eea" }}
                            />
                            <Stack gap="sm" style={{ flex: 1 }}>
                              <TextInput
                                placeholder="Display Name"
                                value={profile?.full_name || ""}
                                onChange={(e) =>
                                  updateProfile("full_name", e.target.value)
                                }
                                disabled
                                size="md"
                              />
                              <TextInput
                                placeholder="@username"
                                value={profile?.username || ""}
                                onChange={(e) =>
                                  updateProfile("username", e.target.value)
                                }
                                disabled
                                size="md"
                              />
                            </Stack>
                          </Group>
                          <Textarea
                            placeholder="Tell your story..."
                            value={profile?.bio || ""}
                            onChange={(e) => updateProfile("bio", e.target.value)}
                            minRows={4}
                            size="md"
                          />
                        </Stack>
                      </Tabs.Panel>

                      {/* Design Tab */}
                      <Tabs.Panel value="design">
                        <Stack gap="lg">
                          {/* Theme and Font Row */}
                          <Grid gutter="md">
                            <Grid.Col span={6}>
                              <Stack gap="sm">
                                <Text size="sm" fw={600}>
                                  Theme
                                </Text>
                                <Select
                                  data={themes.map((t) => ({
                                    value: t.value,
                                    label: t.label,
                                  }))}
                                  value={selectedTheme}
                                  onChange={updateTheme}
                                  size="sm"
                                />
                                <Group gap="xs">
                                  {themes.slice(0, 8).map((theme) => (
                                    <Box
                                      key={theme.value}
                                      onClick={() => updateTheme(theme.value)}
                                      style={{
                                        width: 36,
                                        height: 36,
                                        background: theme.bg,
                                        borderRadius: rem(8),
                                        cursor: "pointer",
                                        border:
                                          selectedTheme === theme.value
                                            ? "3px solid #667eea"
                                            : "2px solid #dee2e6",
                                      }}
                                    />
                                  ))}
                                </Group>
                              </Stack>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <Stack gap="sm">
                                <Text size="sm" fw={600}>
                                  Font
                                </Text>
                                <Select
                                  data={fontOptions.map((f) => ({
                                    value: f.value,
                                    label: f.label,
                                  }))}
                                  value={selectedFont}
                                  onChange={updateFont}
                                  size="sm"
                                />
                              </Stack>
                            </Grid.Col>
                          </Grid>

                          {/* Animation and Username Theme Row */}
                          <Grid gutter="md">
                            <Grid.Col span={6}>
                              <Stack gap="sm">
                                <Text size="sm" fw={600}>
                                  Animation
                                </Text>
                                <Select
                                  data={animationOptions.map((a) => ({
                                    value: a.value,
                                    label: a.label,
                                  }))}
                                  value={selectedAnimation}
                                  onChange={updateAnimation}
                                  size="sm"
                                />
                                <Group gap="xs">
                                  {animationOptions.slice(0, 8).map((animation) => (
                                    <Box
                                      key={animation.value}
                                      onClick={() => updateAnimation(animation.value)}
                                      style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: rem(8),
                                        background: "#f8f9fa",
                                        border:
                                          selectedAnimation === animation.value
                                            ? "3px solid #667eea"
                                            : "2px solid #dee2e6",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "16px",
                                      }}
                                      title={animation.label}
                                    >
                                      {animation.icon}
                                    </Box>
                                  ))}
                                </Group>
                              </Stack>
                            </Grid.Col>
                            <Grid.Col span={6}>
                              <UsernameThemeSelector
                                selectedTheme={selectedUsernameTheme}
                                onThemeChange={updateUsernameTheme}
                              />
                            </Grid.Col>
                          </Grid>
                        </Stack>
                      </Tabs.Panel>

                      {/* Links Tab */}
                      <Tabs.Panel value="links">
                        <Stack gap="lg">
                          {/* Add Link Form */}
                          <Box>
                            <Text size="sm" fw={600} mb="sm">
                              Add New Link
                            </Text>
                            <Stack gap="sm">
                              <Group wrap="nowrap">
                                <Select
                                  placeholder="Platform"
                                  data={SOCIALS.map((s) => ({
                                    value: s.value,
                                    label: s.label,
                                  }))}
                                  value={newLink.title}
                                  onChange={(value: any) =>
                                    setNewLink({ ...newLink, title: value })
                                  }
                                  size="sm"
                                  style={{ flex: 1 }}
                                />
                                <TextInput
                                  placeholder="URL"
                                  value={newLink.url}
                                  onChange={(e) =>
                                    setNewLink({ ...newLink, url: e.currentTarget.value })
                                  }
                                  leftSection={<IconLink size={14} />}
                                  size="sm"
                                  style={{ flex: 2 }}
                                />
                                <Button
                                  onClick={addLink}
                                  size="sm"
                                  variant="gradient"
                                  gradient={{ from: "violet", to: "grape" }}
                                  leftSection={<IconPlus size={16} />}
                                >
                                  Add
                                </Button>
                              </Group>
                            </Stack>
                          </Box>

                          {/* Links List */}
                          <Box>
                            <Text size="sm" fw={600} mb="sm">
                              Your Links ({links.length})
                            </Text>
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
                                            radius="md"
                                            style={{
                                              ...provided.draggableProps.style,
                                              background: snapshot.isDragging
                                                ? "#f8f9fa"
                                                : "white",
                                              border: snapshot.isDragging
                                                ? "2px solid #667eea"
                                                : "1px solid #e9ecef",
                                            }}
                                          >
                                            <Group wrap="nowrap" gap="sm">
                                              <div {...provided.dragHandleProps}>
                                                <IconGripVertical
                                                  size={18}
                                                  style={{
                                                    cursor: "grab",
                                                    color: "#868e96",
                                                  }}
                                                />
                                              </div>
                                              <Stack gap={0} style={{ flex: 1 }}>
                                                <Text size="sm" fw={600}>
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
                                                size="md"
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
                          </Box>
                        </Stack>
                      </Tabs.Panel>
                    </ScrollArea>
                  </Box>
                </Tabs>
              </Paper>
            </Grid.Col>

            {/* Right Side - Fixed Preview */}
            <Grid.Col
              span={{ base: 12, lg: 4 }}
              h="100%"
              ff={`var(--font-${selectedFont}), sans-serif`}
            >
              <Paper
                shadow="md"
                p="md"
                radius="lg"
                h="100%"
                style={{
                  border: "1px solid #e9ecef",
                  background: "white",
                }}
              >
                <Group mb="md" gap="xs">
                  <IconEye size={18} />
                  <Text size="sm" fw={600}>
                    Live Preview
                  </Text>
                </Group>

                {/* Mobile Frame */}
                <Box
                  style={{
                    width: "100%",
                    maxWidth: 320,
                    height: "calc(100vh - 200px)",
                    margin: "0 auto",
                    border: "10px solid #1a1a1a",
                    borderRadius: rem(28),
                    overflow: "hidden",
                    background: currentTheme.bg,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                  }}
                >
                  <ScrollArea h="100%">
                    <Box
                      p="md"
                      style={{
                        color: currentTheme.text,
                      }}
                    >
                      <Stack align="center" gap="sm">
                        <Avatar
                          src={profile?.avatar_url}
                          size={64}
                          radius="xl"
                          style={{
                            border: "2px solid rgba(255,255,255,0.3)",
                            marginTop: rem(12),
                          }}
                        />
                        <Stack gap={2} align="center">
                          <Text size="md" fw={700}>
                            {profile?.display_name || "Your Name"}
                          </Text>
                          <Text
                            size="xs"
                            opacity={0.8}
                            style={{
                              background: currentUsernameTheme.color.includes(
                                "gradient"
                              )
                                ? currentUsernameTheme.color
                                : undefined,
                              color: currentUsernameTheme.color.includes(
                                "gradient"
                              )
                                ? "transparent"
                                : currentUsernameTheme.color,
                              WebkitBackgroundClip:
                                currentUsernameTheme.color.includes("gradient")
                                  ? "text"
                                  : undefined,
                              WebkitTextFillColor:
                                currentUsernameTheme.color.includes("gradient")
                                  ? "transparent"
                                  : undefined,
                            }}
                          >
                            @{profile?.username || "username"}
                          </Text>
                          <Text size="xs" ta="center" opacity={0.85} px="sm">
                            {profile?.bio || "Your bio goes here"}
                          </Text>
                        </Stack>

                        <Stack gap="xs" style={{ width: "100%" }} mt="sm">
                          {links.map((link: any, index: number) => {
                            const animationVariants =
                              getAnimationVariants(selectedAnimation);
                            const staggerDelay =
                              selectedAnimation !== "none" ? index * 0.1 : 0;

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
                                  size="sm"
                                  radius="xl"
                                  style={{
                                    background: currentTheme.button,
                                    color: currentTheme.buttonText,
                                    border: "none",
                                    fontWeight: 600,
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
                  </ScrollArea>
                </Box>
              </Paper>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
    </AppShellLayout>
  );
}