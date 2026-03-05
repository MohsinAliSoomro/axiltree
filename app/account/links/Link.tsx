"use client";
import { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Tabs,
  rem,
  Text,
  Badge,
  Group,
  SimpleGrid,
  Button,
  Modal,
  Stack,
} from "@mantine/core";
import { 
  IconUser, 
  IconPalette, 
  IconLink 
} from "@tabler/icons-react";
import { IconPlus, IconArrowLeft, IconStack2, IconUpload } from "@tabler/icons-react";
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
import BulkImportProducts from "./components/BulkImportProducts";
import ProductsList from "./components/ProductsList";
import MobilePreview from "./components/MobilePreview";
import TemplateMarketplace from "./components/TemplateMarketplace";
import { type ProfileTemplate } from "@/app/utils/templates";
import LayoutSelector from "./components/LayoutSelector";
import { type ContentBlockType } from "@/app/utils/contentBlocks";


export default function LinkTreeDashboard({ user }: { user: User | null }) {
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any>([]);
  const [contentBlocks, setContentBlocks] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [selectedFont, setSelectedFont] = useState("inter");
  const [selectedAnimation, setSelectedAnimation] = useState("none");
  const [selectedUsernameTheme, setSelectedUsernameTheme] = useState("default");
  const [selectedLayout, setSelectedLayout] = useState("stack");
  const [activeTab, setActiveTab] = useState("links");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [createTarget, setCreateTarget] = useState<"link" | "block" | null>(null);
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

    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("profile_id", user?.id)
      .order("position");

    if (productsData) {
      setProducts(productsData as any[]);
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

  const handleProductDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedProducts: any[] = items.map((product, index) => ({
      ...product,
      position: index,
    }));

    setProducts(updatedProducts);
    await supabase.from("products").upsert(updatedProducts);
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
        case "YouTube":
          return (
            parsed.hostname.includes("youtube.com") ||
            parsed.hostname.includes("youtu.be")
          );
        case "LinkedIn":
          return parsed.hostname.includes("linkedin.com");
        case "Snapchat":
          return parsed.hostname.includes("snapchat.com");
        case "Telegram":
          return (
            parsed.hostname.includes("t.me") ||
            parsed.hostname.includes("telegram.me") ||
            parsed.hostname.includes("telegram.org")
          );
        case "Website":
          return !!parsed.hostname;
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

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((product: any) => product.id !== id));
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

  const updateProductLiveStatus = async (id: string, isLive: boolean) => {
    setProducts((prev: any[]) =>
      prev.map((product: any) =>
        product.id === id ? { ...product, is_active: isLive } : product
      )
    );

    const { error } = await supabase
      .from("products")
      .update({ is_active: isLive })
      .eq("id", id);

    if (error) {
      setProducts((prev: any[]) =>
        prev.map((product: any) =>
          product.id === id ? { ...product, is_active: !isLive } : product
        )
      );
      alert("Failed to update product status. Please try again.");
    }
  };

  const updateProductSchedule = async (
    id: string,
    publishAt: string | null,
    expireAt: string | null
  ) => {
    setProducts((prev: any[]) =>
      prev.map((product: any) =>
        product.id === id
          ? { ...product, publish_at: publishAt, expire_at: expireAt }
          : product
      )
    );

    const { error } = await supabase
      .from("products")
      .update({ publish_at: publishAt, expire_at: expireAt })
      .eq("id", id);

    if (error) {
      alert("Failed to update product schedule. Please try again.");
      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("profile_id", user?.id)
        .order("position");
      if (productsData) {
        setProducts(productsData as any[]);
      }
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
          background: "#f3f4f6",
          height: "calc(100vh - 60px)",
          overflow: "hidden",
          padding: 12,
        }}
      >
        <Box
          h="100%"
          style={{
            border: "1px solid #d8dadd",
            borderRadius: rem(10),
            background: "#ffffff",
            overflow: "hidden",
          }}
        >
          <Grid gutter={0} h="100%">
            <Grid.Col
              span={{ base: 12, lg: 8 }}
              h="100%"
              style={{ borderRight: isMobileEditor ? "none" : "1px solid #e5e7eb" }}
            >
              <Tabs
                value={activeTab}
                onChange={(value) => setActiveTab(value as string)}
                style={{ height: "100%", display: "flex", flexDirection: "column" }}
              >
                <Tabs.List
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid #e5e7eb",
                    background: "#fafafa",
                    gap: 8,
                    flexWrap: isMobileEditor ? "wrap" : "nowrap",
                  }}
                >
                  <Tabs.Tab value="links" leftSection={<IconLink size={16} />}>
                    Links
                  </Tabs.Tab>
                  <Tabs.Tab value="theme" leftSection={<IconPalette size={16} />}>
                    Appearance
                  </Tabs.Tab>
                  <Tabs.Tab value="design" leftSection={<IconPalette size={16} />}>
                    Settings
                  </Tabs.Tab>
                  <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
                    Profile
                  </Tabs.Tab>
                </Tabs.List>

                <Box
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    background: "#f5f6f8",
                    padding: "16px",
                  }}
                >
                  <Box pb={320}>
                      <Box
                        mb="md"
                        style={{
                          border: "1px solid #e5e7eb",
                          borderRadius: rem(10),
                          padding: "10px 12px",
                          background: "#ffffff",
                        }}
                      >
                        <Text fw={700} size="sm">
                          {tabMeta[activeTab]?.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {tabMeta[activeTab]?.description}
                        </Text>
                      </Box>

                      <Tabs.Panel value="profile">
                        <ProfileInfo profile={profile} updateProfile={updateProfile} />
                      </Tabs.Panel>

                      <Tabs.Panel value="theme">
                        <Box
                          style={{
                            maxHeight: "calc(100vh - 260px)",
                            overflowY: "auto",
                          }}
                        >
                          <TemplateMarketplace onApplyTemplate={applyTemplate} />
                        </Box>
                      </Tabs.Panel>

                      <Tabs.Panel value="design">
                        <Box pb={140}>
                          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                            <LayoutSelector
                              selectedLayout={selectedLayout}
                              updateLayout={updateLayout}
                            />

                            <Box>
                              <FontSelector
                                selectedFont={selectedFont}
                                updateFont={updateFont}
                              />
                            </Box>
                          </SimpleGrid>

                          <Box mt="md">
                            <ThemeSelector
                              selectedTheme={selectedTheme}
                              updateTheme={updateTheme}
                            />
                          </Box>

                          <Box mt="md">
                            <UsernameThemeSelector
                              selectedTheme={selectedUsernameTheme}
                              onThemeChange={updateUsernameTheme}
                            />
                          </Box>

                          <Box mt="md">
                            <AnimationSelector
                              selectedAnimation={selectedAnimation}
                              updateAnimation={updateAnimation}
                            />
                          </Box>
                        </Box>
                      </Tabs.Panel>

                      <Tabs.Panel value="links">
                        <Box
                          style={{
                            maxHeight: "calc(100vh - 260px)",
                            overflowY: "auto",
                          }}
                        >
                          <Box
                            style={{
                              border: "1px solid #e5e7eb",
                              borderRadius: rem(10),
                              padding: "14px",
                              background: "#ffffff",
                            }}
                          >
                            <Group justify="space-between" mb="sm">
                              <Text fw={700} size="sm">
                                Quick Add
                              </Text>
                              <Group gap={8}>
                                <Badge variant="light" color="violet">
                                  {links.length} links
                                </Badge>
                                <Badge variant="light" color="grape">
                                  {contentBlocks.length} blocks
                                </Badge>
                                <Badge variant="light" color="orange">
                                  {products.length} products
                                </Badge>
                              </Group>
                            </Group>
                            <Text size="xs" c="dimmed" mb="sm">
                              Add a new link or content block from one popup. You can keep adding multiple items.
                            </Text>
                            <Button
                              leftSection={<IconPlus size={16} />}
                              fullWidth
                              size="md"
                              onClick={() => {
                                setCreateTarget(null);
                                setIsCreateModalOpen(true);
                              }}
                            >
                              Add New
                            </Button>

                            <Button
                              mt="sm"
                              leftSection={<IconUpload size={16} />}
                              fullWidth
                              variant="light"
                              size="md"
                              onClick={() => setIsImportModalOpen(true)}
                            >
                              Bulk Import Products
                            </Button>
                          </Box>

                          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mt="md">
                            <Box
                              style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: rem(10),
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
                                border: "1px solid #e5e7eb",
                                borderRadius: rem(10),
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

                          <Box
                            mt="md"
                            style={{
                              border: "1px solid #e5e7eb",
                              borderRadius: rem(10),
                              padding: "12px",
                              background: "#ffffff",
                            }}
                          >
                            <Text fw={700} size="sm" mb="sm">
                              Manage Products
                            </Text>
                            <ProductsList
                              products={products}
                              deleteProduct={deleteProduct}
                              updateProductLiveStatus={updateProductLiveStatus}
                              updateProductSchedule={updateProductSchedule}
                            />
                          </Box>
                        </Box>
                      </Tabs.Panel>
                  </Box>
                </Box>
              </Tabs>

              <Modal
                opened={isCreateModalOpen}
                onClose={() => {
                  setIsCreateModalOpen(false);
                  setCreateTarget(null);
                }}
                title={
                  createTarget === "link"
                    ? "Add New Link"
                    : createTarget === "block"
                      ? "Add Content Block"
                      : "Create New Item"
                }
                centered
                size="lg"
              >
                {!createTarget ? (
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <Button
                      variant="light"
                      size="lg"
                      leftSection={<IconLink size={18} />}
                      onClick={() => setCreateTarget("link")}
                      style={{ height: 96 }}
                    >
                      New Link
                    </Button>
                    <Button
                      variant="light"
                      color="grape"
                      size="lg"
                      leftSection={<IconStack2 size={18} />}
                      onClick={() => setCreateTarget("block")}
                      style={{ height: 96 }}
                    >
                      Content Block
                    </Button>
                  </SimpleGrid>
                ) : (
                  <Stack gap="sm">
                    <Button
                      variant="subtle"
                      leftSection={<IconArrowLeft size={16} />}
                      onClick={() => setCreateTarget(null)}
                      style={{ alignSelf: "flex-start" }}
                    >
                      Back
                    </Button>

                    {createTarget === "link" ? (
                      <AddLinkForm addLink={addLink} />
                    ) : (
                      <AddContentBlockForm addContentBlock={addContentBlock} />
                    )}

                    <Text size="xs" c="dimmed">
                      Tip: Form stays open so you can add multiple items one after another.
                    </Text>
                  </Stack>
                )}
              </Modal>

              <Modal
                opened={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                title="Bulk Import Products"
                centered
                size="lg"
              >
                <BulkImportProducts
                  profileId={user?.id}
                  onImported={async () => {
                    const { data: productsData } = await supabase
                      .from("products")
                      .select("*")
                      .eq("profile_id", user?.id)
                      .order("position");
                    if (productsData) {
                      setProducts(productsData as any[]);
                    }
                    setIsImportModalOpen(false);
                  }}
                />
              </Modal>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 4 }} h="100%" style={{ background: "#f7f7f7" }}>
              <Box h="100%" p="md" style={{ overflowY: "auto" }}>
                <MobilePreview
                  profile={profile}
                  links={links}
                  contentBlocks={contentBlocks}
                  products={products}
                  selectedTheme={selectedTheme}
                  selectedFont={selectedFont}
                  selectedAnimation={selectedAnimation}
                  selectedUsernameTheme={selectedUsernameTheme}
                  selectedLayout={selectedLayout}
                />
              </Box>
            </Grid.Col>
          </Grid>
        </Box>
      </Box>
    </AppShellLayout>
  );
}
