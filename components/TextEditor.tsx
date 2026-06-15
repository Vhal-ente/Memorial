"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline"; // Import the extension
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, // Rename icon to avoid collision
  Strikethrough, 
  Link2, 
  ListOrdered, 
  List, 
  Quote, 
  Code, 
  Terminal 
} from "lucide-react";

interface EditorProps {
  value: string;
  onChange: (markdown: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, 
      }),
      Underline, // Add underline extension here
      Markdown,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-amber-400 underline cursor-pointer",
        },
      }),
    ],
    content: value,
    contentType: "markdown",
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none text-sm min-h-[100px] max-h-[200px] overflow-y-auto focus:outline-none text-gray-800 placeholder-gray-500",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getMarkdown());
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

 const btnClass = (isActive: boolean) => `
    p-1.5 rounded transition-colors duration-150
    ${isActive ? "text-[#B18A42] bg-[#FAF8F5] border border-[#E6DED2]" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}
  `;

  return (
    <div 
      className="w-full bg-White border border-[#E6DED2] rounded-lg overflow-hidden transition-all focus-within:border-zinc-400"
      onClick={() => editor.commands.focus()}
    >
      {/* Top Formatting Toolbar Layer */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-[#3A3F47] bg-[#C9A35A] select-none">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))}>
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive("italic"))}>
          <Italic size={16} />
        </button>
        
        {/* NEW: Underline Button Implementation */}
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive("underline"))}>
          <UnderlineIcon size={16} />
        </button>
        
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive("strike"))}>
          <Strikethrough size={16} />
        </button>

        <div className="w-px h-4 bg-[#E6DED2] mx-1" />

        <button type="button" onClick={setLink} className={btnClass(editor.isActive("link"))}>
          <Link2 size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive("orderedList"))}>
          <ListOrdered size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))}>
          <List size={16} />
        </button>

        <div className="w-px h-4 bg-[#E6DED2] mx-1" />

        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive("blockquote"))}>
          <Quote size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={btnClass(editor.isActive("code"))}>
          <Code size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnClass(editor.isActive("codeBlock"))}>
          <Terminal size={16} />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="p-3 cursor-text relative mini-scrollbar">
        {editor.isEmpty && (
          <div className="absolute top-3 left-3 text-gray-400 text-sm pointer-events-none select-none">
            Share a story or a heartfelt message...
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};