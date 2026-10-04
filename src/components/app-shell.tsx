"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Bookmark,
  Box,
  Building2,
  FileText,
  FolderGit2,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Newspaper,
  Waypoints,
} from "lucide-react";

import { AccountMenu } from "@/components/account-menu";
import { SearchAutocomplete } from "@/components/search-autocomplete";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/news", label: "AI News", icon: Newspaper },
  { href: "/papers", label: "Research Papers", icon: FileText },
  { href: "/models", label: "Models", icon: Box },
  { href: "/github", label: "GitHub Projects", icon: FolderGit2 },
  { href: "/benchmarks", label: "Benchmarks", icon: BarChart3 },
  { href: "/companies", label: "AI Companies", icon: Building2 },
  { href: "/explore", label: "Explore", icon: Waypoints },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/assistant", label: "AI Research Assistant", icon: MessageSquareText },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-col gap-0.5">
      {nav.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "bg-muted font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function BookmarkCount() {
  const { items } = useBookmarks();
  const count = items.length;

  return (
    <Link
      href="/bookmarks"
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      <Bookmark className="size-4" />
      <span>{count}</span>
      <span className="sr-only">saved items</span>
    </Link>
  );
}

function ShellFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const sheetOpen = open && openedAt === pathname;

  function setSheet(next: boolean) {
    setOpenedAt(pathname);
    setOpen(next);
  }

  return (
    <div className="flex min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
        <div className="border-b border-sidebar-border px-4 py-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            AI Intelligence Command Center
          </Link>
          <p className="mt-1 text-xs text-muted-foreground">Sample workspace</p>
        </div>
        <nav aria-label="Primary" className="flex-1 overflow-y-auto px-2 py-3">
          <NavLinks />
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border bg-background px-3 py-2 md:px-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation"
            onClick={() => setSheet(true)}
          >
            <Menu />
          </Button>
          <SearchAutocomplete />
          <div className="ml-auto flex items-center gap-2">
            <BookmarkCount />
            <AccountMenu />
          </div>
        </header>
        <div className="border-b border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground md:px-6">
          Sample data. These excerpts are synthetic and are not live or verified intelligence.
        </div>
        <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6">
          {children}
        </main>
      </div>
      <Sheet open={sheetOpen} onOpenChange={setSheet}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>AI Intelligence Command Center</SheetTitle>
            <SheetDescription>Sample workspace</SheetDescription>
          </SheetHeader>
          <nav aria-label="Primary mobile" className="px-2">
            <NavLinks onNavigate={() => setSheet(false)} />
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return <ShellFrame>{children}</ShellFrame>;
}
