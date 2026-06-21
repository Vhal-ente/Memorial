"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ShieldCheck, MessageSquare, ImageIcon, Mail, LogOut } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDEBAR_WIDTH = "w-64";
const CONTENT_OFFSET = "pl-64";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminUser {
  name: string;
  role: string;
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const navItems = [
  { label: "Dashboard",       icon: ShieldCheck,   view: null       },
  { label: "Manage Tributes", icon: MessageSquare, view: "tributes" },
  { label: "Gallery",         icon: ImageIcon,     view: "gallery"  },
  { label: "Emails",          icon: Mail,          view: "emails"   },
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

// ─── Logout Modal ─────────────────────────────────────────────────────────────

function LogoutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm pointer-events-auto"
        onClick={onCancel}
      />
      {/* Modal */}
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-xl border border-stone-100 p-8 w-full max-w-sm space-y-6 pointer-events-auto">
          <div className="space-y-1.5">
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Sign out
            </h3>
            <p className="text-sm text-stone-500 font-medium">
              Are you sure you want to sign out of the admin console?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-[#7A1C1C] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#681818] transition-colors"
            >
              Yes, sign out
            </button>
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 bg-stone-100 text-stone-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
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

function ProfileCard({ user, onLogout }: { user: AdminUser; onLogout: () => void }) {
  const initials = getInitials(user.name);

  return (
    <div className="space-y-3">
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

      {/* Logout button */}
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide text-stone-500 hover:text-[#7A1C1C] hover:bg-red-50 transition-colors"
      >
        <LogOut size={16} aria-hidden />
        <span>Sign out</span>
      </button>
    </div>
  );
}

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function AdminRootLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: AdminUser;
}) {
  const resolvedUser: AdminUser = user ?? {
    name: "Admin User",
    role: "Supervisor",
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

  return (
  <>
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

          <ProfileCard
            user={resolvedUser}
            onLogout={() => setShowLogoutModal(true)}
          />
        </aside>

        {/* ── Main content ── */}
        <main className={`flex-1 ${CONTENT_OFFSET} min-h-screen bg-[#FAF8F5]`}>
          {children}
        </main>
      </div>

      {/* ── Logout modal ── */}
      {showLogoutModal && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
      </>
  );
}