import { useCallback, useMemo, useRef, useState } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, 150);

  // Perf fix: extractProfiles() parses/maps the full JSON dataset for the active
  // platform on every call. Previously this ran on *every* render of SearchPage
  // (including on each keystroke), even though the result only depends on
  // `platform`. useMemo now recomputes it only when the platform changes.
  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);

  const filtered = useMemo(
    () => filterProfiles(allProfiles, debouncedQuery),
    [allProfiles, debouncedQuery]
  );

  // Bug fix: `clickCount` was read from a stale closure (`setClickCount(clickCount + 1)`
  // and the console.log right after it), so rapid clicks would frequently log/increment
  // by less than expected. A ref + functional update avoids relying on the render's
  // captured value entirely, and avoids a state update (re-render) purely for logging.
  const clickCountRef = useRef(0);
  const handleProfileClick = useCallback((username: string) => {
    clickCountRef.current += 1;
    console.log("Clicked profile:", username, "total clicks:", clickCountRef.current);
  }, []);

  const handlePlatformChange = useCallback((p: Platform) => {
    setPlatform(p);
    setSearchQuery("");
  }, []);

  return (
    <Layout
      title="Find Influencers"
      subtitle="Browse and shortlist top creators across social platforms."
    >
      <div className="flex flex-col gap-6">
        <PlatformFilter
          selected={platform}
          onChange={handlePlatformChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <p className="text-xs text-[var(--text-faint)]">
          Showing {filtered.length} of {allProfiles.length} on{" "}
          <span className="text-[var(--text-muted)]">{platform}</span>
        </p>

        <ProfileList
          profiles={filtered}
          platform={platform}
          onProfileClick={handleProfileClick}
        />
      </div>
    </Layout>
  );
}
