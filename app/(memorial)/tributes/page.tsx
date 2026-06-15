'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
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
  Terminal 
} from 'lucide-react';

/* Subcomponent: Toolbar Text Editor Layout Workspace */
interface TributeRichEditorProps {
  value: string;
  onChange: (markdown: string) => void;
}

const TributeRichEditor: React.FC<TributeRichEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, 
      }),
      Underline,
      Markdown,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#D4AF37] underline cursor-pointer",
        },
      }),
    ],
    content: value,
    contentType: "markdown",
    editorProps: {
      attributes: {
        class: "prose max-w-none text-xs min-h-[110px] max-h-[220px] overflow-y-auto focus:outline-none text-stone-700 placeholder-stone-400",
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
    p-1 rounded transition-colors duration-150
    ${isActive ? "text-[#7A1C1C] bg-stone-100 border border-stone-200/60" : "text-stone-400 hover:text-stone-700 hover:bg-stone-50"}
  `;

  return (
    <div 
      className="w-full bg-white border border-[#E6DED2] rounded-xl overflow-hidden transition-all focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37]/40"
      onClick={() => editor.commands.focus()}
    >
      {/* Top Action Formatting Toolbar Row */}
      <div className="flex items-center gap-1 px-2.5 py-1.5 border-b border-stone-200/60 bg-[#FCFBF8] select-none">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))}>
          <Bold size={13} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive("italic"))}>
          <Italic size={13} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive("underline"))}>
          <UnderlineIcon size={13} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive("strike"))}>
          <Strikethrough size={13} />
        </button>

        <div className="w-px h-3 bg-stone-200 mx-0.5" />

        <button type="button" onClick={setLink} className={btnClass(editor.isActive("link"))}>
          <Link2 size={13} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive("orderedList"))}>
          <ListOrdered size={13} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))}>
          <List size={13} />
        </button>

        <div className="w-px h-3 bg-stone-200 mx-0.5" />

        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive("blockquote"))}>
          <Quote size={13} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={btnClass(editor.isActive("code"))}>
          <Code size={13} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnClass(editor.isActive("codeBlock"))}>
          <Terminal size={13} />
        </button>
      </div>

      {/* Main Core Text Typing Zone Area */}
      <div className="p-3 cursor-text relative">
        {editor.isEmpty && (
          <div className="absolute top-3 left-3 text-stone-400 font-light pointer-events-none select-none">
            Share a cherished memory or words of comfort...
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};


/* Main Export View Interface Screen Container Component */
export default function TributesPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState("Friend");
  const [message, setMessage] = useState("");

  const tributesList = [
    {
      id: 1,
      name: 'Eleanor Sterling-Hayes',
      relationship: 'Daughter',
      date: 'Oct 14, 2023',
      avatar: '/images/avatars/eleanor.jpg', 
      badge: { type: 'memory', text: 'Memory Shared', icon: '✍️' },
      message: '"Dad always said that the best way to live was to leave the world a little brighter than you found it. Watching him in his workshop, meticulously crafting grandfather clocks, taught me that time is a gift we shape ourselves. We miss you every day, but your rhythm stays with us."',
      hasAffirmed: true,
    },
    {
      id: 2,
      name: 'Dr. Marcus Vance',
      relationship: 'Colleague',
      date: 'Oct 12, 2024',
      avatar: '/images/avatars/marcus.jpg',
      badge: { type: 'candle', text: 'Lit a Candle', icon: '🕯️' },
      message: '"Samuel was the heart of the department for thirty years. This photo was taken at the 1988 graduation. He always had a way of calming the most heated debates with a simple, \'Let\'s look at the horizon, not the dust at our feet.\' A true gentleman and scholar."',
      attachedImage: '/images/tributes/graduation-1988.jpg', 
      affirmationsCount: 12,
    },
    {
      id: 3,
      name: 'Robert Jenkins',
      relationship: 'Neighbor',
      date: 'Oct 10, 2024',
      avatar: '', 
      message: '"I\'ll never forget the rainy Saturday when Samuel spent four hours helping me fix my broken fence. He didn\'t just fix the wood; he shared stories about his childhood that I still carry with me. He was the kind of neighbor you only find once in a lifetime."',
      affirmationsCount: 0,
    }
  ];

  const handleTributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message || message.trim() === "") {
      alert("Please provide a tribute message text string.");
      return;
    }

    const compiledDataPayload = { fullName, email, relationship, message };
    console.log("Post Tribute Submission Intercepted:", compiledDataPayload);
  };

  return (
    <div className="w-full min-h-screen px-0 sm:px-6 lg:px-8 pb-16 sm:pb-24 text-left bg-[#FCFBF8]">
      
      {/* Top Section Headers inside the workspace frame */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
        <h2 className="text-2xl sm:text-3xl font-serif text-[#7A1C1C] font-bold tracking-wide">
          Tributes & Condolences
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 font-medium leading-relaxed tracking-wide px-2 sm:px-0">
          A space to share cherished memories, light a candle, and offer comfort to the family.
        </p>
      </div>

      {/* Main 2-Column Split Component Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start max-w-7xl mx-auto">
        
        {/* LEFT COLUMN: Community Tributes Stream Stack */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6 w-full">
          {tributesList.map((tribute) => (
            <div 
              key={tribute.id} 
              className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm border border-[#E6DED2]/60 space-y-4 sm:space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-2 sm:pb-0">
                <div className="flex items-center gap-3.5">
                  {tribute.avatar ? (
                    <div className="relative w-11 h-11 rounded-full p-[1px] bg-gradient-to-br from-[#D4AF37] to-[#7A1C1C] shrink-0 shadow-sm">
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
                        <Image src={tribute.avatar} alt={tribute.name} fill className="object-cover" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#FCFBF8] flex items-center justify-center border-2 border-[#D4AF37]/30 shrink-0">
                      <span className="text-xs font-sans font-bold text-[#7A1C1C]">
                        {tribute.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-stone-800 tracking-wide font-sans">{tribute.name}</h4>
                    <p className="text-xs text-stone-400 font-light">
                      <span className="text-[#7A1C1C] font-semibold">{tribute.relationship}</span> • {tribute.date}
                    </p>
                  </div>
                </div>

                {/* Conditional Visual State Badge — Synchronized with poster colors */}
                {tribute.badge && (
                  <div className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCFBF8] text-[#7A1C1C] border border-[#D4AF37]/40 text-[11px] font-bold tracking-wide shadow-sm">
                    <span>{tribute.badge.icon}</span>
                    <span>{tribute.badge.text}</span>
                  </div>
                )}
              </div>

              <p className="text-stone-600 font-normal leading-relaxed text-sm italic font-sans sm:pl-1">
                {tribute.message}
              </p>

              {/* Conditional Media Attachment Frame */}
              {tribute.attachedImage && (
                <div className="relative w-full sm:w-64 h-44 sm:h-36 rounded-xl overflow-hidden shadow-sm my-2 p-1 bg-white ring-1 ring-[#E6DED2]">
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <Image 
                      src={tribute.attachedImage} 
                      alt="Shared memory attachment" 
                      fill 
                      sizes="(max-width: 640px) 100vw, 256px"
                      className="object-cover" 
                    />
                  </div>
                </div>
              )}

              {/* Bottom Action Footer Row */}
              <div className="flex items-center gap-6 pt-4 border-t border-stone-100 text-xs text-stone-400">
                <button className={`flex items-center gap-1.5 hover:text-[#7A1C1C] transition-colors font-semibold ${tribute.hasAffirmed ? 'text-[#7A1C1C]' : ''}`}>
                  <span>❤️</span> 
                  <span>Affirm {tribute.affirmationsCount ? `(${tribute.affirmationsCount})` : ''}</span>
                </button>
                {tribute.badge?.type === 'memory' && (
                  <button className="flex items-center gap-1.5 hover:text-[#7A1C1C] transition-colors font-semibold">
                    <span>✉️</span> Offer Comfort
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Pagination Button */}
          <div className="flex justify-center pt-4">
            <button className="w-full sm:w-auto border border-[#E6DED2] text-stone-700 font-semibold text-xs px-8 py-3.5 rounded-full hover:bg-[#7A1C1C] hover:text-white hover:border-[#7A1C1C] transition-all uppercase tracking-widest bg-white shadow-sm text-center">
              View Earlier Tributes
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Submission Card Widget Forms */}
        <div className="lg:col-span-4 space-y-6 w-full">
          
          <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-7 shadow-sm border border-[#E6DED2]/60 space-y-5">
            <h3 className="text-xs font-bold text-[#7A1C1C] uppercase tracking-wider font-sans">
              Leave a Tribute
            </h3>
            
            <form className="space-y-4 text-xs" onSubmit={handleTributeSubmit}>
              <div className="space-y-1.5">
                <label className="text-stone-500 font-semibold uppercase tracking-wide text-[10px]">Your Name</label>
                <input 
                  type="text" 
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FCFBF8] border border-[#E6DED2] text-stone-800 font-medium placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" 
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-500 font-semibold uppercase tracking-wide text-[10px]">Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FCFBF8] border border-[#E6DED2] text-stone-800 font-medium placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" 
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-500 font-semibold uppercase tracking-wide text-[10px]">Relationship</label>
                <select 
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FCFBF8] border border-[#E6DED2] text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#D4AF37]" 
                  required
                >
                  <option value="Friend">Friend</option>
                  <option value="Family">Family</option>
                  <option value="Colleague">Colleague</option>
                  {/* <option value="Neighbor">Neighbor</option> */}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-500 font-semibold uppercase tracking-wide text-[10px]">Tribute Message</label>
                <TributeRichEditor 
                  value={message} 
                  onChange={setMessage} 
                />
              </div>

              {/* Primary Call to Action Button themed around the main rich red button styles */}
              <button type="submit" className="w-full bg-[#7A1C1C] text-white text-xs font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-[#991B1B] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md">
                Post Tribute
              </button>
            </form>
          </div>

          {/* Offering Card Tray Widget: Custom Gold theme tokens */}
          <div className="bg-[#FCFBF8] rounded-2xl p-5 sm:p-6 shadow-sm border border-[#E6DED2]">
            <span className="text-[10px] font-sans font-bold tracking-widest text-[#7A1C1C] uppercase block mb-4">
              Virtual Offerings
            </span>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 text-center border border-[#E6DED2]/60 flex flex-col items-center justify-center space-y-1.5 shadow-sm hover:border-[#D4AF37]/50 transition-colors">
                <span className="text-2xl text-[#D4AF37]">⚜️</span>
                <h5 className="text-xs font-bold text-stone-700 font-sans">White Lily</h5>
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">x248</span>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-[#E6DED2]/60 flex flex-col items-center justify-center space-y-1.5 shadow-sm hover:border-[#D4AF37]/50 transition-colors">
                <span className="text-2xl text-[#D4AF37]">🌿</span>
                <h5 className="text-xs font-bold text-stone-700 font-sans">Olive Branch</h5>
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">x185</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}