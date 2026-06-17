// app/(admin)/admin/dashboard/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Bell, 
  PlusCircle, 
  ShieldCheck, 
  XCircle, 
  MessageSquare, 
  ThumbsUp, 
  X, 
  Image as ImageIcon 
} from "lucide-react";

const adminProfile = { initials: "AJ" };

// Existing mock data
const mockTributeRequest = {
  id: "1",
  name: "Samuel Higgins",
  tribute: `"A wonderful soul who will be missed by all..."`,
};

const mockMemorialRequest = {
  id: "2",
  name: "Memorial for Eleanor Sterling",
  quote: `"A legacy of kindness and grace..."`,
};

// NEW: Mock Data matching the new Image Approval section exactly
const initialImageRequests = [
  {
    id: "img-1",
    title: "Portrait of Eleanor Sterling",
    category: "MEMORIAL GALLERY",
    uploader: "James Sterling",
    status: "PENDING",
    imageSrc: "/eleanor-portrait.jpg", // Replace with your local fallback asset path if needed
  },
  {
    id: "img-2",
    title: "Family Gathering 1985",
    category: "ARCHIVE UPDATE",
    uploader: "Sarah Chen",
    status: "REVIEW REQUIRED",
    imageSrc: null, // Triggers the elegant placeholder state seen in card 2
  },
];

