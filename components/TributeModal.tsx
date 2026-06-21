"use client";

import React, { useState, useEffect, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Editor } from "@/components/TextEditor";
import { api } from "@/lib/api/axios";

interface CreateTributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TributeFormData) => void;
}

export interface TributeFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  relationship: string;
  message: string;
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
    phoneNumber: "",
    relationship: "",
    message: "",
    captchaToken: "",
  });

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Clear modal fields completely upon closing out
  useEffect(() => {
    if (!isOpen) {
      startTransition(() => {
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          relationship: "",
          message: "",
          captchaToken: "",
        });
        setAttachedFiles([]);
        setSubmitError(null);
      });
    }
  }, [isOpen, startTransition]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (markdownOutput: string) => {
    setFormData((prev) => ({ ...prev, message: markdownOutput }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.message || formData.message.trim() === "") {
      setSubmitError("Please write a tribute message");
      return;
    }

    if (!formData.captchaToken) {
      setSubmitError("Please complete the verification");
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
      payload.append("phoneNumber", formData.phoneNumber);

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
        onSubmit({
          fullName: formData.fullName,
          message: formData.message,
          relationship: formData.relationship,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          captchaToken: formData.captchaToken,
        });
        onClose();
      } else {
        setSubmitError(data.message || "Failed to submit tribute");
      }
    } catch (error: any) {
      setSubmitError(
        error?.response?.data?.message ||
          "Something went wrong submitting your tribute. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center pt-9 sm:items-center justify-center bg-black/50 backdrop-blur-md p-0 sm:p-4 animate-fade-in">
      {/* Absolute background click wrapper safely nested below the modal target */}
      <div
        className="absolute inset-0"
        onClick={submitting ? undefined : onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="
          w-full
          sm:max-w-xl
          bg-[#FCFBF8]
          rounded-t-[1rem]
          rounded-b-[1rem]
          sm:rounded-3xl
          shadow-2xl
          relative
          z-10
          flex
          flex-col
          max-h-[90dvh]
          sm:max-h-[89dvh]
          overflow-hidden
          border border-stone-200/40
        "
      >
        {/* Header - Fixed & Scaled Safely */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-[#E6DED2] bg-[#FCFBF8] shrink-0">
          <div className="pr-4 text-left">
            <h2 className="text-base sm:text-lg font-serif text-[#7A1C1C] font-bold tracking-wide">
              Create Tribute
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium">
              Preserve a cherished memory in our digital sanctuary.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Close dialog"
          >
            <X size={18} className="text-stone-400" />
          </button>
        </div>

        {/* Scrollable Form Viewport Container */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-left pb-10"
        >
          {/* Full Name Input */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wide text-stone-500 uppercase">
              Your Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              disabled={submitting}
              className="
                w-full
                h-11
                px-4
                text-base
                sm:text-sm
                border
                border-[#E6DED2]
                rounded-xl
                bg-white
                text-stone-800
                focus:outline-none
                focus:border-[#D4AF37]
                focus:ring-1
                focus:ring-[#D4AF37]
                transition-all
                disabled:opacity-60
              "
              required
            />
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wide text-stone-500 uppercase">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              disabled={submitting}
              className="
                w-full
                h-11
                px-4
                text-base
                sm:text-sm
                border
                border-[#E6DED2]
                rounded-xl
                bg-white
                text-stone-800
                focus:outline-none
                focus:border-[#D4AF37]
                focus:ring-1
                focus:ring-[#D4AF37]
                transition-all
                disabled:opacity-60
              "
              required
            />
          </div>

          {/* Phone number Input */}
           <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wide text-stone-500 uppercase">
              Phone number
            </label>
            <input
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter your phone Number"
              disabled={submitting}
              className="
                w-full
                h-11
                px-4
                text-base
                sm:text-sm
                border
                border-[#E6DED2]
                rounded-xl
                bg-white
                text-stone-800
                focus:outline-none
                focus:border-[#D4AF37]
                focus:ring-1
                focus:ring-[#D4AF37]
                transition-all
                disabled:opacity-60
              "
              required
            />
          </div>
          
          {/* Relationship Selector */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wide text-stone-500 uppercase">
              Relationship
            </label>
            <select
              name="relationship"
              value={formData.relationship}
              onChange={handleInputChange}
              disabled={submitting}
              className="
                w-full 
                h-11 
                px-4 
                rounded-xl 
                bg-white 
                border 
                border-[#E6DED2] 
                text-stone-700 
                text-base
                sm:text-sm 
                focus:outline-none 
                focus:border-[#D4AF37]
                focus:ring-1
                focus:ring-[#D4AF37]
                transition-all
                appearance-none 
                bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23706E6B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] 
                bg-[length:10px_auto] 
                bg-[right_16px_center] 
                bg-no-repeat
                disabled:opacity-60
              "
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

          {/* Text Editor Container — handles its own file attachments
              (drag & drop, attach button, previews) via onFilesChange */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold tracking-wide text-stone-500 uppercase">
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
                Only the first attachment ({attachedFiles[0].name}) will be
                submitted with your tribute.
              </p>
            )}
          </div>

          {/* Verification Engine Track */}
          <div className="flex justify-center pt-2 max-w-full overflow-x-auto no-scrollbar">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
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

          {submitError && (
            <p className="text-xs text-center text-red-600 font-medium px-2">
              {submitError}
            </p>
          )}

          {/* Submission Stack block */}
          <div className="space-y-3 pt-2 shrink-0">
            <button
              type="submit"
              disabled={submitting}
              className="
                w-full
                h-12
                bg-[#C9A35A]
                hover:bg-[#B99248]
                text-white
                text-xs
                font-bold
                uppercase
                tracking-widest
                rounded-xl
                shadow-md
                transition-all
                active:scale-[0.99]
                disabled:opacity-60
                disabled:cursor-not-allowed
                disabled:active:scale-100
                flex
                items-center
                justify-center
                gap-2
              "
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? "Submitting..." : "Share Memorial Tribute"}
            </button>

            <p className="text-[10px] text-center text-stone-400 font-medium px-4 leading-normal">
              Your tribute will be reviewed before appearing in the public
              sanctuary.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
