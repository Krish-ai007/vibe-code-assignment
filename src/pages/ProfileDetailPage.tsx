import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, ExternalLink, Plus } from "lucide-react";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import { formatCount, formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useListStore } from "@/store/listStore";

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <div className="text-xs text-[var(--text-faint)]">{label}</div>
      <div className="mt-1 text-base font-semibold text-[var(--text)]">{value}</div>
    </div>
  );
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = (searchParams.get("platform") as Platform) || "instagram";
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const loaded = loadedFor === username;

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    loadProfileByUsername(username).then((data) => {
      if (cancelled) return;
      setProfileData(data);
      setLoadedFor(username);
    });
    return () => {
      cancelled = true;
    };
  }, [username]);

  const toggleProfile = useListStore((s) => s.toggleProfile);
  const inList = useListStore((s) =>
    profileData ? s.isInList(profileData.data.user_profile.user_id) : false
  );

  if (!username) {
    return (
      <Layout>
        <EmptyState
          title="Invalid profile"
          action={
            <Link to="/">
              <Button variant="secondary">Back to search</Button>
            </Link>
          }
        />
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout>
        <div className="flex items-start gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <EmptyState
          title={`Could not load profile for @${username}`}
          description="This profile may not exist in the dataset."
          action={
            <Link to="/">
              <Button variant="secondary">
                <ArrowLeft size={14} /> Back to search
              </Button>
            </Link>
          }
        />
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;

  return (
    <Layout>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
      >
        <ArrowLeft size={14} /> Back to search
      </Link>

      <div className="animate-fade-up rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <Avatar src={user.picture} alt={`${user.fullname}'s avatar`} size={88} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold">@{user.username}</h2>
              <VerifiedBadge verified={user.is_verified} />
              <Badge tone="accent">{platform}</Badge>
            </div>
            <p className="mt-1 text-[var(--text-muted)]">{user.fullname}</p>

            {user.description && (
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">
                {user.description}
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                variant={inList ? "primary" : "secondary"}
                onClick={() => toggleProfile(user, platform)}
                aria-pressed={inList}
              >
                {inList ? <Check size={16} /> : <Plus size={16} />}
                {inList ? "Added to List" : "Add to List"}
              </Button>

              {user.url && (
                <a href={user.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost">
                    View on platform <ExternalLink size={14} />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatTile label="Followers" value={formatCount(user.followers)} />
          <StatTile label="Engagement rate" value={formatEngagementRate(user.engagement_rate)} />
          {user.posts_count !== undefined && (
            <StatTile label="Posts" value={user.posts_count.toLocaleString()} />
          )}
          {user.avg_likes !== undefined && (
            <StatTile label="Avg likes" value={formatCount(user.avg_likes)} />
          )}
          {user.avg_comments !== undefined && (
            <StatTile label="Avg comments" value={formatCount(user.avg_comments)} />
          )}
          {user.avg_views !== undefined && user.avg_views > 0 && (
            <StatTile label="Avg views" value={formatCount(user.avg_views)} />
          )}
          {user.engagements !== undefined && (
            <StatTile label="Engagements" value={formatCount(user.engagements)} />
          )}
        </div>
      </div>
    </Layout>
  );
}
