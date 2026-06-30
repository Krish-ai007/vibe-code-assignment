import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-20 px-6 animate-fade-up">
      {icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[var(--accent)]">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-[var(--text-muted)]">{description}</p>
      )}
      {action}
    </div>
  );
}
