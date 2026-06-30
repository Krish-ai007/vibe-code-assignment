import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Check, Plus } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useListStore } from "@/store/listStore";
import { formatCount } from "@/utils/formatters";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  onProfileClick?: (username: string) => void;
}

function ProfileCardImpl({ profile, platform, onProfileClick }: ProfileCardProps) {
  const navigate = useNavigate();
  const inList = useListStore((s) => s.isInList(profile.user_id));
  const toggleProfile = useListStore((s) => s.toggleProfile);

  const handleClick = () => {
    onProfileClick?.(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className="group flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 transition-colors hover:border-[var(--accent-border)] cursor-pointer"
    >
      <Avatar src={profile.picture} alt={`${profile.fullname}'s avatar`} size={52} />

      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-1.5 font-semibold text-[var(--text)]">
          <span className="truncate">@{profile.username}</span>
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="truncate text-sm text-[var(--text-muted)]">{profile.fullname}</div>
        <div className="mt-1 text-xs text-[var(--text-faint)]">
          {formatCount(profile.followers)} followers
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        variant={inList ? "primary" : "secondary"}
        onClick={(e) => {
          e.stopPropagation();
          toggleProfile(profile, platform);
        }}
        aria-pressed={inList}
        aria-label={inList ? `Remove @${profile.username} from list` : `Add @${profile.username} to list`}
        className="shrink-0"
      >
        {inList ? <Check size={14} /> : <Plus size={14} />}
        {inList ? "Added" : "Add to List"}
      </Button>
    </motion.div>
  );
}

// Bug fix / perf: the original ProfileCard re-rendered on every keystroke in the
// search box because the raw (unused-by-the-card) `searchQuery` prop was threaded
// through as a `data-search` DOM attribute purely as a side effect, which also
// defeated memoization. The card no longer needs searchQuery at all, and is now
// memoized so the full list doesn't re-render when the Zustand list store changes
// for a profile that isn't this one (each card subscribes to its own slice).
export const ProfileCard = memo(ProfileCardImpl);
