"use client";

import Link from "next/link";
import { TributeModal, TributeFormData } from "@/components/TributeModal";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

 const openTributeModal = () => {
  setMobileMenuOpen(false);
  setIsModalOpen(true);
};

const closeTributeModal = () => {
  setIsModalOpen(false);
  setMobileMenuOpen(false);
};

  const handleTributeSubmit = (data: TributeFormData) => {
    console.log("Submitted Tribute Data:", data);
    setIsModalOpen(false);
  };


  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-stone-200/60">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo - Matching the Tribute Header Color */}
          <Link
            href="/"
            className="font-serif text-lg sm:text-xl lg:text-2xl text-[#7A1C1C] font-semibold tracking-wide truncate"
          >
            Eternal Memories.
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <button
              onClick={openTributeModal}
              className="bg-[#D4AF37] text-white px-5 lg:px-7 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#7A1C1C] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none shadow-md"
            >
              Post Tribute
            </button>

            <button className="bg-[#D4AF37] text-white px-5 lg:px-7 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#7A1C1C] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none shadow-md">
              Foundation
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#6F5325] hover:bg-[#FCFBF8] transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? "max-h-64 border-t border-stone-200/60 shadow-inner"
              : "max-h-0"
          }`}
        >
          <div className="bg-[#FCFBF8] px-4 py-4 flex flex-col gap-3">
            <button
              onClick={openTributeModal}
              className="w-full bg-[#D4AF37] text-white py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#7A1C1C] active:scale-[0.99] transition-all"
            >
              Post a Tribute
            </button>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-[#D4AF37] text-white py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#7A1C1C] active:scale-[0.99] transition-all"
            >
              Foundation
            </button>
          </div>
        </div>
      </header>

      <TributeModal
        isOpen={isModalOpen}
        onClose={closeTributeModal}
        onSubmit={handleTributeSubmit}
      />
    </>
  );
}
