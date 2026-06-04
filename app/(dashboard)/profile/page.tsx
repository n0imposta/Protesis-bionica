import { ProfileView } from "@/features/profile/profile-view";
import { getCurrentProfile } from "@/services/profile-service";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  return <ProfileView profile={profile} />;
}
