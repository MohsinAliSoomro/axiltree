"use client";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
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
} from "@tabler/icons-react";
import { createClient } from "../../lib/supabase/client";
import AppShellLayout from "../../components/layout";
import { User } from "@supabase/supabase-js";
import { themesArray } from "@/app/utils/theme";

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

const themes = themesArray

export default function LinkTreeDashboard({ user }: { user: User | null }) {
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any>([]);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [selectedTheme, setSelectedTheme] = useState("default");
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

  const currentTheme =
    themes.find((t) => t.value === selectedTheme) || themes[0];

  return (
    <AppShellLayout>
      <Container size="xl" py="md">
        <Grid gutter="lg">
          {/* Left Side - Editor */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack gap="md">
              <Grid>
                <Grid.Col span={{ base: 12, md: 8 }}>
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
                          />
                          <TextInput
                            placeholder="@username"
                            value={profile?.username || ""}
                            onChange={(e) =>
                              updateProfile("username", e.target.value)
                            }
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
          <Grid.Col span={{ base: 12, md: 4 }}>
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
                      <Avatar src={profile?.avatar_url} size={80} radius="xl" />
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

                      <Stack gap="sm" style={{ width: "100%" }} mt="md">
                        {links.map((link: any) => (
                          <Button
                            key={link?.id}
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
                        ))}
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
