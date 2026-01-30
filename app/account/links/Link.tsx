"use client";
import { useState, useEffect } from "react";
import { Grid, Box, Tabs, rem, ScrollArea } from "@mantine/core";
import { 
  IconUser, 
  IconPalette, 
  IconLink 
} from "@tabler/icons-react";
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
import MobilePreview from "./components/MobilePreview";


export default function LinkTreeDashboard({ user }: { user: User | null }) {
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any>([]);
  const [selectedTheme, setSelectedTheme] = useState("default");
  const [selectedFont, setSelectedFont] = useState("inter");
  const [selectedAnimation, setSelectedAnimation] = useState("none");
  const [selectedUsernameTheme, setSelectedUsernameTheme] = useState("default");
  const [activeTab, setActiveTab] = useState("links");
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

  const addLink = async (title: string, url: string) => {
    if (!title || !url) return;
    if (!validateUrl(title, url)) {
      alert("Please enter a valid URL for the selected social network.");
      return;
    }
    const linkData = {
      profile_id: user?.id,
      title,
      url,
      position: links.length,
      is_active: true,
    };
    const { data, error } = await supabase
      .from("links")
      .insert([linkData])
      .select("*");
    if (data) {
      setLinks([...links, data[0]] as any);
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
                style={{ height: "100%", display: "flex", flexDirection: "column" }}
              >
                <Tabs.List>
                   <Tabs.Tab
                    value="links"
                    leftSection={<IconLink size={16} />}
                  >
                    Links
                  </Tabs.Tab>
                  <Tabs.Tab value="design" leftSection={<IconPalette size={16} />}>
                    Design
                  </Tabs.Tab>
                  <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
                    Profile
                  </Tabs.Tab>
                  
                 
                </Tabs.List>

                <Box style={{ flex: 1, overflow: "hidden" }}>
                  <ScrollArea h="calc(100vh - 180px)" p="lg">
                    {/* Profile Tab */}
                    <Tabs.Panel value="profile">
                      <ProfileInfo 
                        profile={profile} 
                        updateProfile={updateProfile} 
                      />
                    </Tabs.Panel>

                    {/* Design Tab */}
                    <Tabs.Panel value="design">
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
                      <AddLinkForm addLink={addLink} />
                      <Box mt="md">
                        <LinksList 
                          links={links} 
                          handleDragEnd={handleDragEnd} 
                          deleteLink={deleteLink} 
                        />
                      </Box>
                    </Tabs.Panel>
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
              selectedTheme={selectedTheme}
              selectedFont={selectedFont}
              selectedAnimation={selectedAnimation}
              selectedUsernameTheme={selectedUsernameTheme}
            />
          </Grid.Col>
        </Grid>
      </Box>
    </AppShellLayout>
  );
}
