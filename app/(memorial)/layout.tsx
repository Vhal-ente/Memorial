"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAudio } from "@/context/AudioContext";
import { Volume2, VolumeX } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*            INNER LAYOUT CONTENT FRAMEWORK (CONSUMES CONTEXT)               */
/* -------------------------------------------------------------------------- */
export default function MemorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isPlaying, togglePlayback } = useAudio();
  
  // Detect if the user is currently looking at the Gallery view
  const isPhotosPage = pathname === "/photos";

  const navigationTabs = [
    { name: "Story", path: "/" },
    { name: "Gallery", path: "/photos" },
    { name: "Tributes", path: "/tributes" },
  ];

  return (
    <div className="w-full relative min-h-screen bg-[#FCFBF8]">
      {/* GLOBAL BACKGROUND SOUND CONTROLLER PANEL WIDGET */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 z-40">
        <button
          onClick={togglePlayback}
          className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-2xl transition-all duration-300 border backdrop-blur-md font-sans text-xs tracking-wider font-medium uppercase
            ${
              isPlaying
                ? "bg-[#7A1C1C] text-white border-amber-600/30"
                : "bg-[#62d467] text-gray-700 border-stone-200/80 hover:bg-stone-50"
            }`}
        >
          {isPlaying ? (
            <>
              <Volume2 size={16} className="animate-pulse text-[#010101]" />
              <span>Music On</span>
            </>
          ) : (
            <>
              <VolumeX size={16} className="text-gray-700" />
              <span>Music Muted</span>
            </>
          )}
        </button>
      </div>

      {/* Curved Background Aura Layer — Custom tailored to warm background champagne/gold curves */}
      {!isPhotosPage && (
        <div className="absolute top-0 left-0 w-full h-[620px] bg-gradient-to-b from-[#F9F3E3] via-[#FAF6EC] to-[#FCFBF8] pointer-events-none z-0 [clip-path:ellipse(100%_100%_at_50%_0%)] opacity-80" />
      )}

      {/* Profile Header Content Element */}
      <div className={`relative z-10 w-full px-4 sm:px-6 ${isPhotosPage ? "pt-10" : "pt-16"}`}>
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center pb-12">
          
          {/* PROFILE CARD META - Hidden completely when on the Gallery page */}
          {!isPhotosPage && (
            <>
              {/* Profile Image Border matching the gold frame aesthetic */}
              <div className="relative w-36 h-36 mb-6 rounded-full p-1 bg-white shadow-xl ring-2 ring-[#D4AF37]/40 mt-8">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src="/photo1.jpg"
                    alt="Ogbueshi Bennett Amaechi Oguegbu"
                    fill
                    className="object-cover"
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
              {/* Responsive Sub-routing Navigation Track */}
              <div className="w-full max-w-md mx-auto px-2">
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full bg-stone-100/40 p-1 rounded-full border border-stone-200/30">
                  {navigationTabs.map((tab) => {
                    const isSelectedRoute =
                      pathname === tab.path ||
                      (tab.path !== "/" && pathname.startsWith(tab.path));

                    return (
                      <Link
                        key={tab.name}
                        href={tab.path}
                        className={`text-[10px] sm:text-xs tracking-wider sm:tracking-widest uppercase py-2.5 rounded-full transition-all duration-200 font-semibold text-center block ${
                          isSelectedRoute
                            ? "bg-[#7A1C1C] text-white shadow-md ring-1 ring-red-900/10"
                            : "text-stone-600 bg-white/80 border border-stone-200/40 hover:bg-[#D4AF37] hover:text-white hover:border-[#D4AF37] shadow-sm"
                        }`}
                      >
                        {tab.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Sub-views Area */}
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pb-12 transition-all duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*            MAIN COMPONENT EXPORT (PROVIDES CONTEXT INITIALIZATION)         */
/* -------------------------------------------------------------------------- */
// export default function MemorialLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//       <MemorialLayoutContent>{children}</MemorialLayoutContent>
//   );
// }