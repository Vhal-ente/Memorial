"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Search, Trash2 } from "lucide-react";
import { getAdminImages, deleteImage, restoreImage } from "@/lib/api/gallery";
import toast from "react-hot-toast";

interface ApiImage {
  id: number;
  title: string;
  description: string;
  filename: string;
  category: string;
  uploadedBy: string;
  thumbUrl: string;
  mediumUrl: string;
  originalUrl: string;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}

interface MediaRequest {
  id: string;
  title: string;
  uploader: string;
  quote: string;
  imageSrc: string;
  avatarSrc?: string;
  initials: string;
  status: "PENDING" | "APPROVED";
}

export default function GalleryManagement() {
  const [mediaItems, setMediaItems] = useState<MediaRequest[]>([]);
const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [cursor, setCursor] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const mapApiToUi = (items: ApiImage[]): MediaRequest[] => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

    return items.map((item) => {
      const path = item.mediumUrl || item.thumbUrl || item.originalUrl || "";

      return {
        id: String(item.id),
        title: item.title || "Untitled",
        uploader: item.uploadedBy || "Anonymous", // Map to dynamic uploader if added to your schema later
        quote: item.description,
        imageSrc: path ? `${API_BASE}/uploads${path}` : "",
        avatarSrc: undefined,
        initials: item.title?.slice(0, 2).toUpperCase() || "UN",
        // API has isDeleted: true/false. Mapping true to PENDING, false to APPROVED for review state
        status: item.isDeleted ? "PENDING" : "APPROVED",
      };
    });
  };

  const fetchImages = async (nextCursor: number, append: boolean) => {
    setLoading(true);
    try {
      const data = await getAdminImages(20, nextCursor);
      if (!data.success) return;
      const mapped = mapApiToUi(data.data || []);
      setMediaItems((prev) => (append ? [...prev, ...mapped] : mapped));
      setCursor(data.nextCursor);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      setLoading(true);
      try {
        const data = await getAdminImages(20, 0);
        if (ignore || !data.success) return;
        const mapped = mapApiToUi(data.data || []);
        setMediaItems(mapped);
        setCursor(data.nextCursor);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, []);

  const loadMore = () => {
    if (cursor === null) return;
    fetchImages(cursor, true);
  };

  const handleAction = async (id: string, action: string) => {
    const numericId = Number(id);

    // snapshot for rollback
    const snapshot = mediaItems;

    try {
      if (action === "approve") {
        setMediaItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: "APPROVED" }
              : item
          )
        );

        await restoreImage(numericId);
       toast.success("Image approved");
      }

      // if (action === "reject") {
      //   setMediaItems((prev) =>
      //     prev.map((item) =>
      //       item.id === id
      //         ? { ...item, status: "PENDING" }
      //         : item
      //     )
      //   );

      //   await rejectImage(numericId);
      //  toast("Image rejected", {
      //   icon: "⚠️",
      // });
      // }

      if (action === "delete") {
        setMediaItems((prev) => prev.filter((item) => item.id !== id));

        await deleteImage(numericId);
         toast.error("Image deleted");
      }
    } catch (error) {
      console.error(error);

      // rollback UI on failure
      setMediaItems(snapshot);
      toast.error("Action failed. Reverted.");
    }
  };

  const confirmDelete = async () => {
  if (!confirmDeleteId) return;

  const id = confirmDeleteId;
  const numericId = Number(id);

  const snapshot = mediaItems;

  try {
    setMediaItems((prev) =>
      prev.filter((item) => item.id !== id)
    );

    setConfirmDeleteId(null);

    await deleteImage(numericId);

    toast.success("Image deleted");
  } catch (error) {
    console.error(error);

    setMediaItems(snapshot);

    toast.error("Delete failed. Reverted.");
  }
};

const cancelDelete = () => {
  setConfirmDeleteId(null);
};

  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.quote.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "ALL" ? true : item.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="bg-[#FAF6F0] min-h-screen p-10 font-sans text-stone-800">
      {/* Header Controls */}
      <div className="max-w-7xl mx-auto space-y-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-serif text-stone-900 tracking-tight">
              Gallery Management
            </h1>
            <p className="text-sm text-stone-600">
              Review and curate media shared by the community.
            </p>
          </div>

          <div className="relative w-full md:max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              size={16}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by name or tribute..."
              className="w-full bg-white border border-stone-200 rounded-md pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-[#7A6030] focus:border-[#7A6030] outline-none placeholder-stone-400"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 border-b border-stone-200/80 text-xs font-semibold uppercase tracking-wider text-stone-400">
          {[
            { id: "ALL", label: "All Photos" },
            { id: "APPROVED", label: "Approved" },
            { id: "PENDING", label: "Pending" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 relative transition-colors ${
                activeTab === tab.id ? "text-[#7A6030]" : "hover:text-stone-700"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#7A6030]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden flex flex-col justify-between"
          >
            {/* Top Media Image container */}
            <div className="relative aspect-[4/3] bg-stone-900 w-full overflow-hidden">
              <Image
                src={item.imageSrc || "/placeholder.jpg"}
                alt={item.title}
                fill
                className="object-cover opacity-95"
              />

              {/* Status Badge */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7A6030]" />
                <span className="text-[10px] font-bold tracking-wider text-stone-700 uppercase">
                  {item.status}
                </span>
              </div>
            </div>

            {/* Content & Action Info Block */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              {/* Profile / Uploader Info */}
              <div className="flex items-center gap-3">
                {item.avatarSrc ? (
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-stone-100">
                    <Image
                      src={item.avatarSrc}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-500 border border-stone-200 shrink-0">
                    {item.initials}
                  </div>
                )}
                <div className="leading-tight">
                  <h4 className="font-semibold text-sm text-stone-900">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Uploaded by{" "}
                    <span className="text-stone-600">{item.uploader}</span>
                  </p>
                </div>
              </div>

              {/* Description Snippet */}
              <p className="text-xs text-stone-600 italic leading-relaxed line-clamp-2">
                &ldquo;{item.quote}&rdquo;
              </p>

              {/* Approval/Delete Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {item.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleAction(item.id, "approve")}
                      className="flex-1 py-2.5 bg-[#7A6030] text-white text-xs font-bold uppercase tracking-wider rounded"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleAction(item.id, "delete")}
                      className="p-2.5 border border-red-200 text-red-500 hover:bg-red-50 rounded"
                      aria-label="Delete item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </>
                )}

                {item.status === "APPROVED" && (
                  <>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-green-600">
                      Approved
                    </div>

                    <button
                     onClick={() => setConfirmDeleteId(item.id)}
                      className="p-2.5 border border-red-200 text-red-500 hover:bg-red-50 rounded"
                      aria-label="Delete item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-2 pt-8 mt-10 border-t border-stone-200/60">
        <button
          onClick={loadMore}
          disabled={loading || cursor === null}
          className="px-6 py-2.5 border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold uppercase tracking-wider rounded shadow-sm disabled:opacity-50 transition-colors"
        >
          {loading ? "Loading..." : "Load More Submissions"}
        </button>

        <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">
          Showing {mediaItems.length} items
        </span>
      </div>

      {confirmDeleteId && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-sm space-y-4 shadow-lg">
      <h3 className="text-sm font-bold text-stone-800">
        Confirm Delete
      </h3>

      <p className="text-xs text-stone-500">
        This action removes the image permanently.
      </p>

      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={confirmDelete}
          className="flex-1 bg-red-500 text-white text-xs font-bold py-2 rounded"
        >
          Delete
        </button>

        <button
          onClick={cancelDelete}
          className="flex-1 bg-stone-100 text-stone-700 text-xs font-bold py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
