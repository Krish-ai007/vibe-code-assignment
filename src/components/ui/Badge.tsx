import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface BadgeProps {
  children: ReactNode;
  tone?: "accent" | "neutral" | "success";
  className?: string;
}

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  accent: "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-border)]",
  neutral: "bg-white/[0.05] text-[var(--text-muted)] border-[var(--border-strong)]",
  success: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/30",
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
