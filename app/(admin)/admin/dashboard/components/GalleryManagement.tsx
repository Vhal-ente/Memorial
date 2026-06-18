
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, SlidersHorizontal, Trash2, Film } from "lucide-react";

interface MediaRequest {
  id: string;
  title: string;
  uploader: string;
  quote: string;
  type: "photo" | "video";
  duration?: string;
  imageSrc: string;
  initials: string;
}

const initialMedia: MediaRequest[] = [
  { id: "1", title: "Arthur J. Miller", uploader: "Sarah M.", quote: `"A photo from our final family trip to the Adirondacks. He was always happiest..."`, type: "photo", imageSrc: "/gallery/lake.jpg", initials: "SM" },
  { id: "2", title: "Elizabeth King", uploader: "Thomas K.", quote: `"Found this old Super 8 footage. It captures her laugh perfectly."`, type: "video", duration: "01:45", imageSrc: "/gallery/table.jpg", initials: "EK" },
  { id: "3", title: "Eleanor Vance", uploader: "James L.", quote: `"Her favorite place to sit and read."`, type: "photo", imageSrc: "/gallery/tree.jpg", initials: "EV" },
  { id: "4", title: "William Barnaby", uploader: "Peter B.", quote: `"A scan of a letter he wrote during the war."`, type: "photo", imageSrc: "/gallery/letter.jpg", initials: "WB" },
];

export default function GalleryManagement() {
  const [mediaItems, setMediaItems] = useState<MediaRequest[]>(initialMedia);
  const [activeTab, setActiveTab] = useState("PENDING");

  const handleAction = (id: string, action: string) => {
    console.log(`${action} file entry: ${id}`);
    setMediaItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8 p-10">
      {/* Top Header Block & Controls */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h2 className="text-4xl font-serif text-stone-900 tracking-tight">Gallery Management</h2>
            <p className="text-xs text-stone-500 font-medium font-sans">Review and curate media shared by the community.</p>
          </div>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={15} />
              <input 
                type="text" 
                placeholder="Search by name or tribute..." 
                className="w-full bg-white border border-[#EBE6DD] rounded-lg pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-[#8A6D3B] outline-none font-sans placeholder-stone-400 text-stone-800"
              />
            </div>
                </div>
          
          {/* Action Row Search & Fitlers */}
          <div className="flex flex-wrap items-center gap-3">
        {/* Categories Tab Track */}
        <div className="flex items-center gap-6 border-b border-stone-200 text-[10px] font-bold font-sans tracking-widest uppercase text-stone-400">
          {[
            { id: "PENDING", label: "PENDING", count: 12 },
            { id: "PHOTOS", label: "PHOTOS" },
            { id: "ARCHIVE", label: "ARCHIVE" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3.5 transition-all relative flex items-center gap-1.5 ${activeTab === tab.id ? "text-[#8A6D3B]" : "hover:text-stone-700"}`}
            >
              <span>{tab.label}</span>
              {tab.count && <span className="bg-[#8A6D3B] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{tab.count}</span>}
              {activeTab === tab.id && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8A6D3B]" />}
            </button>
          ))}
        </div>
          </div>
        </div>

      {/* Responsive Gallery Grid Framework */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mediaItems.map((item) => (
          <div key={item.id} className="bg-white border border-[#EDEAE4] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
            {/* Visual Thumbnail Frame */}
            <div className="relative aspect-video sm:aspect-square bg-stone-200 w-full overflow-hidden group">
              {item.imageSrc && (
                <Image src={item.imageSrc} alt={item.title} fill className="object-cover transition duration-300 group-hover:scale-[1.02]" />
              )}
              
              {/* Badge Overlays */}
              <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md border border-stone-200/40 px-2 py-0.5 rounded text-[8px] font-bold tracking-widest text-stone-500 uppercase flex items-center gap-1">
                {item.type === "video" && <Film size={10} />}
                {item.type === "video" ? "PENDING VIDEO" : "PENDING"}
              </div>

              {item.type === "video" && item.duration && (
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded">
                  {item.duration}
                </div>
              )}
            </div>

            {/* Information Asset Card Footer */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-[9px] font-bold text-stone-500 border border-stone-200/50 uppercase">
                    {item.initials}
                  </div>
                  <div>
                    <h5 className="font-serif font-semibold text-stone-800 text-sm">{item.title}</h5>
                    <p className="text-[10px] text-stone-400 font-medium font-sans">Uploaded by {item.uploader}</p>
                  </div>
                </div>
                <p className="text-stone-500 text-xs font-sans font-medium line-clamp-2 leading-relaxed italic">
                  {item.quote}
                </p>
              </div>

              {/* Component Buttons Block */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleAction(item.id, "approve")}
                  className="flex-1 py-2 bg-[#705624] hover:bg-[#5C461D] text-white text-[10px] font-bold uppercase tracking-widest rounded transition shadow-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(item.id, "delete")}
                  className="p-2 border border-stone-200 text-stone-400 hover:text-red-500 hover:bg-red-50/30 rounded transition shadow-xs"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Module Footprint */}
      <div className="flex flex-col items-center justify-center gap-2 pt-6 border-t border-stone-100">
        <button className="px-6 py-2.5 border border-[#BA954A] bg-white rounded text-[10px] font-bold font-sans uppercase tracking-widest text-[#705624] hover:bg-[#FAF8F4] transition shadow-xs">
          Load More Submissions
        </button>
        <span className="text-[10px] text-stone-400 font-semibold font-sans uppercase tracking-wider">
          Showing 4 of 12 pending items
        </span>
      </div>
    </div>
  );
}