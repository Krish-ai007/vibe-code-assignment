import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <BadgeCheck
      size={15}
      className="shrink-0 text-[var(--accent)]"
      aria-label="Verified account"
    />
  );
}
