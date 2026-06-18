"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  PlusCircle,
  ShieldCheck,
  XCircle,
  MessageSquare,
  ThumbsUp,
  X,
  ImageIcon,
} from "lucide-react";

import TributeManagement from "./components/TributeManagement";
import GalleryManagement from "./components/GalleryManagement";
import EmailBroadcastCenter from "./components/EmailBroadcastCenter";

export const dynamic = "force-dynamic";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TributeRequest {
  id: string;
  name: string;
  tribute: string;
}

interface MemorialRequest {
  id: string;
  name: string;
  quote: string;
}

interface ImageRequest {
  id: string;
  title: string;
  category: string;
  uploader: string;
  status: string;
  imageSrc: string | null;
}

// ─── Mock data (replace with real API calls) ──────────────────────────────────

const MOCK_TRIBUTE: TributeRequest = {
  id: "tribute-1",
  name: "Samuel Higgins",
  tribute: "A wonderful soul who will be missed by all...",
};

const MOCK_MEMORIAL: MemorialRequest = {
  id: "memorial-1",
  name: "Memorial for Eleanor Sterling",
  quote: "A legacy of kindness and grace...",
};

const INITIAL_IMAGE_REQUESTS: ImageRequest[] = [
  {
    id: "img-1",
    title: "Portrait of Eleanor Sterling",
    category: "Memorial Gallery",
    uploader: "James Sterling",
    status: "Pending",
    imageSrc: "/eleanor-portrait.jpg",
  },
  {
    id: "img-2",
    title: "Family Gathering 1985",
    category: "Archive Update",
    uploader: "Sarah Chen",
    status: "Review Required",
    imageSrc: null,
  },
];

// ─── Sub-view switcher ────────────────────────────────────────────────────────

