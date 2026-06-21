"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { ShieldCheck, MessageSquare, ImageIcon, Mail } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_WIDTH = "w-64";
const CONTENT_OFFSET = "pl-64";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminUser {
  name: string;
  role: string;
}

// ─── Nav config ───────────────────────────────────────────────────────────────
// view: null means the root dashboard (no ?view= param)

const navItems = [
  { label: "Dashboard",        icon: ShieldCheck,    view: null       },
  { label: "Manage Tributes",  icon: MessageSquare,  view: "tributes" },
  { label: "Gallery",          icon: ImageIcon,      view: "gallery"  },
  { label: "Emails",           icon: Mail,           view: "emails"   },
] as const;

type NavView = (typeof navItems)[number]["view"];

function buildHref(view: NavView): string {
  return view ? `/admin/dashboard?view=${view}` : "/admin/dashboard";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Sidebar nav links ────────────────────────────────────────────────────────

function SidebarNavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") as NavView | null;

  return (
    <nav aria-label="Admin navigation">
      <ul className="space-y-4">
        {navItems.map(({ label, icon: Icon, view }) => {
          const isActive =
            pathname === "/admin/dashboard" && currentView === view;

          return (
            <li key={label}>
              <Link
                href={buildHref(view)}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wide transition-colors",
                  isActive
                    ? "bg-[#7A1C1C] text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-100",
                ].join(" ")}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-white" : "text-stone-400"}
                  aria-hidden
                />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ─── Profile card ─────────────────────────────────────────────────────────────
// Replace `mockUser` with your real auth session (e.g. useSession() from NextAuth)

function ProfileCard({ user }: { user: AdminUser }) {
  const initials = getInitials(user.name);

  return (
    <div className="p-4 bg-stone-50 border border-stone-100 rounded-xl flex items-center gap-3.5">
      <div
        className="w-10 h-10 rounded-full bg-[#7A1C1C] flex items-center justify-center text-white font-bold text-sm shrink-0 select-none"
        aria-hidden
      >
        {initials}
      </div>
      <div className="leading-tight min-w-0">
        <p className="text-xs font-semibold text-stone-900 truncate">{user.name}</p>
        <p className="text-[10px] text-stone-400 font-medium truncate">{user.role}</p>
      </div>
    </div>
  );
}

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function AdminRootLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  // Pass your real session user here; remove mock once auth is wired up
  user?: AdminUser;
}) {
  const resolvedUser: AdminUser = user ?? {
    name: "Admin User",
    role: "Supervisor",
  };

  return (
    <SessionProvider>
    <div className="min-h-screen flex bg-[#FAF8F5] text-stone-900 font-sans">

      {/* ── Sidebar ── */}
      <aside
        className={`${SIDEBAR_WIDTH} border-r border-stone-200 bg-white p-6 flex flex-col justify-between fixed h-full z-40`}
        aria-label="Admin sidebar"
      >
        <div className="space-y-8">
          <Link href="/admin/dashboard" aria-label="Go to dashboard home">
            <h1 className="text-2xl font-serif text-[#7A1C1C] font-bold tracking-wide mb-8">
              Admin Console
            </h1>
          </Link>

          <Suspense
            fallback={
              <p className="text-xs text-stone-400 font-sans animate-pulse px-4">
                Loading navigation…
              </p>
            }
          >
            <SidebarNavLinks />
          </Suspense>
        </div>

        <ProfileCard user={resolvedUser} />
      </aside>

      {/* ── Main content ── */}
      <main className={`flex-1 ${CONTENT_OFFSET} min-h-screen bg-[#FAF8F5]`}>
        {children}
      </main>
    </div>
    </SessionProvider>
  );
}