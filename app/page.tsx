"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MemorialLayout from "./(memorial)/layout";
import { TributeModal, TributeFormData } from "@/components/TributeModal";
import Image from "next/image";
import { Wrapper } from "@googlemaps/react-wrapper";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import LinkExtension from "@tiptap/extension-link";
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
  Volume2,
  VolumeX,
  Plus,
  X,
  Calendar,
  MapPin,
  Sparkles,
  Heart,
} from "lucide-react";

declare global {
  interface Window {
    google: {
      maps: Record<string, unknown>;
    };
  }
}

/* -------------------------------------------------------------------------- */
/*                 SUBCOMPONENT: TOOLBAR TEXT EDITOR WORKSPACE                */
/* -------------------------------------------------------------------------- */
interface TributeRichEditorProps {
  value: string;
  onChange: (markdown: string) => void;
}

const TributeRichEditor: React.FC<TributeRichEditorProps> = ({
  value,
  onChange,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Underline,
      Markdown,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#991B1B] underline cursor-pointer" },
      }),
    ],
    content: value,
    contentType: "markdown",
    editorProps: {
      attributes: {
        class:
          "prose prose-stone max-w-none text-sm min-h-[140px] max-h-[220px] overflow-y-auto focus:outline-none text-stone-700 p-4",
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
    p-2 rounded-lg transition-all duration-150
    ${isActive ? "text-[#991B1B] bg-red-50 border border-red-200/60" : "text-stone-400 hover:text-stone-700 hover:bg-stone-100"}
  `;

  return (
    <div
      className="w-full bg-stone-50 border border-stone-200 rounded-xl overflow-hidden transition-all duration-200 focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-[#7C6923]/10"
      onClick={() => editor.commands.focus()}
    >
      <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-stone-200 bg-stone-100/60 select-none">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnClass(editor.isActive("bold"))}
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnClass(editor.isActive("italic"))}
        >
          <Italic size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btnClass(editor.isActive("underline"))}
        >
          <UnderlineIcon size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={btnClass(editor.isActive("strike"))}
        >
          <Strikethrough size={15} />
        </button>
        <div className="w-px h-4 bg-stone-300 mx-1" />
        <button
          type="button"
          onClick={setLink}
          className={btnClass(editor.isActive("link"))}
        >
          <Link2 size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnClass(editor.isActive("orderedList"))}
        >
          <ListOrdered size={15} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnClass(editor.isActive("bulletList"))}
        >
          <List size={15} />
        </button>
        <div className="w-px h-4 bg-stone-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnClass(editor.isActive("blockquote"))}
        >
          <Quote size={15} />
        </button>
      </div>

      <div className="relative bg-white">
        {editor.isEmpty && (
          <div className="absolute top-4 left-4 text-stone-400 text-sm font-light pointer-events-none select-none">
            Share a cherished memory, anecdote, or message of support...
          </div>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                 SUBCOMPONENT: GOOGLE MAPS INTERIOR CANVAS                  */
/* -------------------------------------------------------------------------- */
interface CustomMapInnerProps {
  center: { lat: number; lng: number };
  zoom: number;
}

const CustomMapInner: React.FC<CustomMapInnerProps> = ({ center, zoom }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapRef.current && window.google) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const map = new (window.google.maps as any).Map(mapRef.current, {
        center,
        zoom,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#FDFBF7" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#78716C" }] },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#E2DCD2" }],
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [{ color: "#F3EFE9" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#FFFFFF" }],
          },
        ],
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (window.google.maps as any).Marker({
        position: center,
        map: map,
        title: "Havenbrook Memorial Chapel",
      });
    }
  }, [center, zoom]);

  return <div ref={mapRef} className="w-full h-full" />;
};

/* -------------------------------------------------------------------------- */
/*                     MAIN COMPONENT EXPORT HOOK PAGE                        */
/* -------------------------------------------------------------------------- */
export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [fullName, setFullName] = useState("");
  // const [email, setEmail] = useState("");
  // const [relationship, setRelationship] = useState("Friend");
  // const [message, setMessage] = useState("");

  // Audio playback tracking state controls
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const mapCenter = { lat: 43.6532, lng: -79.3832 };

  const legacyMapItems = [
    { label: "Photos", icon: "📷", path: "/photos" },
    { label: "Tributes", icon: "💬", path: "/tributes" },
  ];

  // Initialize and handle programmatic autoplay workarounds for browsers
  useEffect(() => {
    // URL encode the spaces so the browser can locate the file path correctly
    const audioPath =
      "/audio/" +
      encodeURIComponent("This World Is Not My Home - Jim Reeves.mp3");
    const audio = new Audio(audioPath);
    audio.loop = true;
    audioRef.current = audio;

    const attemptAutoplay = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          removeInteractionListeners();
        })
        .catch((err) => {
          console.log(
            "Autoplay blocked by browser policy. Waiting for user interaction to engage soundtrack.",
            err,
          );
        });
    };

    const removeInteractionListeners = () => {
      window.removeEventListener("click", attemptAutoplay);
      window.removeEventListener("touchstart", attemptAutoplay);
      window.removeEventListener("keydown", attemptAutoplay);
    };

    // Attempt immediate start
    attemptAutoplay();

    // Fallback interaction triggers if directly blocked by client browser policy
    window.addEventListener("click", attemptAutoplay);
    window.addEventListener("touchstart", attemptAutoplay);
    window.addEventListener("keydown", attemptAutoplay);

    return () => {
      audio.pause();
      removeInteractionListeners();
    };
  }, []);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .catch((err) => console.log("Playback error:", err));
      setIsPlaying(true);
    }
  };

  const handleTributeSubmit = (data: TributeFormData) => {
    console.log("Submitting Tribute Data Bundle:", data);
    setIsModalOpen(false);
  };

  return (
    <MemorialLayout>
      {/* BACKGROUND SOUND CONTROLLER PANEL WIDGET */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 md:bottom-8 md:left-8 z-40">
        <button
          onClick={togglePlayback}
          className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-full shadow-2xl transition-all duration-300 border backdrop-blur-md font-sans text-xs tracking-wider font-medium uppercase
            ${
              isPlaying
                ? "bg-[#7A1C1C] text-white border-amber-600/30"
                : "bg-white text-stone-700 border-stone-200/80 hover:bg-stone-50"
            }`}
        >
          {isPlaying ? (
            <>
              <Volume2 size={16} className="animate-pulse text-[#010101]" />
              <span>Music On</span>
            </>
          ) : (
            <>
              <VolumeX size={16} className="text-stone-400" />
              <span>Music Muted</span>
            </>
          )}
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pb-24 pt-3 md:pb-28 text-left relative">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-10 xl:gap-12 items-start">
          {/* LEFT COLUMN: Biography Content panel */}
          <div className="xl:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 lg:p-12 xl:p-16 shadow-[0_4px_30px_rgba(0,0,0,0.015)] border border-stone-200/60">
            <article className="space-y-10 md:space-y-12">
              {/* Introduction/Birth Section */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-[#D4AF37] uppercase">
                  <Sparkles size={14} /> Chapter I
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#7A1C1C] tracking-tight font-light border-b border-stone-100 pb-3">
                  Birth and Early Life
                </h2>
                <div className="space-y-5 text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  <p>
                    Ogbueshi Bennett Amaechi Oguegbu (Nnamenyiba II) was born on
                    November 11, 1939, in Onitsha, Anambra State, Nigeria. He
                    was the first son of Ogbueshi Henry Ofochebe Oguegbu
                    (Nnamenyiba I) of Umunsalum, Umuagu Kindred, in the Udejilo
                    larger family of Obosi Ukwala Ancient Kingdom. His mother
                    was Mrs. Elizabeth Uzonicha Amamchukwu, while his stepmother
                    is Mrs. Janet Ndidiamaka Oguegbu.
                  </p>
                  <p>
                    He was raised in a loving, disciplined, and God-fearing
                    environment. His maternal grandfather served as a Protestant
                    missionary, while his maternal grandmother, affectionately
                    known as Nne, was a hardworking fish trader. Under their
                    guidance, young Bennett developed the virtues that would
                    define his life—honesty, hard work, integrity, humility,
                    compassion, and respect for humanity. These values became
                    the foundation of his character and remained evident
                    throughout his eighty-six years (86) on earth.
                  </p>
                  <p>
                    From an early age, he displayed intelligence, discipline,
                    and a strong sense of responsibility. Possessing a calm and
                    gentle disposition, he earned the affection and respect of
                    family members, friends, and neighbors alike.
                  </p>
                </div>
              </div>

              {/* Education Section */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-[#D4AF37] uppercase">
                  <Sparkles size={14} /> Chapter II
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#7A1C1C] tracking-tight font-light border-b border-stone-100 pb-3">
                  Education and Love for Learning
                </h2>
                <div className="space-y-5 text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  <p>
                    Ogbueshi Bennett Amaechi Oguegbu began his educational
                    journey at the renowned CMS Central School, Onitsha. He
                    later attended Okongwu Memorial Grammar School, Nnewi,
                    before proceeding to the prestigious Dennis Memorial Grammar
                    School (DMGS), Onitsha, where he obtained his Higher School
                    Certificate (HSC) in Arts with the support and encouragement
                    of his parents and maternal family.
                  </p>
                  <p>
                    Beyond academics, Bennett was known for his athleticism and
                    charisma. Tall, handsome, and gifted, he excelled in
                    football and became widely known among his peers by the
                    nickname{" "}
                    <span className="italic font-serif text-[#7A1C1C]">
                      &quot;Barbinton Dilett&quot;.
                    </span>{" "}
                    A formidable defender, he possessed exceptional skill and
                    was renowned for scoring spectacular goals whenever he
                    advanced from the back line. Many who watched him play
                    believed that, had he been born in a different era, he could
                    easily have pursued a successful professional football
                    career on the international stage.
                  </p>
                  <p>
                    His passion for education and self-development led him to
                    the University of Nigeria, Nsukka, where he earned a
                    Bachelor of Arts Degree in Mass Communication. He firmly
                    believed that education was one of the greatest gifts a
                    person could possess—a conviction he carried throughout his
                    life and instilled in his children, relatives, and all who
                    came under his influence.
                  </p>

                  {/* Highlight Callout Frame for Athletics */}
                  {/* <div className="p-6 md:p-8 bg-amber-50/50 rounded-2xl border border-amber-100/70 my-6">
                    <p className="text-[#D4AF37] font-serif italic text-lg leading-relaxed">
                    </p>
                  </div> */}

                  <p>
                    Committed to lifelong learning, he continued to pursue
                    academic and professional development throughout his career.
                    He obtained a Postgraduate Diploma from the University of
                    Manchester in the United Kingdom and attended specialized
                    law enforcement training at the prestigious Federal Law
                    Enforcement Training Center (FLETC), Glynco, Georgia, USA,
                    during the early 1980s. These accomplishments reflected his
                    dedication to excellence, professional growth, and
                    continuous self-improvement.
                  </p>
                </div>
              </div>

              {/* Public Service and Career */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-[#D4AF37] uppercase">
                  <Sparkles size={14} /> Chapter III
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#7A1C1C] tracking-tight font-light border-b border-stone-100 pb-3">
                  Career and Public Service
                </h2>
                <div className="space-y-5 text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  <p>
                    Before pursuing higher education, Bennett briefly worked as
                    a clerk in the Judiciary Department in Enugu. However, with
                    the outbreak of the Nigerian Civil War, he was commissioned
                    into the Biafran Army as an officer.
                  </p>
                  <p>
                    During the war, he sustained a gunshot wound in the Onitsha
                    sector when a bullet passed through his upper left arm.
                    After recovering from his injuries, he did not return to
                    active combat before the war ended. Following the conclusion
                    of the conflict, he briefly returned to his clerical duties
                    before securing admission to the University of Nigeria,
                    Nsukka.
                    {/* <span className="text-[#7A1C1C] font-medium">
                      Comptroller of Immigration
                    </span>
                    . */}
                  </p>
                  <p>
                    Upon graduating, he joined the Nigeria Immigration Service
                    in 1976 at Alagbon Close, Ikeja, Lagos, during a period of
                    significant institutional transformation. He was among the
                    first university graduates recruited into the Service, a
                    distinction that reflected both his academic achievements
                    and the confidence placed in his abilities. In his personal
                    notes, he reflected on his philosophy of public service:
                  </p>

                  <div className="border-l-4 border-[#D4AF37] bg-stone-50 p-4 sm:p-6 rounded-r-2xl space-y-3 my-4">
                    <p className="text-stone-800 font-serif text-lg italic">
                      &ldquo;My years of public service were based on my
                      unwavering belief in the ability to unite people,
                      especially civil servants, around a politics of purpose.
                      In Bendel State, I worked to ensure that we built our own
                      office in a good location instead of wasting government
                      resources on rented facilities. I also sought to promote
                      transparency by reconciling our accounts with the Central
                      Pay Office stationed at the Prisons Office.&rdquo;
                    </p>
                  </div>

                  <p>
                    Through hard work, discipline, professionalism, and
                    dedication, he rose steadily through the ranks to attain the
                    prestigious position of Comptroller of Immigration.
                    Throughout his distinguished career, he served in several
                    locations across Nigeria, including Yola, Enugu, and Benin
                    City. He also served as an instructor and later Deputy
                    Commandant at the Immigration Training School in Kano, where
                    he played a significant role in training and mentoring
                    future generations of immigration officers. Known for his
                    honesty, humility, and commitment to duty, Bennett earned
                    the admiration and respect of colleagues, subordinates, and
                    community leaders alike. His reputation for integrity became
                    one of his greatest assets and remained unquestioned
                    throughout his years of service.
                  </p>
                </div>
              </div>

              {/* Family Life */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-[#D4AF37] uppercase">
                  <Sparkles size={14} /> Chapter IV
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#7A1C1C] tracking-tight font-light border-b border-stone-100 pb-3">
                  Family Life
                </h2>
                <div className="space-y-5 text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  <p>
                    Ogbueshi Bennett Amaechi Oguegbu married the love of his
                    life, Mrs. Joy Nonyelum Nwakaego Oguegbu (née Ebozue). Their
                    union was blessed with four children and eight
                    grandchildren.
                  </p>
                  <p>
                    As a husband, father, grandfather, brother, uncle, mentor,
                    and friend, he was a pillar of strength, wisdom, and
                    stability. Family was central to his life, and he devoted
                    himself wholeheartedly to their welfare and success.
                  </p>
                  <p>
                    He was known for his generosity and willingness to sacrifice
                    for others. Many members of his extended family benefited
                    from his support, encouragement, and commitment to
                    education. His children remember him not merely as a
                    provider, but as a teacher whose most profound lessons were
                    taught through personal example.
                  </p>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-[#D4AF37] uppercase">
                  <Sparkles size={14} /> Chapter V
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#7A1C1C] tracking-tight font-light border-b border-stone-100 pb-3">
                  Life After Retirement and BENE KEDUM
                </h2>
                <div className="space-y-5 text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  <p>
                    Following a meritorious career in public service, Bennett
                    retired from the Nigeria Immigration Service. Refusing to
                    remain idle, he ventured into private enterprise and
                    established his own company,{" "}
                    <span className="text-[#7A1C1C] font-medium">
                      BENE KEDUM
                    </span>{" "}
                    a name creatively formed from the names of his four beloved
                    children: Benson, Nneka, Kenechukwu, and Dubem. The company
                    reflected not only his entrepreneurial spirit but also his
                    deep love for family.
                  </p>
                  <p>
                    While residing and working in Benin City and other parts of
                    Edo State, he became highly respected and warmly embraced by
                    the Edo people. His circle of friends and associates
                    included some of Nigeria’s most distinguished personalities,
                    including the then Governor of Bendel State, Late Major
                    General John Mark Inienger; Chief Gabriel Osawaru
                    Igbinedion, the Esama of Benin; Late Archbishop Benson
                    Idahosa; and Late Chief Tony Anenih.
                  </p>
                  <p>
                    Through{" "}
                    <span className="text-[#7A1C1C] font-medium">
                      BENE KEDUM
                    </span>
                    , he served as a Liaison Officer for Okada Air under the
                    leadership of Chief Gabriel Igbinedion. His professionalism,
                    organizational skills, and ability to build relationships
                    made him highly effective in this role.
                  </p>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-[#D4AF37] uppercase">
                  <Sparkles size={14} /> Chapter VI
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#7A1C1C] tracking-tight font-light border-b border-stone-100 pb-3">
                  Faith and Community Service
                </h2>
                <div className="space-y-5 text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  <p>
                    A devoted Christian, Bennett&apos;s faith guided every
                    aspect of his life. He actively served in the church and
                    remained committed to Christian values throughout his
                    lifetime. While residing in the United States, he became an
                    active member of Agape Chapel International in Grand
                    Prairie, Texas. He was also deeply involved in community
                    organizations, including the Obosi Foundation Society in
                    Dallas and the Obosi Development Association in the United
                    States.
                  </p>
                  <p>
                    His commitment to service extended beyond the church and
                    community organizations. He consistently supported
                    educational initiatives, community development efforts, and
                    charitable causes aimed at improving the lives of others.
                  </p>
                </div>
              </div>

              {/* Principles & Legacy */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-[#D4AF37] uppercase">
                  <Sparkles size={14} /> Chapter VII
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#7A1C1C] tracking-tight font-light border-b border-stone-100 pb-3">
                  Personality and Legacy
                </h2>
                <p className="text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  Those who knew Bennett best described him as humble,
                  disciplined, intelligent, peaceful, generous, and deeply
                  compassionate.
                </p>
                <p className="text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  He loved reading newspapers, magazines, and books and was
                  always eager to discuss current events, history, and social
                  issues. He possessed an extraordinary memory and a passion for
                  sharing knowledge.
                </p>
                <p className="text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  He valued cleanliness, organization, honesty, and hard work.
                  His life was characterized by quiet leadership rather than
                  public recognition. He helped countless people without seeking
                  praise or reward. Above all, he loved God, people, and
                  education. His first son, Amaechi Oguegbu, recalls three
                  principles his father consistently taught:
                </p>
                {/* <p className="text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  His first son, Amaechi Oguegbu, recalls three principles his
                  father consistently taught:
                </p> */}

                {/* Visual Quote Box for the Three Principles */}
                <div className="border-l-4 border-[#D4AF37] bg-stone-50 p-4 sm:p-6 rounded-r-2xl space-y-3 my-4">
                  <p className="text-stone-800 font-serif text-lg italic">
                    &ldquo;Don&apos;t live a fake life.
                  </p>
                </div>
                <div className="border-l-4 border-[#D4AF37] bg-stone-50 p-4 sm:p-6 rounded-r-2xl space-y-3 my-4">
                  <p className="text-stone-800 font-serif text-lg italic">
                    Don&apos;t take what doesn&apos;t belong to you.
                  </p>
                </div>
                <div className="border-l-4 border-[#D4AF37] bg-stone-50 p-4 sm:p-6 rounded-r-2xl space-y-3 my-4">
                  <p className="text-stone-800 font-serif text-lg italic">
                    Let&apos;s take it easy.&rdquo;
                  </p>
                  <span className="block text-xs camel-case tracking-widest text-stone-400 font-medium">
                    — These simple but profound principles captured the essence
                    of the man he was.
                  </span>
                </div>

                <p className="text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  These simple yet profound principles captured the essence of
                  the man he was. He believed that a clear conscience was worth
                  more than material wealth and often reminded his family that
                  integrity was one possession that could never be taken away.
                </p>
              </div>

              {/* Passing On & Conclusion */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-[#D4AF37] uppercase">
                  <Sparkles size={14} /> Chapter VIII
                </div>
                {/* <div className="space-y-6 bg-stone-50/60 rounded-2xl p-6 sm:p-8 border border-stone-200/50"> */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#7A1C1C] tracking-tight font-light border-b border-stone-100 pb-3">
                  Passing On
                </h2>
                <p className="text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  After a life devoted to God, family, community, and humanity,
                  Ogbueshi Bennett Amaechi Oguegbu peacefully answered the call
                  of his Creator on April 23, 2026, at the age of eighty-six
                  (86).
                </p>

                <p className="text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  In a manner that reflected the peaceful life he lived, he woke
                  that morning feeling well, shared breakfast with loved ones,
                  and prepared for a routine medical appointment. While
                  receiving care at the hospital, he peacefully transitioned
                  into eternal glory.
                </p>

                <p className="text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  Even in death, he remained true to the values that defined his
                  life—simplicity, dignity, peace, and unwavering faith.
                </p>
              </div>

              {/*Conclusion */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-[#D4AF37] uppercase">
                  <Sparkles size={14} /> Chapter IX
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-[#7A1C1C] tracking-tight font-light border-b border-stone-100 pb-3">
                  Conclusion
                </h2>
                <p className="text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  The story of Ogbueshi Bennett Amaechi Oguegbu is the story of
                  a man who consistently chose integrity over convenience,
                  service over self-interest, humility over pride, and faith
                  over fear.
                </p>
                <p className="text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  He leaves behind an enduring legacy of honesty, hard work,
                  generosity, compassion, peace, and unwavering trust in God.
                  His influence lives on not only through his children and
                  grandchildren but also through the countless lives he touched
                  during his years of public service, mentorship, friendship,
                  and community leadership.
                </p>
                <p className="text-stone-600 font-normal leading-relaxed text-[15px] sm:text-base md:text-[17px]">
                  Though he is no longer physically present, his values,
                  teachings, and example continue to inspire all who were
                  privileged to know him.
                </p>

                <div className="pt-4 border-stone-200 text-center space-y-3">
                  <p className="text-[#D4AF37] font-serif text-lg italic max-w-xl mx-auto">
                    As Scripture reminds us:
                  </p>
                  <p className="text-[#D4AF37] font-serif text-lg italic max-w-xl mx-auto">
                    &quot;The righteous shall be in everlasting
                    remembrance.&quot;
                  </p>
                  <span className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest">
                    — Psalm 112:6
                  </span>
                </div>

                <p className="text-[#D4AF37] text-center font-serif pt-2 text-base">
                  May the soul of Ogbueshi Bennett Amaechi Oguegbu (Nnamenyiba
                  II) continue to rest in perfect peace, and may his remarkable
                  legacy inspire generations yet unborn.
                </p>
              </div>
            </article>
          </div>

          {/* RIGHT COLUMN: Sticky Cards/Widgets Dashboard */}
          <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-8 w-full">
            {/* Card 1: Legacy Map Folders */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.01)] border border-stone-200/60">
              <div className="flex items-center gap-2.5 mb-6">
                <span className="text-[#D4AF37] text-lg">✦</span>
                <h3 className="font-serif text-lg text-[#7A1C1C] tracking-wide">
                  Memory Index
                </h3>
              </div>

              <div className="space-y-3">
                {legacyMapItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.path}
                    className="flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-stone-50 hover:bg-amber-50/40 border border-stone-100 hover:border-amber-200/50 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-[#FCF5E3] flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                        {item.icon}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-stone-700 truncate font-sans tracking-wide">
                        {item.label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-6 bg-[#7A1C1C] hover:bg-[#701818] text-white font-medium text-xs py-4 rounded-xl transition-all uppercase tracking-widest shadow-sm flex items-center justify-center gap-2 group"
              >
                Post Tribute
              </button>
            </div>

            {/* Card 2: Upcoming Memorial Event Details */}
            <div className="bg-[#7A1C1C] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden border">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <span className="text-[10px] font-sans font-bold tracking-widest text-[#C09B4D] uppercase block mb-3">
                Memorial Service
              </span>
              <h4 className="font-serif text-xl text-white tracking-wide mb-4 leading-snug">
                Celebration of Life Service
              </h4>

              <div className="space-y-4 text-xs text-stone-300 font-sans tracking-wide">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-[#C09B4D] shrink-0" />
                  <span>February 19, 2026 at 2:30 PM</span>
                </div>
                <div className="flex items-start gap-3 pt-3 border-t border-white/10">
                  <MapPin
                    size={16}
                    className="text-[#C09B4D] mt-0.5 shrink-0"
                  />
                  <p className="leading-relaxed">
                    <span className="text-white font-medium block mb-0.5">
                      Havenbrook Memorial Chapel
                    </span>
                    Main Hall Sanctuary Room
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Interactive Location Canvas Map */}
            <div className="bg-white rounded-3xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.01)] border border-stone-200/60 space-y-4">
              <span className="text-stone-400 text-[11px] font-sans font-bold tracking-widest uppercase block">
                Venue Location Map
              </span>
              <div className="w-full h-44 sm:h-52 md:h-60 rounded-2xl overflow-hidden border border-stone-200/60 relative bg-[#F5F4F0]">
                <Wrapper
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
                >
                  <CustomMapInner center={mapCenter} zoom={14} />
                </Wrapper>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING ACTION ACTION BUTTON */}
      <button
        onClick={() => setIsModalOpen(true)}
        aria-label="Leave a Tribute"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-40 bg-[#D4AF37] text-white p-3 sm:p-4 rounded-full shadow-2xl hover:bg-[#7A1C1C] hover:scale-105 active:scale-95 transition-all duration-200 group focus:outline-none"
      >
        <Plus size={20} className="sm:w-6 sm:h-6" />
      </button>
      {/* Tribute Modal Component */}
      <TributeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleTributeSubmit}
      />
    </MemorialLayout>
  );
}
