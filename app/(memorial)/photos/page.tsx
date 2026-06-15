"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  X, 
  Camera, 
  Plus, 
  Sparkles, 
  FolderOpen, 
  Download
} from "lucide-react";

export default function MediaGalleryView() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  // Navigation and Selection Local States
  const [activeTab, setActiveTab] = useState("All");
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Management States
  const [uploadForm, setUploadForm] = useState({
    title: "",
    category: "Portraits",
    description: "",
    mediaFile: null as File | null,
  });
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  // Core Gallery Data Mapping - Pure Image structures
  const mediaItems = [
    {
      id: 1,
      type: "photo",
      category: "Portraits",
      src: "/images/gallery/portrait-main.jpg",
      aspectRatio: "md:row-span-2 h-72 sm:h-96 md:h-[520px]",
      alt: "Ogbueshi Bennett Amaechi Oguegbu Portrait",
    },
    {
      id: 2,
      type: "photo",
      category: "Family Life",
      src: "/images/gallery/family-gathering.jpg",
      aspectRatio: "h-48 sm:h-60",
      alt: "Oguegbu Family house in Ire Village, Obosi",
    },
    {
      id: 3,
      type: "photo",
      category: "Drafting Work",
      src: "/images/gallery/immigration-service.jpg",
      aspectRatio: "h-48 sm:h-60",
      alt: "Honorable public service historical records",
    },
    {
      id: 5,
      type: "photo",
      category: "Portraits",
      src: "/images/gallery/comptroller-uniform.jpg",
      aspectRatio: "h-52 sm:h-64",
      alt: "Comptroller of Immigration structural archive uniform",
    },
  ];

  const albumFolders = [
    {
      title: "The Oguegbu Family Archive",
      count: "241 Items Included",
      cover: "/images/gallery/album-traditional.jpg",
    },
    {
      title: "Nigeria Immigration Service Years",
      count: "82 Historical Records",
      cover: "/images/gallery/album-service.jpg",
    },
  ];

  // Lifecycle Reset on Upload Canvas Termination
  useEffect(() => {
    if (!isUploadModalOpen) {
      startTransition(() => {
        setUploadForm({ title: "", category: "Portraits", description: "", mediaFile: null });
        setUploadPreview(null);
      });
    }
  }, [isUploadModalOpen]);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith("image/");

    if (!isImg) {
      alert("Unsupported file format string. Please inject a standard image element container.");
      return;
    }

    setUploadForm(prev => ({ ...prev, mediaFile: file }));
    setUploadPreview(URL.createObjectURL(file));
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.mediaFile) {
      alert("Please select a physical file to submit.");
      return;
    }
    console.log("Intercepted Media Node Upload Payload Bundle:", uploadForm);
    setIsUploadModalOpen(false);
  };

  const filteredMedia = mediaItems.filter((item) => {
    if (activeTab === "All") return true;
    return item.category === activeTab;
  });

  return (
    <div className="space-y-12 sm:space-y-16 max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pb-24 text-left mt-4 sm:mt-12 relative bg-[#FCFBF8] min-h-screen">
      
      {/* 1. Header Navigation Container */}
      <div className="flex flex-col md:block md:relative">
        <div className="md:absolute md:top-0 md:left-0">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500 hover:text-[#7A1C1C] transition-colors group py-2 md:py-0"
          >
            <span className="text-sm transform group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Go back
          </button>
        </div>

        <div className="text-center max-w-xl mx-auto space-y-2 mt-4 md:mt-0">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
            <Sparkles size={14} /> Shared Sanctuary View
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#7A1C1C] tracking-tight font-bold">
            Photo Gallery
          </h2>
          <p className="text-xs text-stone-500 font-medium tracking-wide">
            A preserved visual chronicle honoring the legacy of Nnamenyiba II.
          </p>
        </div>
      </div>

      {/* 2. Media Filter Tab Track */}
      <div className="w-full overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 flex justify-start sm:justify-center">
        <div className="flex gap-2.5 whitespace-nowrap pb-2 sm:pb-0">
          {["All", "Portraits", "Family Life", "Drafting Work"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[11px] tracking-widest uppercase px-5 py-2.5 rounded-full transition-all duration-200 font-semibold shadow-sm border ${
                  activeTab === tab
                    ? "bg-[#7A1C1C] text-white border-red-900/10"
                    : "bg-white text-stone-600 border-stone-200/60 hover:bg-red-50/40 hover:text-[#7A1C1C]"
                }`}
              >
                {tab === "All" ? "All Frames" : tab}
              </button>
            ),
          )}
        </div>
      </div>

      {/* 3. Main Masonry Structural Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-start">
        {/* Left Column Stack Box Wrapper */}
        <div className="md:col-span-1 space-y-5 sm:space-y-6">
          {filteredMedia
            .filter((_, i) => i === 0)
            .map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className={`relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md border border-stone-200/50 p-1 transition-all duration-300 cursor-pointer group ${item.aspectRatio}`}
              >
                <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    priority
                  />
                </div>
              </div>
            ))}
        </div>

        {/* Right 2-Column Split Mesh Layout */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {filteredMedia.slice(1).map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className={`relative rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md border border-stone-200/50 p-1 transition-all duration-300 cursor-pointer group ${item.aspectRatio}`}
            >
              <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Curated Folder Collections Section Block */}
      <div className="border-t border-[#E6DED2] pt-12 sm:pt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
              <FolderOpen size={14} /> Catalog Index
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-[#7A1C1C] font-bold tracking-wide">
              Curated Collections
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Historical memory nodes locked safe within ancestral groupings.
            </p>
          </div>
          <button className="text-[11px] font-bold tracking-widest uppercase text-[#7A1C1C] hover:text-[#5C1313] transition-colors pb-1 border-b-2 border-[#D4AF37] self-start sm:self-auto">
            See All Records →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {albumFolders.map((album, index) => (
            <div key={index} className="group cursor-pointer space-y-4">
              <div className="relative h-52 sm:h-64 rounded-3xl overflow-hidden bg-white border border-stone-200/50 shadow-sm p-1">
                <div className="relative w-full h-full rounded-[20px] overflow-hidden">
                  <Image
                    src={album.cover}
                    alt={album.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 560px"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="pl-1 space-y-0.5">
                <h4 className="font-serif text-lg text-[#7A1C1C] font-bold tracking-wide group-hover:text-[#991B1B] transition-colors">
                  {album.title}
                </h4>
                <p className="text-xs text-stone-500 font-semibold tracking-wide">
                  {album.count}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Lightbox Viewport Details Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="absolute inset-0" onClick={() => setSelectedMedia(null)} />
          
          <div className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 shadow-2xl relative border border-stone-100 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible z-10 transform scale-100 transition-all duration-300">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-900/10 hover:bg-[#7A1C1C] text-stone-700 hover:text-white flex items-center justify-center text-sm z-20 transition-all shadow-sm"
            >
              ✕
            </button>

            {/* Left Media Asset Panel */}
            <div className="md:col-span-7 bg-stone-50 min-h-[280px] sm:min-h-[360px] md:h-[500px] relative flex items-center justify-center p-2 border-r border-stone-100">
              <div className="w-full h-full relative rounded-2xl overflow-hidden">
                <Image
                  src={selectedMedia.src}
                  alt={selectedMedia.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 550px"
                />
              </div>
            </div>

            {/* Right Side metadata drawer container */}
            <div className="md:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6 bg-white">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-sans font-bold tracking-widest text-[#7A1C1C] uppercase bg-red-50 border border-red-100 px-2.5 py-1 rounded-md">
                    Photo Node
                  </span>
                  <span className="text-xs text-stone-400 font-mono font-semibold">
                    {selectedMedia.date || "Historical Archive"}
                  </span>
                </div>

                <h4 className="font-serif text-xl sm:text-2xl tracking-wide text-stone-800 font-bold leading-tight">
                  {selectedMedia.title || "Archive Artifact"}
                </h4>

                <p className="text-sm text-stone-600 font-medium leading-relaxed font-sans max-h-36 overflow-y-auto pr-1">
                  {selectedMedia.description ||
                    '"A structural memory node celebrating the community interactions, high integrity, and timeline pathways of Ogbueshi Bennett Amaechi Oguegbu."'}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                <button 
                  onClick={() => setSelectedMedia(null)}
                  className="flex-1 bg-[#7A1C1C] hover:bg-[#5C1313] text-white text-xs font-bold py-4 px-4 rounded-xl uppercase tracking-wider transition-colors text-center shadow-md flex items-center justify-center gap-1.5"
                >
                  Enlarge Workspace
                </button>
                <button className="bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 font-semibold text-xs py-4 px-4 rounded-xl transition-all shadow-sm flex items-center gap-1">
                  <Download size={14} /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. GLOBAL DYNAMIC UPLOAD FLOATING TRIGGER BUTTON */}
      <button
        onClick={() => setIsUploadModalOpen(true)}
        aria-label="Upload to Archive Gallery"
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 bg-[#D4AF37] text-white p-4 rounded-full shadow-2xl hover:bg-[#7A1C1C] hover:scale-105 active:scale-95 transition-all duration-200 group focus:outline-none"
      >
        <Plus size={24} className="transition-transform group-hover:rotate-90 duration-200" />
      </button>

      {/* 7. DYNAMIC DIGITAL SANCTUARY UPLOAD DIALOG OVERLAY */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-md transition-opacity duration-300">
          <div className="absolute inset-0" onClick={() => setIsUploadModalOpen(false)} />
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl border border-stone-100 relative z-10 flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
            
            {/* Header Title Grid Layer */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Camera size={18} className="text-[#7A1C1C]" />
                <h3 className="text-lg font-serif text-[#7A1C1C] font-bold tracking-wide">
                  Contribute Media Frame
                </h3>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all p-1.5 rounded-full"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Context Fields input block wrapper */}
            <form className="space-y-4 text-sm overflow-y-auto py-4 pr-1 scrollbar-thin" onSubmit={handleUploadSubmit}>
              <div className="space-y-1.5">
                <label className="text-stone-500 font-bold uppercase tracking-wide text-[10px]">Media Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Service in Kano, 1982"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-[#FCFBF8] border border-[#E6DED2] text-stone-800 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all text-sm" 
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-stone-500 font-bold uppercase tracking-wide text-[10px]">Archive Group Classification</label>
                <select 
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-[#FCFBF8] border border-[#E6DED2] text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400 text-sm appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23706E6B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_auto] bg-[right_16px_center] bg-no-repeat" 
                  required
                >
                  <option value="Portraits">Portraits</option>
                  <option value="Family Life">Family Life</option>
                  <option value="Drafting Work">Drafting Work</option>
                </select>
              </div>

              {/* Pure File Uploader Selection Target */}
              <div className="space-y-1.5">
                <label className="text-stone-500 font-bold uppercase tracking-wide text-[10px]">Media File Attachment</label>
                <label className="flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-[#E6DED2] hover:border-[#D4AF37] rounded-2xl cursor-pointer bg-[#FCFBF8] transition-all group">
                  <div className="flex gap-2 text-stone-400 group-hover:text-[#7A1C1C] transition-colors">
                    <Camera size={18} />
                  </div>
                  <span className="text-xs font-semibold text-stone-600">Select Image Asset</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileSelection} />
                </label>
              </div>

              {/* Internal Selected Image File Media Rendering Frame */}
              {uploadPreview && (
                <div className="border border-[#E6DED2] rounded-2xl overflow-hidden p-1 bg-white shadow-sm ring-1 ring-stone-100">
                  <div className="relative w-full h-44 rounded-xl overflow-hidden bg-stone-50 flex items-center justify-center">
                    <Image src={uploadPreview} alt="Upload Target Workspace Preview" fill className="object-cover" unoptimized />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-stone-500 font-bold uppercase tracking-wide text-[10px]">Frame Story Description</label>
                <textarea 
                  rows={3}
                  placeholder="Provide details about the location, contextual story, or individuals present in this memory record..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-[#FCFBF8] border border-[#E6DED2] text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400 transition-all text-sm resize-none font-medium leading-relaxed" 
                  required
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#7A1C1C] text-white text-xs font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-[#5C1313] transition-colors shadow-md mt-2"
              >
                Commit Asset to Archive
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}