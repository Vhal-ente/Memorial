"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function MemorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Detect if the user is currently looking at the Gallery view
  const isPhotosPage = pathname === "/photos";

  const navigationTabs = [
    { name: "Story", path: "/" },
    // { name: 'Timeline', path: '/timeline' },
    { name: "Gallery", path: "/photos" },
    // { name: 'Videos', path: '/videos' },
    { name: "Tributes", path: "/tributes" },
    // { name: "Forum", path: "/forum" },
  ];

  return (
    <div className="w-full relative min-h-screen bg-[#FCFBF8]">
      {/* Curved Background Aura Layer — Custom tailored to warm background champagne/gold curves */}
      {!isPhotosPage && (
        <div className="absolute top-0 left-0 w-full h-[620px] bg-gradient-to-b from-[#F9F3E3] via-[#FAF6EC] to-[#FCFBF8] pointer-events-none z-0 [clip-path:ellipse(100%_100%_at_50%_0%)] opacity-80" />
      )}

      {/* Profile Header Content Element */}
      <div className={`relative z-10 w-full px-6 ${isPhotosPage ? "pt-10" : "pt-16"}`}>
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center pb-12">
          
          {/* PROFILE CARD META - Hidden completely when on the Gallery page */}
          {!isPhotosPage && (
            <>
              {/* Profile Image Border matching the gold frame aesthetic */}
              <div className="relative w-36 h-36 mb-6 rounded-full p-1 bg-white shadow-xl ring-2 ring-[#D4AF37]/40 mt-8">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src="/Photo1.jpg" /* Fixed: Removed public prefix to prevent 404 logs */
                    alt="Ogbueshi Bennett Amaechi Oguegbu"
                    fill
                    className="object-cover w-5 h-3"
                    priority
                  />
                </div>
              </div>

              {/* Title Header with Deep Red / Metallic Crimson gradient treatment matching traditional wear */}
              <h1
                className="text-3xl md:text-5xl font-serif mb-2 tracking-wide font-medium block leading-tight px-4"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, #991B1B 0%, #7A1C1C 60%, #4C0519 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "#7A1C1C",
                }}
              >
                OGBUESHI BENNETT AMAECHI OGUEGBU (NNAMENYIBA II)
              </h1>
              <p className="text-[#D4AF37] font-sans tracking-widest text-xs font-bold uppercase mb-6">
                Nov 11, 1939 — April 23, 2026
              </p>

              <div className="max-w-xl mx-auto mb-10 text-center space-y-1">
                <p className="font-serif italic text-lg text-stone-700 tracking-wide">
                  &quot;A Life of Integrity, Service, Faith, and Love.&quot;
                </p>
                <p className="text-[10px] tracking-wider text-stone-400 font-sans uppercase font-bold">
                  — Honorable Legacy
                </p>
              </div>
            </>
          )}

          {!isPhotosPage && (
            <>
              {/* Sub-routing Navigation Row — Synced completely to the new color language */}
              <div className="flex items-center justify-center gap-2.5 w-full max-w-2xl mx-auto overflow-x-auto whitespace-nowrap py-2 no-scrollbar">
                {navigationTabs.map((tab) => {
                  const isSelectedRoute =
                    pathname === tab.path ||
                    pathname.startsWith(`${tab.path}/`);

                  return (
                    <Link
                      key={tab.name}
                      href={tab.path}
                      className={`text-xs tracking-widest uppercase px-6 py-2.5 rounded-full transition-all duration-200 font-medium ${
                        isSelectedRoute
                          ? "bg-[#7A1C1C] text-white shadow-md font-semibold ring-1 ring-red-900/10" // Selected tab matches primary rich burgundy
                          : "text-stone-600 bg-white/60 border border-stone-200/60 hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37] shadow-sm" // Hover matches polished gold
                      }`}
                    >
                      {tab.name}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
        
        {/* This children parameter injects sub-views (/story, /photos, /timeline) directly beneath the curve */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 transition-all duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}