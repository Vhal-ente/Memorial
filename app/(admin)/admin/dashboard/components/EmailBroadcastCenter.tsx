"use client";

import React, { useState } from "react";
import { Send, ArrowRight, Pencil } from "lucide-react";
import { Editor } from "@/components/TextEditor";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BroadcastPayload {
  recipient: string;
  subject: string;
  body: string;
  attachments: File[];
}

// ─── Mock campaign data (replace with real API) ───────────────────────────────

const RECENT_CAMPAIGNS = [
  {
    id: "c-1",
    title: "Anniversary Memorial Services",
    target: "All Memory Holders",
    status: "sent" as const,
    sentAt: "Oct 24, 2024 · 09:00 AM",
    openRate: "74.2%",
    clicks: 128,
  },
  {
    id: "c-2",
    title: "Holiday Tribute Video Series",
    target: "Family & Relatives",
    status: "scheduled" as const,
    scheduledFor: "Nov 15, 2024 · 10:00 AM",
  },
  {
    id: "c-3",
    title: "New Community Guidelines",
    target: "All Active Users",
    status: "sent" as const,
    sentAt: "Oct 12, 2024 · 02:30 PM",
    openRate: "89.1%",
    clicks: 542,
  },
];

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: "sent" | "scheduled" }) {
  if (status === "scheduled") {
    return (
      <span className="text-[8px] font-bold tracking-widest text-orange-600 uppercase border border-orange-100 px-1.5 py-0.5 rounded bg-orange-50/40 shrink-0">
        Scheduled
      </span>
    );
  }
  return (
    <span className="text-[8px] font-bold tracking-widest text-stone-400 uppercase border border-stone-200 px-1.5 py-0.5 rounded bg-stone-50 shrink-0">
      Sent
    </span>
  );
}

// ─── Campaign card ────────────────────────────────────────────────────────────

function CampaignCard({ campaign }: { campaign: (typeof RECENT_CAMPAIGNS)[number] }) {
  return (
    <article className="bg-white border border-[#EDEAE4] rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-sans font-bold text-stone-800 text-xs sm:text-sm truncate">
            {campaign.title}
          </h4>
          <p className="text-[10px] text-stone-500 font-medium font-sans mt-0.5">
            {campaign.status === "sent" ? "Sent to" : "Target"}:{" "}
            {campaign.target}
          </p>
        </div>
        <StatusBadge status={campaign.status} />
      </div>

      {campaign.status === "sent" && campaign.openRate && (
        <div className="grid grid-cols-2 gap-4 border-y border-stone-100 py-3">
          <div>
            <p className="text-[9px] font-bold tracking-widest text-stone-400 uppercase font-sans">
              Open Rate
            </p>
            <p className="text-base font-bold text-stone-800 font-sans">
              {campaign.openRate}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold tracking-widest text-stone-400 uppercase font-sans">
              Clicks
            </p>
            <p className="text-base font-bold text-stone-800 font-sans">
              {campaign.clicks}
            </p>
          </div>
        </div>
      )}

      {campaign.status === "scheduled" && campaign.scheduledFor && (
        <div className="bg-stone-50 border border-stone-100 rounded-lg p-3 text-[10px] text-stone-500 font-medium font-sans italic">
          Scheduled for {campaign.scheduledFor}
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] text-stone-400 font-bold font-sans tracking-wide">
        <span>
          {campaign.status === "sent" ? campaign.sentAt : `Next run: ${campaign.scheduledFor}`}
        </span>
        <button
          type="button"
          aria-label={campaign.status === "scheduled" ? "Edit campaign" : "View campaign"}
          className="text-stone-400 hover:text-stone-700 transition-colors"
        >
          {campaign.status === "scheduled" ? (
            <Pencil size={12} />
          ) : (
            <ArrowRight size={14} />
          )}
        </button>
      </div>
    </article>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function EmailBroadcastCenter() {
  const [recipient, setRecipient] = useState("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const isValid = subject.trim().length > 0 && body.trim().length > 0;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const payload: BroadcastPayload = { recipient, subject, body, attachments };

    setIsSending(true);
    try {
      // TODO: replace with real API call
      await new Promise((res) => setTimeout(res, 1200));
      console.info("Broadcast payload:", payload);
      setSentSuccess(true);
      // Reset form after success
      setSubject("");
      setBody("");
      setAttachments([]);
      setTimeout(() => setSentSuccess(false), 3500);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = () => {
    // TODO: persist draft to API
    const draft: BroadcastPayload = { recipient, subject, body, attachments };
    console.info("Draft saved:", draft);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1.2fr,1fr] gap-8 items-start p-10">

      {/* ── Left: Compose ── */}
      <form onSubmit={handleSend} className="space-y-6" noValidate>
        <div className="border-b border-stone-200/60 pb-1.5">
          <h3 className="text-xl font-sans font-bold text-stone-800 tracking-wide">
            Compose Broadcast
          </h3>
        </div>

        <div className="bg-white border border-[#EDEAE4] rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">

          {/* Recipient */}
          <div className="space-y-2">
            <label
              htmlFor="recipient"
              className="block text-[10px] font-bold tracking-widest text-stone-400 uppercase font-sans"
            >
              Recipient Group
            </label>
            <select
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-transparent border-b border-stone-200 text-stone-800 text-xs py-2 outline-none focus:border-[#8A6D3B] font-sans font-medium transition-colors"
            >
              <option value="all">All Memory Holders</option>
              <option value="family">Family &amp; Relatives</option>
              <option value="active">All Active Users</option>
            </select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label
              htmlFor="subject"
              className="block text-[10px] font-bold tracking-widest text-stone-400 uppercase font-sans"
            >
              Subject Line
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter a meaningful subject…"
              required
              className="w-full bg-transparent border-b border-stone-200 text-stone-800 text-xs py-2 outline-none focus:border-[#8A6D3B] font-sans font-medium placeholder-stone-400 transition-colors"
            />
          </div>

          {/* Message body — real Editor */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold tracking-widest text-stone-400 uppercase font-sans">
              Message Body
            </label>
            <Editor
              value={body}
              onChange={setBody}
              onFilesChange={setAttachments}
              placeholder="Preserve the legacy through thoughtful words…"
            />
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="text-[10px] font-bold tracking-widest uppercase text-stone-400 hover:text-stone-700 font-sans transition-colors"
            >
              Save as Draft
            </button>

            <button
              type="submit"
              disabled={!isValid || isSending}
              className={[
                "px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all",
                isValid && !isSending
                  ? "bg-white border border-[#BA954A]/40 text-stone-700 hover:bg-[#FAF8F4] shadow-sm"
                  : "bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed",
              ].join(" ")}
            >
              <Send size={11} aria-hidden />
              {isSending ? "Sending…" : sentSuccess ? "Sent ✓" : "Send Broadcast"}
            </button>
          </div>

          {/* Success confirmation */}
          {sentSuccess && (
            <p className="text-[11px] text-center text-emerald-600 font-semibold font-sans animate-fade-in">
              Broadcast sent successfully.
            </p>
          )}
        </div>
      </form>

      {/* ── Right: Recent campaigns ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200/60 pb-1.5">
          <h3 className="text-xl font-sans font-bold text-stone-800 tracking-wide">
            Recent Campaigns
          </h3>
          <button
            type="button"
            className="text-[10px] font-bold tracking-widest uppercase text-[#8A6D3B] hover:opacity-75 font-sans transition-opacity"
          >
            View All
          </button>
        </div>

        <div className="space-y-4">
          {RECENT_CAMPAIGNS.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </div>

    </div>
  );
}