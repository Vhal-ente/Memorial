"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, Check, Clock1Icon, Pencil, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import toast from "react-hot-toast";

import {
  getAdminTributes,
  approveTribute,
  rejectTribute,
  deleteTribute,
} from "@/lib/api/tribute";

dayjs.extend(relativeTime);

interface TributeRequest {
  id: string;
  name: string;
  relation: string;
  message: string;
  date: string;
  timeAgo: string;
  attachmentUrl: string;
  initials: string;
  status: "pending" | "approved" | "rejected";
}

export default function TributeManagement() {
  const [tributes, setTributes] = useState<TributeRequest[]>([]);
  const [activeTab, setActiveTab] = useState("ALL");
  const [cursor, setCursor] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: "ALL", label: "All Tributes" },
    { id: "APPROVED", label: "Approved" },
    { id: "PENDING", label: "Pending" },
  ];

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

  const mapTributes = (items: any[]): TributeRequest[] => {
    return items.map((item) => ({
      id: String(item.id),
      name: item.authorName || "Anonymous",
      relation: item.relationship || "UNKNOWN",
      message: item.message || "",
      date: dayjs(item.createdAt).format("MMM D, YYYY"),
      timeAgo: dayjs(item.createdAt).fromNow(),
      attachmentUrl: item.attachmentUrl
        ? `${API_BASE}/uploads${item.attachmentUrl}`
        : "",
      initials:
        item.authorName
          ?.trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((word: string[]) => word[0])
          .join("")
          .toUpperCase() || "UN",
      status: item.status, // use API directly
    }));
  };

  const fetchTributes = async (nextCursor: number, append: boolean) => {
    setLoading(true);

    try {
      const data = await getAdminTributes(20, nextCursor);

      if (!data.success) return;

      const mapped = mapTributes(data.tributes || []);

      setTributes((prev) => (append ? [...prev, ...mapped] : mapped));

      setCursor(data.nextCursor ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      const data = await getAdminTributes(20, 0);

      if (ignore || !data.success) return;

      const mapped = mapTributes(data.tributes || []);

      setTributes(mapped);
      setCursor(data.nextCursor ?? null);
    };

    load();

    return () => {
      ignore = true;
    };
  }, []);

  const handleAction = async (id: string, action: string) => {
    const numericId = Number(id);

    try {
      if (action === "approve") {
        setTributes((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: "approved" } : t)),
        );

        await approveTribute(numericId);
        toast.success("Tribute approved");
      }

      if (action === "reject") {
        setTributes((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: "rejected" } : t)),
        );

        await rejectTribute(numericId);
        toast("Image rejected", {
          icon: "⚠️",
        });
      }

      if (action === "delete") {
        setTributes((prev) => prev.filter((t) => t.id !== id));

        await deleteTribute(numericId);
        toast.error("Image deleted");
      }
    } catch (error) {
      console.error(error);

      await fetchTributes(0, false);
      toast.error("Action failed. Reverted.");
    }
  };

  const loadMore = () => {
    if (cursor === null) return;
    fetchTributes(cursor, true);
  };

  const filteredTributes = tributes.filter((t) => {
    if (activeTab === "ALL") return true;
    return t.status === activeTab.toLowerCase();
  });

  const approvedTributes = tributes.filter((t) => t.status === "approved");

  return (
    <div className="space-y-10 p-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/60 pb-1">
        <div className="space-y-2 max-w-xl">
          <h2 className="text-4xl font-serif text-stone-900 tracking-tight">
            Tribute Management
          </h2>
          <p className="text-xs text-stone-500 font-medium">
            A digital sanctuary for preserving legacies.
          </p>
        </div>

        <div className="flex gap-6 text-xs font-bold uppercase border-b border-stone-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 relative ${
                activeTab === tab.id ? "text-[#8A6D3B]" : ""
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8A6D3B]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* LIST (your original layout preserved) */}
      <div className="space-y-4">
        {filteredTributes.map((tribute) => (
          <div
            key={tribute.id}
            className="bg-white border border-[#EDEAE4] rounded-xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row gap-6 items-start justify-between"
          >
            <div className="flex items-start gap-5 flex-1">
              {/* {tribute.attachmentUrl ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-stone-200/60 shrink-0 bg-stone-100">
                {tribute.attachmentUrl && (
                  <Image
                    src={tribute.attachmentUrl}
                    alt={tribute.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
                ) : ( */}
              <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-500 border border-stone-200 shrink-0">
                {tribute.initials}
              </div>
              {/* )} */}

              <div className="space-y-2.5 max-w-2xl">
                <div className="flex items-center gap-3 flex-wrap">
                  <h4 className="font-serif text-xl text-stone-900 font-semibold">
                    {tribute.name}
                  </h4>

                  <span className="text-[9px] font-bold tracking-widest font-sans bg-stone-100 text-stone-500 px-2 py-0.5 rounded border border-stone-200/40">
                    {tribute.relation}
                  </span>
                </div>

                <p className="text-stone-600 text-xs leading-relaxed font-sans font-medium">
                  {tribute.message}
                </p>

                <div className="flex items-center gap-4 text-[10px] text-stone-400 font-bold font-sans tracking-wide">
                  <span className="flex items-center gap-1">
                    {" "}
                    <Calendar size={12} strokeWidth={3} />
                    {tribute.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock1Icon size={12} strokeWidth={3} />
                    {tribute.timeAgo}{" "}
                  </span>
                </div>
              </div>
            </div>

            {/* ACTIONS (unchanged design) */}
            <div className="flex sm:flex-col items-end gap-2.5 w-full sm:w-auto shrink-0 pt-4 sm:pt-0 border-t sm:border-0 border-stone-100">
              {tribute.status === "pending" && (
                <>
                  <button
                    onClick={() => handleAction(tribute.id, "approve")}
                    className="flex-1 sm:w-28 py-2 bg-[#BA954A] text-white rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Check size={12} strokeWidth={3} />
                    Approve
                  </button>

                  <button
                    onClick={() => handleAction(tribute.id, "reject")}
                    className="flex-1 sm:w-28 py-2 bg-white border border-[#E0D9CE] text-stone-600 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Trash2 size={16} />
                    Reject
                  </button>
                </>
              )}

              {tribute.status === "approved" && (
                <>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-green-600">
                    <Check size={14} strokeWidth={3} />
                    Approved
                  </div>

                  <button
                    onClick={() => handleAction(tribute.id, "reject")}
                    className="mt-2 flex-1 sm:w-28 py-2 bg-white border border-[#E0D9CE] text-stone-600 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Trash2 size={16} />
                    Reject
                  </button>
                </>
              )}

              {tribute.status === "rejected" && (
                <>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-red-500">
                    <Trash2 size={14} />
                    Rejected
                  </div>

                  <button
                    onClick={() => handleAction(tribute.id, "approve")}
                    className="mt-2 flex-1 sm:w-28 py-2 bg-[#BA954A] text-white rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Check size={12} strokeWidth={3} />
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* RECENTLY APPROVED BEYOND SPLIT SECTION */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-[3px] h-4 bg-[#BA9436]" />
          <h4 className="text-xs font-bold tracking-widest text-stone-500 uppercase">
            Recently Approved
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {approvedTributes.map((approved) => (
            <div
              key={approved.id}
              className="bg-[#F5F1E9] border border-[#E9E4DA] rounded-xl p-5 flex items-center justify-between"
            >
              <div className="space-y-1">
                <h5 className="font-serif text-[15px] font-semibold text-stone-800">
                  {approved.name}
                </h5>
                <p className="text-[11px] text-stone-400 font-medium">
                  Approved by Admin Sarah &bull; {approved.timeAgo}
                </p>
              </div>
              {/* Little Badge Verification Checkmark */}
              <div className="w-5 h-5 rounded-full bg-[#BA9436] flex items-center justify-center text-white shrink-0">
                <Check size={11} strokeWidth={3} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center pt-6">
        <button
          onClick={loadMore}
          disabled={cursor === null || loading}
          className="px-6 py-2 bg-[#BA954A] text-white rounded"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
}
