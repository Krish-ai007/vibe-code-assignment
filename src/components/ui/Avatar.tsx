import { useState } from "react";
import { cn } from "@/utils/cn";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 48, className }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const initial = alt.trim().charAt(0).toUpperCase() || "?";

  if (!src || errored) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-semibold shrink-0",
          "bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-border)]",
          className
        )}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
        aria-hidden="true"
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setErrored(true)}
      className={cn("rounded-full object-cover shrink-0 border border-[var(--border)]", className)}
      style={{ width: size, height: size }}
    />
  );
}
