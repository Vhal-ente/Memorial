"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Editor } from "@/components/TextEditor";
import { api } from "@/lib/api/axios";

interface Tribute {
  id: number;
  title: string;
  message: string;
  authorName: string;
  relationship: string;
  email: string;
  phoneNumber: string;
  attachmentUrl?: string;
  attachmentType?: string;
  status: string;
  createdAt: string;
}

interface TributeFormFields {
  fullName: string;
  email: string;
  phoneNumber: string;
  relationship: string;
  message: string;
}

const PAGE_SIZE = 20;

const EMPTY_FORM: TributeFormFields = {
  fullName: "",
  email: "",
  phoneNumber: "",
  relationship: "",
  message: "",
};

/* Main Export View Interface Screen Container Component */
export default function TributesPage() {
  const [formData, setFormData] = useState<TributeFormFields>(EMPTY_FORM);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  

 const loadTributes = useCallback(async (cursor: number, isInitial: boolean) => {
  try {
    isInitial ? setLoading(true) : setLoadingMore(true);

    const { data } = await api.get(
      `/api/tribute?limit=${PAGE_SIZE}${cursor ? `&cursor=${cursor}` : ""}`
    );

    if (data.success) {
      const newTributes: Tribute[] = data.tributes || [];
      setTributes((prev) => isInitial ? newTributes : [...prev, ...newTributes]);
      setHasMore(newTributes.length === PAGE_SIZE);
    }
  } catch (error) {
    console.error("Error fetching tributes:", error);
  } finally {
    isInitial ? setLoading(false) : setLoadingMore(false);
  }
}, []);



useEffect(() => {
  let cancelled = false;

  (async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/tribute?limit=${PAGE_SIZE}`);
      if (!cancelled && data.success) {
        const newTributes: Tribute[] = data.tributes || [];
        setTributes(newTributes);
        setHasMore(newTributes.length === PAGE_SIZE);
      }
    } catch (error) {
      if (!cancelled) console.error("Error fetching tributes:", error);
    } finally {
      if (!cancelled) setLoading(false);
    }
  })();

  return () => { cancelled = true; };
}, []);

 const handleLoadMore = () => {
  if (hasMore && !loadingMore) {
    loadTributes(tributes.length, false);
  }
};

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (markdownOutput: string) => {
    setFormData((prev) => ({ ...prev, message: markdownOutput }));
  };

  const handleTributeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.message || formData.message.trim() === "") {
      setSubmitError("Please write a tribute message");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const payload = new FormData();

      payload.append("authorName", formData.fullName);
      payload.append("title", `Tribute from ${formData.fullName}`);
      payload.append("message", formData.message);
      payload.append("relationship", formData.relationship);
      payload.append("email", formData.email);
      payload.append("phoneNumber", formData.phoneNumber)

      // The API accepts a single attachment; the editor allows attaching
      // multiple files, so only the first is sent.
      if (attachedFiles.length > 0) {
        payload.append("file", attachedFiles[0]);
      }

      const { data } = await api.post("/api/tribute", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setFormData(EMPTY_FORM);
        setAttachedFiles([]);
        loadTributes(0, true);
      } else {
        setSubmitError(data.message || "Failed to submit tribute");
      }
    } catch (error: any) {
      console.error(error);
      setSubmitError(
        error?.response?.data?.message || "Failed to submit tribute",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen px-0 sm:px-6 lg:px-8 pb-16 sm:pb-24 text-left bg-[#FCFBF8]">
      {/* Top Section Headers inside the workspace frame */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
        <h2 className="text-2xl sm:text-3xl font-serif text-[#7A1C1C] font-bold tracking-wide">
          Tributes & Condolences
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed tracking-wide px-2 sm:px-0">
          A space to share cherished memories, light a candle, and offer comfort
          to the family.
        </p>
      </div>

      {/* Main 2-Column Split Component Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start max-w-7xl mx-auto">
        {/* LEFT COLUMN: Community Tributes Stream Stack */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6 w-full">
          {loading && (
            <div className="space-y-4 sm:space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm border border-[#E6DED2]/60 animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-stone-200" />
                    <div className="space-y-2">
                      <div className="h-3 w-32 bg-stone-200 rounded" />
                      <div className="h-2 w-20 bg-stone-100 rounded" />
                    </div>
                  </div>
                  <div className="h-3 w-full bg-stone-100 rounded" />
                  <div className="h-3 w-5/6 bg-stone-100 rounded" />
                </div>
              ))}
            </div>
          )}

          {!loading && tributes.length === 0 && (
            <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-[#E6DED2]/60 text-center">
              <p className="text-sm text-stone-500">
                No tributes have been shared yet. Be the first to leave one.
              </p>
            </div>
          )}

          {!loading &&
            tributes.map((tribute) => (
              <div
                key={tribute.id}
                className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm border border-[#E6DED2]/60 space-y-4 sm:space-y-5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#FCFBF8] flex items-center justify-center border-2 border-[#D4AF37]/30 shrink-0">
                    <span className="text-xs font-sans font-bold text-[#7A1C1C]">
                      {tribute.authorName
                        ?.trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((word: string) => word[0])
                        .join("")
                        .toUpperCase() || "UN"}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-stone-800 tracking-wide font-sans">
                      {tribute.authorName}
                    </h4>

                    <p className="text-xs text-stone-400 font-light">
                      <span className="text-[#7A1C1C] font-semibold">
                        {tribute.relationship}
                      </span>
                      {" • "}
                      {new Date(tribute.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {tribute.title && (
                  <h3 className="font-semibold text-stone-800 text-base">
                    {tribute.title}
                  </h3>
                )}

                <div
                  className="text-stone-600 leading-relaxed text-sm italic font-sans sm:pl-1"
                  dangerouslySetInnerHTML={{
                    __html: tribute.message,
                  }}
                />

                {tribute.attachmentUrl && tribute.attachmentType === "image" && (
                  <div className="relative w-full sm:w-64 h-44 sm:h-36 rounded-xl overflow-hidden shadow-sm my-2 p-1 bg-white ring-1 ring-[#E6DED2]">
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL ?? ""}/uploads${tribute.attachmentUrl}`}
                        alt={tribute.title || "Tribute Image"}
                        fill
                        sizes="(max-width: 640px) 100vw, 256px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {tribute.attachmentUrl && tribute.attachmentType === "video" && (
                  <video controls className="w-full rounded-xl">
                    <source
                      src={`${process.env.NEXT_PUBLIC_API_URL ?? ""}${tribute.attachmentUrl}`}
                    />
                  </video>
                )}

                <div className="pt-4 border-t border-stone-100 text-xs text-stone-400">
                  Posted tribute
                </div>
              </div>
            ))}

          {/* Pagination Button */}
          {!loading && hasMore && tributes.length > 0 && (
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="w-full sm:w-auto border border-[#E6DED2] text-stone-700 font-semibold text-xs px-8 py-3.5 rounded-full hover:bg-[#7A1C1C] hover:text-white hover:border-[#7A1C1C] transition-all uppercase tracking-widest bg-white shadow-sm text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? "Loading..." : "View Earlier Tributes"}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Submission Card Widget Forms */}
        <div className="lg:col-span-4 space-y-6 w-full">
          <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-7 shadow-sm border border-[#E6DED2]/60 space-y-5">
            <h3 className="text-xs font-bold text-[#7A1C1C] uppercase tracking-wider font-sans">
              Leave a Tribute
            </h3>

            <form className="space-y-4 text-xs" onSubmit={handleTributeSubmit}>
              <div className="space-y-1.5">
                <label className="text-stone-500 font-semibold uppercase tracking-wide text-[10px]">
                  Your Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full p-3 rounded-xl bg-[#FCFBF8] border border-[#E6DED2] text-stone-800 font-medium placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] disabled:opacity-60"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-500 font-semibold uppercase tracking-wide text-[10px]">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full p-3 rounded-xl bg-[#FCFBF8] border border-[#E6DED2] text-stone-800 font-medium placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] disabled:opacity-60"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-500 font-semibold uppercase tracking-wide text-[10px]">
                 Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter your phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full p-3 rounded-xl bg-[#FCFBF8] border border-[#E6DED2] text-stone-800 font-medium placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] disabled:opacity-60"
                  required
                />   
                </div>           

              <div className="space-y-1.5">
                <label className="text-stone-500 font-semibold uppercase tracking-wide text-[10px]">
                  Relationship
                </label>
                <select
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className="w-full p-3 rounded-xl bg-[#FCFBF8] border border-[#E6DED2] text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#D4AF37] disabled:opacity-60"
                  required
                >
                  <option value="" disabled>
                    Select relationship
                  </option>
                  <option value="Friend">Friend</option>
                  <option value="Family">Family</option>
                  <option value="Colleague">Colleague</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-500 font-semibold uppercase tracking-wide text-[10px]">
                  Tribute Message
                </label>
                <div className="rounded-xl overflow-hidden bg-white">
                  <Editor
                    value={formData.message}
                    onChange={handleEditorChange}
                    onFilesChange={setAttachedFiles}
                  />
                </div>
                {attachedFiles.length > 1 && (
                  <p className="text-[10px] text-stone-400">
                    Only the first attachment ({attachedFiles[0].name}) will
                    be submitted with your tribute.
                  </p>
                )}
              </div>

              {submitError && (
                <p className="text-[11px] text-red-600 font-medium">
                  {submitError}
                </p>
              )}

              {/* Primary Call to Action Button themed around the main rich red button styles */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#7A1C1C] text-white text-xs font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-[#991B1B] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {submitting ? "Posting..." : "Post Tribute"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}