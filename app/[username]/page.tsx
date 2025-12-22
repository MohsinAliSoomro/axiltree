import { notFound } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import ProfileView from "./ProfileView";

export default async function Page({ params }: { params: { username: string } }) {
  const { username } = await params;
  const supabase = await createClient();

  // Fetch profile by username
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // Fetch active links
  const { data: links, error: linksError } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_active', true)
    .order('position', { ascending: true });

  if (linksError) {
    console.error('Error fetching links:', linksError);
  }

  return <ProfileView profile={profile} links={links as any} />;
}
