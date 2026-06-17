// app/(admin)/layout.tsx
import React from "react";
import Link from "next/link";
import { ShieldCheck, Users, MessageSquare, ArrowDown, Settings, LogOut } from "lucide-react";

const navItems = [
  { name: "DASHBOARD", icon: <ShieldCheck size={20} />, href: "/admin/dashboard" },
  { name: "MANAGE MEMORIALS", icon: <Users size={20} />, href: "#" },
  { name: "FORUM MODERATION", icon: <MessageSquare size={20} />, href: "#" },
  { name: "USER FEEDBACK", icon: <ArrowDown size={20} className="rotate-180" />, href: "#" },
  { name: "SYSTEM SETTINGS", icon: <Settings size={20} />, href: "#" },
];

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#FAF8F5] text-stone-900 font-sans">
      {/* --- Shared Sidebar Navigation --- */}
      <aside className="w-64 border-r border-stone-200 bg-white p-6 flex flex-col justify-between fixed h-full">
        <div>
          <h1 className="text-2xl font-serif text-[#7A1C1C] mb-10 font-bold">Admin Console</h1>
          <nav className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-xs text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors uppercase tracking-wide"
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 bg-stone-50 border border-stone-100 rounded-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#7A1C1C] flex items-center justify-center text-white font-bold text-sm">AJ</div>
          <div>
            <p className="text-xs font-semibold text-stone-900">Alvin Jenkins</p>
            <p className="text-[10px] text-stone-400 font-medium">Supervisor</p>
          </div>
        </div>
      </aside>

      {/* --- Dynamic Page Content Render Window --- */}
      <div className="flex-1 pl-64"> 
        {children}
      </div>
    </div>
  );
}