export default function AdminDashboardPage() {
  const [imageRequests, setImageRequests] = useState(initialImageRequests);

  const handleApproveImage = (id: string) => {
    console.log(`Approved image: ${id}`);
    setImageRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleRejectImage = (id: string) => {
    console.log(`Rejected image: ${id}`);
    setImageRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleApproveTribute = async (id: string) => {
    console.log(`Approve Tribute: ${id}`);
  };

  const handleApproveMemorial = async (id: string) => {
    console.log(`Approve Memorial: ${id}`);
  };

  return (
    <main className="w-full">
      {/* Top Header Bar */}
      <header className="px-10 py-6 border-b border-stone-200 bg-white/70 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
        <h2 className="text-3xl font-serif text-[#C99D5A] font-bold">Eternal Memories</h2>
        <div className="flex items-center gap-6">
        
          <div className="w-9 h-9 rounded-full bg-[#7A1C1C] flex items-center justify-center text-white font-semibold text-xs border border-white shadow-inner">
            {adminProfile.initials}
          </div>
        </div>
      </header>

      {/* Inner Dashboard Layout Area */}
      <div className="p-10 space-y-12">
        
        {/* Overview Header Section */}
        <section className="flex items-start justify-between">
          <div className="max-w-xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#C99D5A] mb-1">
              SYSTEM OVERVIEW
            </p>
            <h3 className="text-5xl font-serif text-stone-950 font-bold">Admin Dashboard</h3>
          </div>
          <div className="flex items-center gap-4">
            {/* <button className="px-6 py-2.5 border border-[#E6DED2] rounded-xl text-xs font-semibold text-stone-800 hover:bg-[#FAF8F5] transition">
              Generate Report
            </button> */}
            <button className="px-6 py-2.5 bg-[#C99D5A] rounded-xl text-xs font-semibold text-white hover:bg-[#b88c4b] transition flex items-center gap-2">
              <PlusCircle size={16} />
              Create Entry
            </button>
          </div>
        </section>

        {/* Tribute Management */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-stone-900 font-serif">Tribute Management</h4>
            <Link href="#" className="text-xs font-medium text-[#C99D5A] hover:underline">
              Review Queue (12)
            </Link>
          </div>

          <div className="bg-white border border-[#E6DED2] rounded-2xl p-6 shadow-sm flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E6DED2] flex items-center justify-center text-[#7A1C1C]">
              <ShieldCheck size={22} />
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-semibold text-stone-950">
                New Tribute for '{mockTributeRequest.name}'
              </p>
              <p className="text-xs italic text-stone-500 font-medium">
                {mockTributeRequest.tribute}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleApproveTribute(mockTributeRequest.id)}
                className="px-6 py-2.5 bg-[#7A1C1C] rounded-xl text-xs font-semibold text-white hover:bg-[#681818] transition flex items-center gap-2"
              >
                <ShieldCheck size={16} />
                Approve Tribute
              </button>
              <button className="px-6 py-2.5 border border-[#E6DED2] rounded-xl text-xs font-semibold text-stone-800 hover:bg-[#FAF8F5] transition flex items-center gap-2">
                <XCircle size={16} />
                Reject
              </button>
            </div>
          </div>
        </section>

        {/* ========================================== */}
        {/*   NEWLY IMPLEMENTED IMAGE APPROVAL BLOCK  */}
        {/* ========================================== */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-serif text-stone-800 font-semibold">Image Approval</h4>
            <Link href="#" className="text-xs font-bold tracking-wider text-[#C99D5A] hover:opacity-80 uppercase font-sans">
              View Gallery (8)
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageRequests.map((request) => (
              <div 
                key={request.id} 
                className="bg-white border border-[#EBE6DD] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                {/* Upper Thumbnail Block Area */}
                <div className="relative w-full h-64 bg-[#EDEAE4] flex items-center justify-center overflow-hidden">
                  {request.imageSrc ? (
                    // Render Image if available
                    <Image
                      src={request.imageSrc}
                      alt={request.title}
                      fill
                      className="object-cover object-center grayscale contrast-110"
                    />
                  ) : (
                    // Default Fallback Placeholder icon matching Card 2
                    <div className="flex flex-col items-center text-stone-400">
                      <ImageIcon size={44} strokeWidth={1.2} />
                    </div>
                  )}

                  {/* Absolute Status Badge overlay matching layout positions */}
                  <span className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm border border-stone-200/50 text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-md text-stone-500 uppercase">
                    {request.status}
                  </span>
                </div>

                {/* Bottom Body Card Info Block */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold tracking-widest text-[#B39254] uppercase font-sans">
                      {request.category}
                    </p>
                    <h5 className="text-lg font-serif text-stone-800 font-medium leading-snug">
                      {request.title}
                    </h5>
                    <p className="text-xs text-stone-400 font-medium">
                      Uploaded by: <span className="text-stone-600 font-semibold">{request.uploader}</span>
                    </p>
                  </div>

                  {/* Dual Action Controls Row */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => handleApproveImage(request.id)}
                      className="w-full py-2.5 border border-[#E0D9CE] rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#8A6D3B] hover:bg-stone-50 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectImage(request.id)}
                      className="w-full py-2.5 border border-red-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50/50 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* ========================================== */}

        {/* Communication Center */}
        <section className="space-y-6">
          <h4 className="text-lg font-semibold text-stone-900 font-serif">Communication Center</h4>
          <div className="bg-white border border-[#E6DED2] rounded-2xl p-8 shadow-sm flex items-start gap-8">
            <div className="w-1/3 space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                RECIPIENT GROUP
              </label>
              <select className="w-full text-xs font-medium px-4 py-3 border border-[#E6DED2] rounded-xl bg-white focus:ring-1 focus:ring-[#C99D5A] outline-none">
                <option>All Users</option>
                <option>Moderators Only</option>
                <option>New Registered Users</option>
              </select>
              <p className="p-4 bg-stone-50 border border-stone-100 rounded-xl text-xs text-stone-600 font-medium">
                Estimated Reach: <strong className="text-stone-800">4,289 recipients</strong>
              </p>
            </div>

            <div className="flex-1 space-y-6">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                MESSAGE CONTENT
              </label>
              <textarea
                rows={6}
                placeholder="Compose your bulk email message here..."
                className="w-full text-sm p-5 border border-[#E6DED2] rounded-2xl focus:ring-1 focus:ring-[#C99D5A] outline-none text-stone-800 placeholder-stone-400 resize-none"
              />
              <button className="px-6 py-3.5 bg-[#7A1C1C] rounded-xl text-xs font-semibold text-white hover:bg-[#681818] transition flex items-center gap-2 ml-auto">
                <MessageSquare size={16} />
                Send Broadcast
              </button>
            </div>
          </div>
        </section>

        {/* Pending Approvals */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-stone-900 font-serif">Pending Approvals</h4>
            <Link href="#" className="text-xs font-medium text-[#C99D5A] hover:underline">
              View All (4)
            </Link>
          </div>

          <div className="bg-white border border-[#E6DED2] rounded-2xl p-6 shadow-sm grid grid-cols-[1fr,1.5fr] gap-6 items-center">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-stone-100 rounded-2xl border border-stone-200 shrink-0 flex items-center justify-center text-stone-400 text-xs">
                Image
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#C99D5A] mb-1">
                  NEW MEMORIAL REQUEST
                </p>
                <p className="text-sm font-semibold text-stone-950">
                  {mockMemorialRequest.name}
                </p>
                <p className="text-xs italic text-stone-500 font-medium">
                  {mockMemorialRequest.quote}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pl-6 border-l border-stone-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleApproveMemorial(mockMemorialRequest.id)}
                  className="text-xs font-medium text-[#7A1C1C] hover:underline flex items-center gap-1.5"
                >
                  <ThumbsUp size={14} /> Approve
                </button>
                <button className="text-xs font-medium text-stone-600 hover:underline flex items-center gap-1.5">
                  <Search size={14} /> Review
                </button>
                <button className="text-xs font-medium text-[#c0392b] hover:underline flex items-center gap-1.5">
                  <X size={14} /> Reject
                </button>
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1.5 rounded-full border border-stone-100 bg-stone-50">
                PENDING REVIEW
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}