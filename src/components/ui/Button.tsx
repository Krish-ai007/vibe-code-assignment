import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-b from-[var(--accent)] to-[var(--accent-strong)] text-[#0b0b10] font-semibold shadow-[var(--shadow-glow)] hover:brightness-110 active:brightness-95",
  secondary:
    "bg-[var(--bg-elevated)] text-[var(--text)] border border-[var(--border-strong)] hover:border-[var(--accent-border)] hover:bg-white/[0.06]",
  ghost: "bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/[0.06]",
  danger:
    "bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/30 hover:bg-[var(--danger)]/20",
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100 whitespace-nowrap select-none cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
