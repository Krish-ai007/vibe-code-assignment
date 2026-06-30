import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router-dom";
import { ListX, Trash2, UserX } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { useListStore } from "@/store/listStore";
import { formatCount } from "@/utils/formatters";
import { getPlatformLabel } from "@/utils/dataHelpers";

export function ListPage() {
  const profiles = useListStore((s) => s.profiles);
  const removeProfile = useListStore((s) => s.removeProfile);
  const clearList = useListStore((s) => s.clearList);

  return (
    <Layout
      title="My List"
      subtitle={`${profiles.length} profile${profiles.length === 1 ? "" : "s"} saved — kept on this device across visits.`}
    >
      {profiles.length === 0 ? (
        <EmptyState
          icon={<UserX size={24} />}
          title="Your list is empty"
          description="Add profiles from the search page to build your shortlist."
          action={
            <Link to="/">
              <Button variant="primary">Browse influencers</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button variant="danger" size="sm" onClick={clearList}>
              <ListX size={14} /> Clear all
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <AnimatePresence initial={false}>
              {profiles.map((profile) => (
                <motion.div
                  key={profile.user_id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4"
                >
                  <Link
                    to={`/profile/${profile.username}?platform=${profile.platform}`}
                    className="flex min-w-0 flex-1 items-center gap-4"
                  >
                    <Avatar src={profile.picture} alt={`${profile.fullname}'s avatar`} size={48} />
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <span className="truncate">@{profile.username}</span>
                        <VerifiedBadge verified={profile.is_verified} />
                      </div>
                      <div className="truncate text-sm text-[var(--text-muted)]">
                        {profile.fullname}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text-faint)]">
                        <span>{formatCount(profile.followers)} followers</span>
                        <Badge tone="neutral">{getPlatformLabel(profile.platform)}</Badge>
                      </div>
                    </div>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove @${profile.username} from list`}
                    onClick={() => removeProfile(profile.user_id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </Layout>
  );
}
