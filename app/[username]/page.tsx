import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import ProfileView from "./ProfileView";
import { isLinkVisibleNow } from "../utils/linkSchedule";

type UsernamePageProps = {
  params: Promise<{ username: string }>;
};

const baseSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://axiltree.tech";

export async function generateMetadata({
  params,
}: UsernamePageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, bio, avatar_url")
    .eq("username", username)
    .single();

  if (!profile) {
    return {
      title: "Profile not found | AxilTree",
      description: "This AxilTree profile does not exist.",
      robots: { index: false, follow: false },
    };
  }

  const displayName = profile.full_name?.trim() || `@${profile.username}`;
  const title = `${displayName} | AxilTree`;
  const description =
    profile.bio?.trim() ||
    `Check out ${displayName}'s links on AxilTree.`;
  const profileUrl = `${baseSiteUrl}/${profile.username}`;
  const imageUrl = profile.avatar_url?.trim() || `${baseSiteUrl}/logo.png`;

  return {
    title,
    description,
    alternates: {
      canonical: profileUrl,
    },
    openGraph: {
      title,
      description,
      url: profileUrl,
      siteName: "AxilTree",
      type: "profile",
      images: [
        {
          url: imageUrl,
          alt: `${displayName} profile image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: UsernamePageProps) {
  const { username } = await params;
  const supabase = await createClient();

  // Fetch profile by username
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // Fetch active links
  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (linksError) {
    console.error("Error fetching links:", linksError);
  }

  const { data: contentBlocks, error: blocksError } = await supabase
    .from("profile_blocks")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (blocksError) {
    console.error("Error fetching content blocks:", blocksError);
  }

  const visibleLinks = (links || []).filter((link: any) => isLinkVisibleNow(link));
  const visibleBlocks = (contentBlocks || []).filter((block: any) =>
    isLinkVisibleNow(block)
  );

  return (
    <ProfileView
      profile={profile}
      links={visibleLinks as any}
      contentBlocks={visibleBlocks as any}
    />
  );
}
