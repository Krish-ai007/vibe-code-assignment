import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ListChecks, Sparkles } from "lucide-react";
import { useListStore } from "@/store/listStore";
import { Badge } from "@/components/ui/Badge";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  const count = useListStore((s) => s.profiles.length);
  const location = useLocation();
  const onListPage = location.pathname === "/list";

  return (
    <div className="min-h-svh flex flex-col">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] glass-panel">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-base font-semibold tracking-tight text-[var(--text)]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-strong)] text-[#0b0b10]">
              <Sparkles size={16} strokeWidth={2.5} />
            </span>
            <span className="font-display">Wobb Scout</span>
          </Link>

          <Link
            to="/list"
            aria-current={onListPage ? "page" : undefined}
            className="flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3.5 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent-border)]"
          >
            <ListChecks size={16} />
            My List
            <Badge tone={count > 0 ? "accent" : "neutral"}>{count}</Badge>
          </Link>
        </div>
      </header>

      {(title || subtitle) && (
        <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6">
          {title && <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>}
          {subtitle && (
            <p className="mt-1.5 text-sm text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">{children}</main>

      <footer className="border-t border-[var(--border)] py-6 text-center text-xs text-[var(--text-faint)]">
        Built for the Wobb vibe-coder assignment.
      </footer>
    </div>
  );
}
