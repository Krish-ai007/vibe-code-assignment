import { Search, X } from "lucide-react";
import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { cn } from "@/utils/cn";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div
        role="tablist"
        aria-label="Filter by platform"
        className="inline-flex w-fit gap-1 rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] p-1"
      >
        {PLATFORMS.map((p) => {
          const active = selected === p;
          return (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(p)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-all cursor-pointer",
                active
                  ? "bg-gradient-to-b from-[var(--accent)] to-[var(--accent-strong)] text-[#0b0b10] shadow-[var(--shadow-glow)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              )}
            >
              {getPlatformLabel(p)}
            </button>
          );
        })}
      </div>

      <div className="relative w-full sm:max-w-xs">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or name…"
          aria-label="Search influencers"
          className="w-full rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] py-2 pl-9 pr-9 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none transition-colors focus:border-[var(--accent-border)]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-faint)] hover:text-[var(--text)] cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
