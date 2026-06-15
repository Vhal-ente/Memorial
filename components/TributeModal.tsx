"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { X, Camera, Flame } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Editor } from "@/components/TextEditor";

interface CreateTributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TributeFormData) => void;
}

export interface TributeFormData {
  fullName: string;
  email: string;
  relationship: string;
  message: string;
  media: File | null;
  lightCandle: boolean;
  captchaToken: string;
}

export const TributeModal: React.FC<CreateTributeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<TributeFormData>({
    fullName: "",
    email: "",
    relationship: "",
    message: "",
    media: null,
    lightCandle: false,
    captchaToken: "",
  });

  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [, startTransition] = useTransition();

  // Clear modal fields completely upon closing out
  useEffect(() => {
    if (!isOpen) {
      startTransition(() => {
        setFormData({
          fullName: "",
          email: "",
          relationship: "",
          message: "",
          media: null,
          lightCandle: false,
          captchaToken: "",
        });
        setMediaPreview(null);
        setMediaType(null);
      });
    }
  }, [isOpen, startTransition]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (markdownOutput: string) => {
    setFormData((prev) => ({ ...prev, message: markdownOutput }));
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Only images and videos are allowed");
      return;
    }

    setFormData((prev) => ({ ...prev, media: file }));
    setMediaType(isImage ? "image" : "video");
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.message || formData.message.trim() === "") {
      alert("Please write a tribute message");
      return;
    }

    if (!formData.captchaToken) {
      alert("Please complete the verification");
      return;
    }

    onSubmit(formData);
  };

  return (
  <div className="fixed inset-0 z-[99999] ">
    <div 
    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-lg p-2 sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="
          w-full
          max-w-[95vw]
          sm:max-w-lg
          bg-[#FCFBF8]
          rounded-xl
          shadow-xl
          overflow-hidden
          flex
          flex-col
          max-h-[95dvh]
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-[#E6DED2] shrink-0">
          <div className="pr-4">
            <h2 className="text-base sm:text-lg font-semibold text-[#6F5325]">
              Create Tribute
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 italic">
              Preserve a cherished memory in our digital sanctuary.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-5 space-y-4"
          >
            <div>
              <label className="block mb-1 text-[10px] font-semibold tracking-wide text-gray-600 uppercase">
                Your Name
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="
                  w-full
                  h-11
                  px-3
                  text-sm
                  border
                  border-[#E6DED2]
                  rounded
                  bg-white
                  text-gray-700
                  focus:outline-none
                "
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-[10px] font-semibold tracking-wide text-gray-600 uppercase">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="
                  w-full
                  h-11
                  px-3
                  text-sm
                  border
                  border-[#E6DED2]
                  rounded
                  bg-white
                  text-gray-700
                  focus:outline-none
                "
                required
              />
            </div>

          <div>
  <label className="block mb-1 text-[10px] font-semibold tracking-wide text-gray-600 uppercase">
    Relationship
  </label>

  <select
    name="relationship"
    value={formData.relationship}
    onChange={handleInputChange}
    className="w-full h-11 px-3 rounded-xl bg-[#FCFBF8] border border-[#E6DED2] text-gray-700 text-sm focus:outline-none"
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
            

            <div className="min-w-0">
              <label className="block mb-1 text-[10px] font-semibold tracking-wide text-gray-600 uppercase">
                Tribute Message
              </label>

              <div className="overflow-hidden">
                <Editor
                  value={formData.message}
                  onChange={handleEditorChange}
                />
              </div>
            </div>

            <div className="flex justify-center overflow-x-auto">
              <Turnstile
                siteKey={
                  process.env
                    .NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!
                }
                onSuccess={(token) =>
                  setFormData((prev) => ({
                    ...prev,
                    captchaToken: token,
                  }))
                }
                onExpire={() =>
                  setFormData((prev) => ({
                    ...prev,
                    captchaToken: "",
                  }))
                }
              />
            </div>

            <button
              type="submit"
              className="
                w-full
                h-11
                bg-[#C9A35A]
                hover:bg-[#B99248]
                text-white
                text-xs
                font-semibold
                uppercase
                tracking-wide
                rounded
              "
            >
              Share Memorial Tribute
            </button>

            <p className="text-[10px] sm:text-xs text-center text-gray-400">
              Your tribute will be reviewed before appearing in the public
              sanctuary.
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
);
};