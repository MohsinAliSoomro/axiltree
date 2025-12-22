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
  Title,
  ColorPicker,
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
} from "@tabler/icons-react";
import { createClient } from "../../lib/supabase/client";
import AppShellLayout from "../../components/layout";

// Mock Supabase client - Replace with actual Supabase setup
const createMockSupabase = () => {
  let mockData = {
    profile: {
      id: "1",
      username: "johndoe",
      display_name: "John Doe",
      bio: "Digital Creator | Tech Enthusiast",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      theme: "default",
    },
    links: [
      {
        id: "1",
        title: "My Website",
        url: "https://example.com",
        position: 0,
        is_active: true,
      },
      {
        id: "2",
        title: "Instagram",
        url: "https://instagram.com",
        position: 1,
        is_active: true,
      },
      {
        id: "3",
        title: "YouTube Channel",
        url: "https://youtube.com",
        position: 2,
        is_active: true,
      },
    ],
  };

  return {
    from: (table: any) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: mockData.profile, error: null }),
          order: () => Promise.resolve({ data: mockData.links, error: null }),
        }),
      }),
      update: (data: any) => ({
        eq: async () => {
          mockData.profile = { ...mockData.profile, ...data };
          return { data: mockData.profile, error: null };
        },
      }),
      insert: async (data: any) => {
        const newLink = { ...data[0], id: Date.now().toString() };
        mockData.links.push(newLink);
        return { data: [newLink], error: null };
      },
      delete: () => ({
        eq: async (field: any, value: any) => {
          mockData.links = mockData.links.filter((l) => l.id !== value);
          return { error: null };
        },
      }),
      upsert: async (data: any) => {
        data.forEach((item: any) => {
          const index = mockData.links.findIndex((l) => l.id === item.id);
          if (index !== -1) {
            mockData.links[index] = item;
          }
        });
        return { error: null };
      },
    }),
    channel: () => ({
      on: () => ({ subscribe: () => ({}) }),
      subscribe: () => ({}),
    }),
  };
};

const themes = [
  {
    value: "default",
    label: "Default",
    bg: "#ffffff",
    text: "#000000",
    button: "#000000",
    buttonText: "#ffffff",
  },
  {
    value: "dark",
    label: "Dark Mode",
    bg: "#1a1a1a",
    text: "#ffffff",
    button: "#ffffff",
    buttonText: "#000000",
  },
  {
    value: "gradient",
    label: "Gradient",
    bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    text: "#ffffff",
    button: "#ffffff",
    buttonText: "#667eea",
  },
  {
    value: "ocean",
    label: "Ocean",
    bg: "#e0f7ff",
    text: "#003d5c",
    button: "#0077b6",
    buttonText: "#ffffff",
  },
  {
    value: "sunset",
    label: "Sunset",
    bg: "#fff5e6",
    text: "#d64545",
    button: "#ff6b6b",
    buttonText: "#ffffff",
  },
  {
    value: "forest",
    label: "Forest",
    bg: "#f0f7f4",
    text: "#1b4332",
    button: "#2d6a4f",
    buttonText: "#ffffff",
  },
  {
    value: "neon",
    label: "Neon",
    bg: "#0a0a0a",
    text: "#00ff88",
    button: "#00ff88",
    buttonText: "#000000",
  },
];

export default function LinkTreeDashboard({ user }: { user: User | null }) {
  // console.log("LinkTreeDashboard user:", user);
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
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
      .eq("id", user.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      setSelectedTheme(profileData.theme || "default");
    }

    // Load links
    const { data: linksData } = await supabase
      .from("links")
      .select("*")
      .eq("profile_id", "1")
      .order("position");

    if (linksData) {
      setLinks(linksData);
    }
  };
  console.log({ profile });
  const handleRealtimeUpdate = (payload: any) => {
    if (payload.eventType === "INSERT") {
      setLinks((prev) =>
        [...prev, payload.new].sort((a, b) => a.position - b.position)
      );
    } else if (payload.eventType === "UPDATE") {
      setLinks((prev) =>
        prev.map((link) => (link.id === payload.new.id ? payload.new : link))
      );
    } else if (payload.eventType === "DELETE") {
      setLinks((prev) => prev.filter((link) => link.id !== payload.old.id));
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedLinks = items.map((link, index) => ({
      ...link,
      position: index,
    }));

    setLinks(updatedLinks);

    // Update positions in database
    await supabase.from("links").upsert(updatedLinks);
  };

  const addLink = async () => {
    if (!newLink.title || !newLink.url) return;

    const linkData = {
      profile_id: "1",
      title: newLink.title,
      url: newLink.url,
      position: links.length,
      is_active: true,
    };

    const { data } = await supabase.from("links").insert([linkData]);
    if (data) {
      setLinks([...links, data[0]]);
      setNewLink({ title: "", url: "" });
    }
  };

  const deleteLink = async (id: any) => {
    await supabase.from("links").delete().eq("id", id);
    setLinks(links.filter((link) => link?.id !== id));
  };

  const updateProfile = async (field: any, value: any) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    await supabase
      .from("profiles")
      .update({ [field]: value })
      .eq("id", "1");
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
        <Title order={1} mb="xl" ta="center">
          LinkTree Dashboard
        </Title>

        <Grid gutter="lg">
          {/* Left Side - Editor */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Stack gap="md">
              {/* Profile Section */}
              <Paper shadow="sm" p="md" withBorder>
                <Group mb="md">
                  <IconUser size={20} />
                  <Text fw={600}>Profile Information</Text>
                </Group>

                <Stack gap="sm">
                  <Group>
                    <Avatar src={profile?.avatar_url} size="lg" radius="xl" />
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

              {/* Theme Selection */}
              <Paper shadow="sm" p="md" withBorder>
                <Group mb="md">
                  <IconPalette size={20} />
                  <Text fw={600}>Theme</Text>
                </Group>

                <Select
                  data={themes.map((t) => ({ value: t.value, label: t.label }))}
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

              {/* Add Link Section */}
              <Paper shadow="sm" p="md" withBorder>
                <Group mb="md">
                  <IconPlus size={20} />
                  <Text fw={600}>Add New Link</Text>
                </Group>

                <Stack gap="sm">
                  <TextInput
                    placeholder="Link Title"
                    value={newLink.title}
                    onChange={(e) =>
                      setNewLink({ ...newLink, title: e.target.value })
                    }
                    leftSection={<IconLink size={16} />}
                  />
                  <TextInput
                    placeholder="URL"
                    value={newLink.url}
                    onChange={(e) =>
                      setNewLink({ ...newLink, url: e.target.value })
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
                        {links.map((link, index) => (
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
          <Grid.Col span={{ base: 12, md: 6 }}>
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
                        {links.map((link) => (
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
