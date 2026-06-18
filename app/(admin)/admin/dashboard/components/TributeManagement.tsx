
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, Pencil, Trash2 } from "lucide-react";

interface TributeRequest {
  id: string;
  name: string;
  relation: string;
  message: string;
  date: string;
  timeAgo: string;
  avatar: string;
}

const initialTributes: TributeRequest[] = [
  {
    id: "1",
    name: "Eleanor Vance",
    relation: "DAUGHTER",
    message: "Father always said that the garden was where he felt closest to heaven. I remember how he would spend hours tending to the roses, even in the heat of August. This platform captures his spirit perfectly...",
    date: "Oct 12, 2023",
    timeAgo: "2 hours ago",
    avatar: "/avatars/eleanor.jpg", // Replace with your image paths
  },
  {
    id: "2",
    name: "Julian Thorne",
    relation: "CLOSE FRIEND",
    message: "We served together in the Navy for nearly a decade. Julian wasn't just a captain; he was a mentor who taught me the true meaning of integrity. I've uploaded a few photos from our time in the Mediterranean...",
    date: "Oct 11, 2023",
    timeAgo: "14 hours ago",
    avatar: "/avatars/julian.jpg",
  }
];

export default function TributeManagement() {
  const [tributes, setTributes] = useState<TributeRequest[]>(initialTributes);
  const [activeTab, setActiveTab] = useState("Pending");

  const handleAction = (id: string, action: string) => {
    console.log(`${action} tribute: ${id}`);
    setTributes(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-10 p-10">
      {/* View Header Meta */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/60 pb-1">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-4xl font-serif text-stone-900 tracking-tight">Tribute Management</h2>
          <p className="text-xs text-stone-500 font-medium leading-relaxed font-sans">
            A digital sanctuary for preserving legacies. Review and manage the heartfelt stories shared by family and friends.
          </p>
        </div>
        
        {/* Custom Tab Triggers */}
        <div className="flex gap-6 font-sans text-xs font-bold tracking-wider text-stone-500 uppercase border-b border-stone-200 w-full md:w-auto">
          {["Pending", "All Tributes", "Archived"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 transition-all relative ${activeTab === tab ? "text-[#8A6D3B]" : "hover:text-stone-800"}`}
            >
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8A6D3B]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Main Review List Stack */}
      <div className="space-y-4">
        {tributes.map((tribute) => (
          <div key={tribute.id} className="bg-white border border-[#EDEAE4] rounded-xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start justify-between">
            <div className="flex items-start gap-5 flex-1">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-stone-200/60 shrink-0 bg-stone-100">
                {tribute.avatar && (
                  <Image src={tribute.avatar} alt={tribute.name} fill className="object-cover" />
                )}
              </div>
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-serif text-xl text-stone-900 font-semibold">{tribute.name}</h4>
                  <span className="text-[9px] font-bold tracking-widest font-sans bg-stone-100 text-stone-500 px-2 py-0.5 rounded border border-stone-200/40">
                    {tribute.relation}
                  </span>
                </div>
                <p className="text-stone-600 text-xs leading-relaxed font-sans font-medium">
                  {tribute.message}
                </p>
                <div className="flex items-center gap-4 text-[10px] text-stone-400 font-bold font-sans tracking-wide">
                  <span>📅 {tribute.date}</span>
                  <span>⏱️ {tribute.timeAgo}</span>
                </div>
              </div>
            </div>

            {/* Action Group */}
            <div className="flex sm:flex-col items-end gap-2.5 w-full sm:w-auto shrink-0 pt-4 sm:pt-0 border-t sm:border-0 border-stone-100">
              <button 
                onClick={() => handleAction(tribute.id, "approve")}
                className="flex-1 sm:w-28 py-2 bg-[#BA954A] hover:bg-[#A3813C] text-white rounded-md text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check size={12} strokeWidth={3} /> Approve
              </button>
              <button 
                onClick={() => handleAction(tribute.id, "edit")}
                className="flex-1 sm:w-28 py-2 bg-white border border-[#E0D9CE] hover:bg-stone-50 text-stone-600 rounded-md text-[10px] font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Pencil size={11} /> Edit
              </button>
              <button 
                onClick={() => handleAction(tribute.id, "reject")}
                className="p-2 sm:w-28 text-stone-400 hover:text-red-500 hover:bg-red-50/40 rounded-md transition flex items-center justify-center border border-transparent hover:border-red-100/60"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lower Dashboard Footprint Sub-Grid */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 border-l-2 border-[#8A6D3B] pl-3">
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-stone-500 font-sans">Recently Approved</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Marcus Sterling", "Clara Whitby"].map((name, i) => (
            <div key={name} className="bg-[#FAF8F4]/80 border border-[#EDEAE4] rounded-xl p-5 flex items-center justify-between shadow-xs">
              <div className="space-y-0.5">
                <h5 className="font-serif font-medium text-stone-800 text-sm">{name}</h5>
                <p className="text-[10px] text-stone-400 font-medium font-sans">
                  Approved by Admin Sarah • {i === 0 ? "2 days ago" : "3 days ago"}
                </p>
              </div>
              <div className="w-5 h-5 rounded-full bg-[#BA954A]/10 text-[#BA954A] flex items-center justify-center text-xs">
                ✓
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}