import { AnimatePresence } from "motion/react";
import { UserSearch } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  onProfileClick: (username: string) => void;
}

export function ProfileList({ profiles, platform, onProfileClick }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <EmptyState
        icon={<UserSearch size={24} />}
        title="No profiles found"
        description="Try a different search term or switch platforms."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <AnimatePresence initial={false}>
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.user_id}
            profile={profile}
            platform={platform}
            onProfileClick={onProfileClick}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