function DashboardContent() {
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view");
  const [imageRequests, setImageRequests] = useState<ImageRequest[]>(INITIAL_IMAGE_REQUESTS);

  // TODO: replace with real API calls
  const handleApproveImage = (id: string) => {
    setImageRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRejectImage = (id: string) => {
    setImageRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleApproveTribute = (_id: string) => {
    // TODO: call API
  };

  const handleApproveMemorial = (_id: string) => {
    // TODO: call API
  };

  // Sub-view routing — no `dashboard` case to avoid circular render
  if (currentView === "tributes") return <TributeManagement />;
  if (currentView === "gallery")  return <GalleryManagement />;
  if (currentView === "emails")   return <EmailBroadcastCenter />;

  // ── Default overview ──
  return (
    <div className="p-10 space-y-12">

      {/* Header */}
      <section className="flex items-start justify-between">
        <div className="max-w-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#C99D5A] mb-1 font-sans">
            System Overview
          </p>
          <h2 className="text-5xl font-serif text-stone-950 font-bold">
            Admin Dashboard
          </h2>
        </div>
        <button
          type="button"
          className="px-6 py-2.5 bg-[#C99D5A] rounded-xl text-xs font-semibold text-white hover:bg-[#b88c4b] transition-colors flex items-center gap-2 shadow-sm"
        >
          <PlusCircle size={16} aria-hidden />
          Create Entry
        </button>
      </section>

      {/* Tribute queue */}
      <section aria-labelledby="tribute-queue-heading" className="space-y-6">
        <div className="flex items-center justify-between">
          <h3
            id="tribute-queue-heading"
            className="text-lg font-semibold text-stone-900 font-serif"
          >
            Tribute Queue
          </h3>
          {/* Replace 12 with a real count from your API */}
          <Link
            href="/admin/dashboard?view=tributes"
            className="text-xs font-medium text-[#C99D5A] hover:underline"
          >
            View all pending
          </Link>
        </div>

        <div className="bg-white border border-[#E6DED2] rounded-2xl p-6 shadow-sm flex items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E6DED2] flex items-center justify-center text-[#7A1C1C] shrink-0">
            <ShieldCheck size={22} aria-hidden />
          </div>
          <div className="flex-1 space-y-0.5 min-w-0">
            <p className="text-sm font-semibold text-stone-950 truncate">
              New tribute for &ldquo;{MOCK_TRIBUTE.name}&rdquo;
            </p>
            <p className="text-xs italic text-stone-500 font-medium truncate">
              {MOCK_TRIBUTE.tribute}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleApproveTribute(MOCK_TRIBUTE.id)}
              className="px-5 py-2.5 bg-[#7A1C1C] rounded-xl text-xs font-semibold text-white hover:bg-[#681818] transition-colors flex items-center gap-2"
            >
              <ShieldCheck size={15} aria-hidden />
              Approve
            </button>
            <button
              type="button"
              className="px-5 py-2.5 border border-[#E6DED2] rounded-xl text-xs font-semibold text-stone-700 hover:bg-[#FAF8F5] transition-colors flex items-center gap-2"
            >
              <XCircle size={15} aria-hidden />
              Reject
            </button>
          </div>
        </div>
      </section>

      {/* Image approval */}
      <section aria-labelledby="image-approval-heading" className="space-y-6">
        <div className="flex items-center justify-between">
          <h3
            id="image-approval-heading"
            className="text-lg font-serif text-stone-800 font-semibold"
          >
            Image Approval
          </h3>
          {/* Replace with a real total count from your API */}
          <Link
            href="/admin/dashboard?view=gallery"
            className="text-xs font-medium tracking-wider text-[#C99D5A] hover:opacity-80 hover:underline"
          >
            View Gallery
          </Link>
        </div>

        {imageRequests.length === 0 ? (
          <p className="text-sm text-stone-400 italic">No images pending review.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageRequests.map((request) => (
              <article
                key={request.id}
                className="bg-white border border-[#EBE6DD] rounded-2xl overflow-hidden shadow-sm flex flex-col"
              >
                <div className="relative w-full h-64 bg-[#EDEAE4] flex items-center justify-center overflow-hidden">
                  {request.imageSrc ? (
                    <Image
                      src={request.imageSrc}
                      alt={request.title}
                      fill
                      className="object-cover object-center grayscale contrast-110"
                    />
                  ) : (
                    <ImageIcon size={44} strokeWidth={1.2} className="text-stone-400" aria-hidden />
                  )}
                  <span className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm border border-stone-200/50 text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-md text-stone-500 uppercase">
                    {request.status}
                  </span>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold tracking-widest text-[#B39254] uppercase font-sans">
                      {request.category}
                    </p>
                    <h4 className="text-lg font-serif text-stone-800 font-medium leading-snug">
                      {request.title}
                    </h4>
                    <p className="text-xs text-stone-400 font-medium">
                      Uploaded by{" "}
                      <span className="text-stone-600 font-semibold">
                        {request.uploader}
                      </span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleApproveImage(request.id)}
                      className="w-full py-2.5 border border-[#E0D9CE] rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#8A6D3B] hover:bg-stone-50 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRejectImage(request.id)}
                      className="w-full py-2.5 border border-red-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50/50 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Communication center */}
      <section aria-labelledby="comms-heading" className="space-y-6">
        <h3
          id="comms-heading"
          className="text-lg font-semibold text-stone-900 font-serif"
        >
          Communication Center
        </h3>
        <div className="bg-white border border-[#E6DED2] rounded-2xl p-8 shadow-sm flex items-start gap-8">
          <div className="w-1/3 space-y-3">
            <label
              htmlFor="recipient-group"
              className="block text-[10px] font-bold uppercase tracking-wider text-stone-400"
            >
              Recipient Group
            </label>
            <select
              id="recipient-group"
              className="w-full text-xs font-medium px-4 py-3 border border-[#E6DED2] rounded-xl bg-white focus:ring-1 focus:ring-[#C99D5A] outline-none"
            >
              <option>All Users</option>
              <option>Moderators Only</option>
              <option>New Registered Users</option>
            </select>
            <div className="p-4 bg-stone-50 border border-stone-100 rounded-xl text-xs text-stone-600 font-medium">
              Estimated reach:{" "}
              {/* Replace with real count from your API */}
              <strong className="text-stone-800">4,289 recipients</strong>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <label
              htmlFor="broadcast-message"
              className="block text-[10px] font-bold uppercase tracking-wider text-stone-400"
            >
              Message Content
            </label>
            <textarea
              id="broadcast-message"
              rows={6}
              placeholder="Compose your broadcast message…"
              className="w-full text-sm p-5 border border-[#E6DED2] rounded-2xl focus:ring-1 focus:ring-[#C99D5A] outline-none text-stone-800 placeholder-stone-400 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="px-6 py-3.5 bg-[#7A1C1C] rounded-xl text-xs font-semibold text-white hover:bg-[#681818] transition-colors flex items-center gap-2"
              >
                <MessageSquare size={15} aria-hidden />
                Send Broadcast
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pending approvals */}
      {/* Lists all the pending approvals on the application be it tribute, image,  */}
      <section aria-labelledby="pending-heading" className="space-y-6">
        <div className="flex items-center justify-between">
          <h3
            id="pending-heading"
            className="text-lg font-semibold text-stone-900 font-serif"
          >
            Pending Approvals
          </h3>
          {/* Replace with real count from your API */}
          <Link href="#" className="text-xs font-medium text-[#C99D5A] hover:underline">
            View all
          </Link>
        </div>

        <div className="bg-white border border-[#E6DED2] rounded-2xl p-6 shadow-sm grid grid-cols-[1fr,1.5fr] gap-6 items-center">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-stone-100 rounded-2xl border border-stone-200 shrink-0 flex items-center justify-center text-stone-400">
              <ImageIcon size={28} strokeWidth={1.2} aria-hidden />
            </div>
            <div className="space-y-1 min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#C99D5A]">
                New Memorial Request
              </p>
              <p className="text-sm font-semibold text-stone-950 truncate">
                {MOCK_MEMORIAL.name}
              </p>
              <p className="text-xs italic text-stone-500 font-medium line-clamp-2">
                {MOCK_MEMORIAL.quote}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pl-6 border-l border-stone-100">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleApproveMemorial(MOCK_MEMORIAL.id)}
                className="text-xs font-medium text-[#7A1C1C] hover:underline flex items-center gap-1.5"
              >
                <ThumbsUp size={14} aria-hidden />
                Approve
              </button>
              <button
                type="button"
                className="text-xs font-medium text-stone-600 hover:underline flex items-center gap-1.5"
              >
                <Search size={14} aria-hidden />
                Review
              </button>
              <button
                type="button"
                className="text-xs font-medium text-red-500 hover:underline flex items-center gap-1.5"
              >
                <X size={14} aria-hidden />
                Reject
              </button>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-stone-400 px-3 py-1.5 rounded-full border border-stone-100 bg-stone-50">
              Pending Review
            </span>
          </div>
        </div>
      </section>

    </div>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-stone-400 uppercase tracking-widest animate-pulse font-sans">
          Loading dashboard…
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}