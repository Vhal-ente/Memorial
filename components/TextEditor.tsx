"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link2,
  ListOrdered,
  List,
  Quote,
  Code,
  Terminal,
  Paperclip,
  FileText,
  X,
  UploadCloud,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface EditorProps {
  value: string;
  onChange: (markdown: string) => void;
  onFilesChange?: (files: File[]) => void;
  placeholder?: string;
}

interface AttachedFile {
  id: string;
  file: File;
  name: string;
  type: string;
  size: string;
  previewUrl: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SUPPORTED_TYPES = ["image/", "application/pdf"];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exp = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, exp)).toFixed(1)} ${units[exp]}`;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive = false,
  title,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    aria-label={title}
    aria-pressed={isActive}
    className={[
      "inline-flex items-center justify-center w-7 h-7 rounded-md transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
      isActive
        ? "bg-white/20 text-white shadow-inner"
        : "text-white/80 hover:text-white hover:bg-white/15",
    ].join(" ")}
  >
    {children}
  </button>
);

const Divider: React.FC = () => (
  <span className="inline-block w-px h-4 bg-white/20 mx-0.5 shrink-0" aria-hidden />
);

interface FileChipProps {
  item: AttachedFile;
  onRemove: (id: string, url: string) => void;
}

const FileChip: React.FC<FileChipProps> = ({ item, onRemove }) => {
  const isImage = item.type.startsWith("image/");

  return (
    <div className="group flex items-center gap-2 bg-white border border-stone-200 rounded-xl pl-1.5 pr-1.5 py-1.5 shadow-sm max-w-[220px]">
      {/* Thumbnail */}
      {isImage ? (
        <div className="w-8 h-8 rounded-lg overflow-hidden border border-stone-100 bg-stone-50 shrink-0">
          <img
            src={item.previewUrl}
            alt=""
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-700 shrink-0">
          <FileText size={15} />
        </div>
      )}

      {/* Label */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-stone-800 truncate leading-snug">
          {item.name}
        </p>
        <p className="text-[10px] text-stone-400 font-medium leading-none mt-0.5">
          {item.size}
        </p>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(item.id, item.previewUrl)}
        aria-label={`Remove ${item.name}`}
        className="w-5 h-5 flex items-center justify-center rounded-full text-stone-300 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
      >
        <X size={12} />
      </button>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  onFilesChange,
  placeholder = "Share a story or a heartfelt message…",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Underline,
      Markdown,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-amber-600 underline cursor-pointer" },
      }),
    ],
    content: value,
    contentType: "markdown",
    editorProps: {
      attributes: {
        class:
          "prose prose-stone prose-sm max-w-none min-h-[140px] max-h-[260px] overflow-y-auto focus:outline-none text-stone-800 p-3 leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getMarkdown()),
  });

  useEffect(() => {
    onFilesChange?.(attachedFiles.map((af) => af.file));
  }, [attachedFiles, onFilesChange]);

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const incoming = Array.from(files);
      const next: AttachedFile[] = [];

      for (const file of incoming) {
        const supported = SUPPORTED_TYPES.some((t) => file.type.startsWith(t));
        if (!supported) {
          // eslint-disable-next-line no-alert
          alert(`"${file.name}" is not supported. Please upload images or PDFs.`);
          continue;
        }
        if (file.size > MAX_FILE_BYTES) {
          // eslint-disable-next-line no-alert
          alert(`"${file.name}" exceeds the 10 MB limit.`);
          continue;
        }

        const previewUrl = URL.createObjectURL(file);
        const isImage = file.type.startsWith("image/");

        next.push({
          id: generateId(),
          file,
          name: file.name,
          type: file.type,
          size: formatFileSize(file.size),
          previewUrl,
        });
      }

      if (next.length > 0) {
        setAttachedFiles((prev) => [...prev, ...next]);
      }
    },
    [editor]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFiles(e.target.files);
      e.target.value = ""; // allow re-selecting the same file
    }
  };

  const removeFile = (id: string, url: string) => {
    URL.revokeObjectURL(url);
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear when leaving the component boundary, not child elements
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files);
    }
  };

  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL:", previous ?? "https://");
    if (url === null) return;
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div
      className={[
        "w-full bg-white border rounded-2xl overflow-hidden transition-all duration-150 relative",
        isDragging
          ? "border-[#C9A35A] ring-2 ring-[#C9A35A]/40"
          : "border-stone-200 focus-within:border-stone-400 focus-within:ring-1 focus-within:ring-stone-400/50",
      ].join(" ")}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInputChange}
        className="sr-only"
        multiple
        accept="image/*,application/pdf"
        tabIndex={-1}
        aria-hidden
      />

      {/* Drag-and-drop overlay */}
      {isDragging && (
        <div
          className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center gap-2 pointer-events-none"
          aria-hidden
        >
          <UploadCloud size={28} className="text-[#C9A35A]" />
          <p className="text-xs font-semibold text-stone-600 tracking-wide uppercase">
            Drop images or PDFs to attach
          </p>
        </div>
      )}

      {/* ── Toolbar ── */}
      <div
        className="flex flex-wrap items-center gap-0.5 px-2.5 py-2 border-b border-stone-200 bg-[#B8913A] select-none"
        role="toolbar"
        aria-label="Text formatting"
      >
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={14} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={14} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={setLink}
          isActive={editor.isActive("link")}
          title="Insert link"
        >
          <Link2 size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered list"
        >
          <ListOrdered size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet list"
        >
          <List size={14} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Inline code"
        >
          <Code size={14} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code block"
        >
          <Terminal size={14} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          title="Attach files"
        >
          <Paperclip size={14} />
        </ToolbarButton>
      </div>

      {/* ── Editor content ── */}
      <div
        className="relative bg-white cursor-text"
        onClick={() => editor.commands.focus()}
      >
        {editor.isEmpty && (
          <p
            className="absolute top-3 left-3 text-sm text-stone-400 pointer-events-none select-none"
            aria-hidden
          >
            {placeholder}
          </p>
        )}
        <EditorContent editor={editor} />
      </div>

      {/* ── Attached files ── */}
      {attachedFiles.length > 0 && (
        <div className="bg-stone-50 border-t border-stone-200 px-3 py-2.5 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
            Attachments · {attachedFiles.length}
          </p>
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((item) => (
              <FileChip key={item.id} item={item} onRemove={removeFile} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};