"use client";
import { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Tabs,
  rem,
  ScrollArea,
  Text,
  Badge,
  Group,
  SimpleGrid,
} from "@mantine/core";
import { 
  IconUser, 
  IconPalette, 
  IconLink 
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { createClient } from "../../lib/supabase/client";
import AppShellLayout from "../../components/layout";
import UsernameThemeSelector from "../../components/UsernameThemeSelector";
import { User } from "@supabase/supabase-js";
import FontSelector from "./components/FontSelector";
import ProfileInfo from "./components/ProfileInfo";
import ThemeSelector from "./components/ThemeSelector";
import AnimationSelector from "./components/AnimationSelector";
import AddLinkForm from "./components/AddLinkForm";
import LinksList from "./components/LinksList";
import AddContentBlockForm from "./components/AddContentBlockForm";
import ContentBlocksList from "./components/ContentBlocksList";
import MobilePreview from "./components/MobilePreview";
import TemplateMarketplace from "./components/TemplateMarketplace";
import { type ProfileTemplate } from "@/app/utils/templates";
import LayoutSelector from "./components/LayoutSelector";
import { type ContentBlockType } from "@/app/utils/contentBlocks";


export default function LinkTreeDashboard({ user }: { user: User | null }) {
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any>([]);
  const [contentBlocks, setContentBlocks] = useState<any[]>([]);
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [selectedFont, setSelectedFont] = useState("inter");
  const [selectedAnimation, setSelectedAnimation] = useState("none");
  const [selectedUsernameTheme, setSelectedUsernameTheme] = useState("default");
  const [selectedLayout, setSelectedLayout] = useState("stack");
  const [activeTab, setActiveTab] = useState("links");
  const isMobileEditor = useMediaQuery("(max-width: 62em)");
  const supabase = createClient();

  const tabMeta: Record<string, { title: string; description: string }> = {
    links: {
      title: "Links & Content",
      description: "Manage links, content blocks, and publishing status.",
    },
    theme: {
      title: "Theme Marketplace",
      description: "Apply ready-made visual styles quickly.",
    },
    design: {
      title: "Design Settings",
      description: "Customize layout, colors, animation, and typography.",
    },
    profile: {
      title: "Profile Info",
      description: "Update your profile and public identity details.",
    },
  };
  
  useEffect(() => {
    loadData();

    const channel = supabase
      .channel("links-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "links" },
        handleRealtimeUpdate
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profile_blocks" },
        handleBlockRealtimeUpdate
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
      setSelectedLayout(profileData.layout || "stack");
    }

    const { data: linksData } = await supabase
      .from("links")
      .select("*")
      .eq("profile_id", user?.id)
      .order("position");

    if (linksData) {
      setLinks(linksData as any);
    }

    const { data: blocksData } = await supabase
      .from("profile_blocks")
      .select("*")
      .eq("profile_id", user?.id)
      .order("position");

    if (blocksData) {
      setContentBlocks(blocksData as any[]);
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

  const handleBlockRealtimeUpdate = (payload: any) => {
    if (payload.eventType === "INSERT") {
      setContentBlocks((prev: any) =>
        [...prev, payload.new].sort((a, b) => a.position - b.position)
      );
    } else if (payload.eventType === "UPDATE") {
      setContentBlocks((prev: any) =>
        prev.map((block: any) =>
          block.id === payload.new.id ? payload.new : block
        )
      );
    } else if (payload.eventType === "DELETE") {
      setContentBlocks((prev: any) =>
        prev.filter((block: any) => block.id !== payload.old.id)
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

  const handleBlockDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(contentBlocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedBlocks: any[] = items.map((block, index) => ({
      ...block,
      position: index,
    }));

    setContentBlocks(updatedBlocks);
    await supabase.from("profile_blocks").upsert(updatedBlocks);
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

  const addLink = async ({
    title,
    url,
    publishAt,
    expireAt,
  }: {
    title: string;
    url: string;
    publishAt?: string | null;
    expireAt?: string | null;
  }) => {
    if (!title || !url) return;
    if (!validateUrl(title, url)) {
      alert("Please enter a valid URL for the selected social network.");
      return;
    }

    if (publishAt && expireAt && new Date(expireAt) <= new Date(publishAt)) {
      alert("Expiry date must be after publish date.");
      return;
    }

    const linkData = {
      profile_id: user?.id,
      title,
      url,
      position: links.length,
      is_active: true,
      publish_at: publishAt ?? null,
      expire_at: expireAt ?? null,
    };
    const { data, error } = await supabase
      .from("links")
      .insert([linkData])
      .select("*");
    if (data) {
      setLinks([...links, data[0]] as any);
    }
  };

  const addContentBlock = async ({
    type,
    title,
    isActive,
    publishAt,
    expireAt,
    contentJson,
  }: {
    type: ContentBlockType;
    title: string;
    isActive: boolean;
    publishAt?: string | null;
    expireAt?: string | null;
    contentJson: {
      text?: string;
      url?: string;
      embedUrl?: string;
      images?: string[];
    };
  }) => {
    if (publishAt && expireAt && new Date(expireAt) <= new Date(publishAt)) {
      alert("Expiry date must be after publish date.");
      return;
    }

    const blockData = {
      profile_id: user?.id,
      type,
      title: title || null,
      content_json: contentJson,
      position: contentBlocks.length,
      is_active: isActive,
      publish_at: publishAt ?? null,
      expire_at: expireAt ?? null,
    };

    const { data } = await supabase
      .from("profile_blocks")
      .insert([blockData])
      .select("*");

    if (data?.[0]) {
      setContentBlocks((prev) => [...prev, data[0]]);
    }
  };

  const deleteLink = async (id: any) => {
    await supabase.from("links").delete().eq("id", id);
    setLinks(links.filter((link: any) => link?.id !== id));
  };

  const updateLinkLiveStatus = async (id: string, isLive: boolean) => {
    setLinks((prev: any[]) =>
      prev.map((link: any) =>
        link.id === id ? { ...link, is_active: isLive } : link
      )
    );

    const { error } = await supabase
      .from("links")
      .update({ is_active: isLive })
      .eq("id", id);

    if (error) {
      setLinks((prev: any[]) =>
        prev.map((link: any) =>
          link.id === id ? { ...link, is_active: !isLive } : link
        )
      );
      alert("Failed to update link status. Please try again.");
    }
  };

  const deleteContentBlock = async (id: string) => {
    await supabase.from("profile_blocks").delete().eq("id", id);
    setContentBlocks((prev) => prev.filter((block: any) => block.id !== id));
  };

  const updateBlockLiveStatus = async (id: string, isLive: boolean) => {
    setContentBlocks((prev: any[]) =>
      prev.map((block: any) =>
        block.id === id ? { ...block, is_active: isLive } : block
      )
    );

    const { error } = await supabase
      .from("profile_blocks")
      .update({ is_active: isLive })
      .eq("id", id);

    if (error) {
      setContentBlocks((prev: any[]) =>
        prev.map((block: any) =>
          block.id === id ? { ...block, is_active: !isLive } : block
        )
      );
      alert("Failed to update content block status. Please try again.");
    }
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

  const updateLayout = async (layout: string) => {
    setSelectedLayout(layout);
    await updateProfile("layout", layout);
  };

  const applyTemplate = async (template: ProfileTemplate) => {
    setSelectedTheme(template.theme);
    setSelectedFont(template.font);
    setSelectedAnimation(template.animation);
    setSelectedUsernameTheme(template.usernameTheme);

    setProfile((prev: any) => ({
      ...prev,
      theme: template.theme,
      font: template.font,
      animation: template.animation,
      username_theme: template.usernameTheme,
    }));

    await supabase
      .from("profiles")
      .update({
        theme: template.theme,
        font: template.font,
        animation: template.animation,
        username_theme: template.usernameTheme,
      })
      .eq("id", user?.id);
  };

  return (
    <AppShellLayout>
      <Box
        style={{
          background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
          height: "calc(100vh - 60px)",
          overflow: "hidden",
        }}
      >
        <Grid gutter="md" h="100%">
          {/* Left Side - Tabbed Editor */}
          <Grid.Col span={{ base: 12, lg: 8 }} h="100%">
            <Box
              h="100%"
              style={{
                border: "1px solid #e9ecef",
                background: "white",
                display: "flex",
                flexDirection: "column",
                borderRadius: rem(8),
                overflow: "hidden",
              }}
            >
              <Tabs
                value={activeTab}
                onChange={(value)=>setActiveTab(value as string)}
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: isMobileEditor ? "column" : "row",
                }}
              >
                <Tabs.List
                  style={{
                    width: isMobileEditor ? "100%" : 220,
                    minWidth: isMobileEditor ? "100%" : 220,
                    padding: isMobileEditor ? "10px" : "12px 10px",
                    borderRight: isMobileEditor ? "none" : "1px solid #e9ecef",
                    borderBottom: isMobileEditor ? "1px solid #e9ecef" : "none",
                    background: "linear-gradient(180deg, #f7f8ff 0%, #ffffff 100%)",
                    display: "flex",
                    flexDirection: isMobileEditor ? "row" : "column",
                    flexWrap: isMobileEditor ? "wrap" : "nowrap",
                    gap: 6,
                  }}
                >
                  {!isMobileEditor && (
                    <Box
                      style={{
                        padding: "8px 8px 12px",
                        marginBottom: 6,
                        borderBottom: "1px dashed #e5e7eb",
                      }}
                    >
                      <Text fw={700} size="sm">
                        Editor
                      </Text>
                      <Text size="xs" c="dimmed">
                        Build and style your page from this sidebar.
                      </Text>
                    </Box>
                  )}
                   <Tabs.Tab
                    value="links"
                    leftSection={<IconLink size={16} />}
                    style={{
                      justifyContent: "flex-start",
                      borderRadius: rem(10),
                      flex: isMobileEditor ? "1 1 45%" : undefined,
                    }}
                  >
                    Links
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="theme"
                    leftSection={<IconPalette size={16} />}
                    style={{
                      justifyContent: "flex-start",
                      borderRadius: rem(10),
                      flex: isMobileEditor ? "1 1 45%" : undefined,
                    }}
                  >
                    Theme
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="design"
                    leftSection={<IconPalette size={16} />}
                    style={{
                      justifyContent: "flex-start",
                      borderRadius: rem(10),
                      flex: isMobileEditor ? "1 1 45%" : undefined,
                    }}
                  >
                    Design
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="profile"
                    leftSection={<IconUser size={16} />}
                    style={{
                      justifyContent: "flex-start",
                      borderRadius: rem(10),
                      flex: isMobileEditor ? "1 1 45%" : undefined,
                    }}
                  >
                    Profile
                  </Tabs.Tab>
                  
                 
                </Tabs.List>

                <Box style={{ flex: 1, overflow: "hidden" }}>
                  <ScrollArea h="100%" p="lg">
                    <Box pb={80}>
                      <Box
                        mb="md"
                        style={{
                          border: "1px solid #eef0f4",
                          borderRadius: rem(12),
                          padding: "10px 12px",
                          background: "#fafbff",
                        }}
                      >
                        <Text fw={700} size="sm">
                          {tabMeta[activeTab]?.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {tabMeta[activeTab]?.description}
                        </Text>
                      </Box>

                      {/* Profile Tab */}
                      <Tabs.Panel value="profile">
                        <ProfileInfo 
                          profile={profile} 
                          updateProfile={updateProfile} 
                        />
                      </Tabs.Panel>

                      {/* Theme Tab */}
                      <Tabs.Panel value="theme">
                        <TemplateMarketplace onApplyTemplate={applyTemplate} />

                      </Tabs.Panel>

                      {/* Design Tab */}
                      <Tabs.Panel value="design">
                        <LayoutSelector
                          selectedLayout={selectedLayout}
                          updateLayout={updateLayout}
                        />

                        <ThemeSelector 
                          selectedTheme={selectedTheme} 
                          updateTheme={updateTheme} 
                        />

                        <UsernameThemeSelector
                          selectedTheme={selectedUsernameTheme}
                          onThemeChange={updateUsernameTheme}
                        />

                        <AnimationSelector 
                          selectedAnimation={selectedAnimation} 
                          updateAnimation={updateAnimation} 
                        />
                        
                        <Box mt="md">
                          <FontSelector
                            selectedFont={selectedFont} 
                            updateFont={updateFont} 
                          />
                        </Box>
                      </Tabs.Panel>

                      {/* Links Tab */}
                      <Tabs.Panel value="links">
                      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                        <Box
                          style={{
                            border: "1px solid #eef0f4",
                            borderRadius: rem(12),
                            padding: "12px",
                            background: "#fcfcff",
                          }}
                        >
                          <Group justify="space-between" mb="sm">
                            <Text fw={700} size="sm">
                              Link Actions
                            </Text>
                            <Badge variant="light" color="violet">
                              {links.length} links
                            </Badge>
                          </Group>
                          <AddLinkForm addLink={addLink} />
                        </Box>

                        <Box
                          style={{
                            border: "1px solid #eef0f4",
                            borderRadius: rem(12),
                            padding: "12px",
                            background: "#fcfcff",
                          }}
                        >
                          <Group justify="space-between" mb="sm">
                            <Text fw={700} size="sm">
                              Content Blocks
                            </Text>
                            <Badge variant="light" color="grape">
                              {contentBlocks.length} blocks
                            </Badge>
                          </Group>
                          <AddContentBlockForm addContentBlock={addContentBlock} />
                        </Box>
                      </SimpleGrid>

                      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mt="md">
                        <Box
                          style={{
                            border: "1px solid #eef0f4",
                            borderRadius: rem(12),
                            padding: "12px",
                            background: "#ffffff",
                          }}
                        >
                          <Text fw={700} size="sm" mb="sm">
                            Manage Links
                          </Text>
                          <LinksList 
                            links={links} 
                            handleDragEnd={handleDragEnd} 
                            deleteLink={deleteLink}
                            updateLinkLiveStatus={updateLinkLiveStatus}
                          />
                        </Box>

                        <Box
                          style={{
                            border: "1px solid #eef0f4",
                            borderRadius: rem(12),
                            padding: "12px",
                            background: "#ffffff",
                          }}
                        >
                          <Text fw={700} size="sm" mb="sm">
                            Arrange Content Blocks
                          </Text>
                          <ContentBlocksList
                            blocks={contentBlocks}
                            handleDragEnd={handleBlockDragEnd}
                            deleteBlock={deleteContentBlock}
                            updateBlockLiveStatus={updateBlockLiveStatus}
                          />
                        </Box>
                      </SimpleGrid>
                    </Tabs.Panel>
                    </Box>
                  </ScrollArea>
                </Box>
              </Tabs>
            </Box>
          </Grid.Col>

          {/* Right Side - Fixed Preview */}
          <Grid.Col
            span={{ base: 12, lg: 4 }}
            h="100%"
          >
            <MobilePreview 
              profile={profile}
              links={links}
              contentBlocks={contentBlocks}
              selectedTheme={selectedTheme}
              selectedFont={selectedFont}
              selectedAnimation={selectedAnimation}
              selectedUsernameTheme={selectedUsernameTheme}
              selectedLayout={selectedLayout}
            />
          </Grid.Col>
        </Grid>
      </Box>
    </AppShellLayout>
  );
}
