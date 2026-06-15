import Image from 'next/image';

const archivalVideos = [
  { title: "Summer at the Cape, 1982", length: "11:42", desc: "A short cinematic reflection look into our annual family tracking trip.", banner: "/images/vid-thumb-1.jpg" },
  { title: "The 70th Birthday Gala", length: "18:15", desc: "Speeches, dynamic legacy clips, and music highlights from the night.", banner: "/images/vid-thumb-2.jpg" },
  { title: "Office Space Retrospective", length: "05:21", desc: "A tour through Samuel’s historical architecture mapping files.", banner: "/images/vid-thumb-3.jpg" }
];

export default function VideosView() {
  return (
    <div className="space-y-16">
      {/* Top Banner Video Block */}
      <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-md group cursor-pointer">
        <Image src="/images/video-hero.jpg" alt="Featured Frame" fill className="object-cover" />
        <div className="absolute inset-0 bg-dark-brown/20 transition-opacity group-hover:bg-dark-brown/30" />
        
        {/* Play Icon shape */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-gold fill-current ml-1" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 text-white">
          <span className="text-[10px] tracking-widest font-bold uppercase bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">Primary Showcase</span>
          <h2 className="text-3xl font-serif text-white mt-3">The Architect of Our Time: A Legacy Recording</h2>
        </div>
      </div>

      {/* Split Archive Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Left Side: Video Archive list */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-2xl font-serif mb-1">Archival Logs</h3>
            <p className="text-xs text-stone-400 font-light">A curated index of physical family tapes converted to digital format.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {archivalVideos.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden border border-stone-200/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-40 bg-stone-100">
                  <Image src={item.banner} alt={item.title} fill className="object-cover" />
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">{item.length}</span>
                </div>
                <div className="p-4">
                  <h4 className="font-serif font-medium text-base mb-1 truncate">{item.title}</h4>
                  <p className="text-xs text-stone-400 font-light line-clamp-2">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Shared Submission Form Widget */}
        <div className="bg-light-gold/60 p-6 rounded-2xl border border-stone-200/40">
          <h3 className="text-xl font-serif mb-1">Contribute Media</h3>
          <p className="text-xs text-stone-500 font-light mb-4">Upload recorded clips or cloud share files directly to our archivist.</p>
          
          <form className="space-y-3">
            <input type="text" placeholder="Your Full Name" className="w-full text-xs p-3 rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-gold" />
            <input type="text" placeholder="Relationship to Samuel" className="w-full text-xs p-3 rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-gold" />
            <input type="text" placeholder="Clip Context/Title" className="w-full text-xs p-3 rounded-lg border border-stone-200 bg-white focus:outline-none focus:border-gold" />
            <div className="border border-dashed border-stone-300 bg-white/40 rounded-lg p-6 text-center cursor-pointer hover:bg-white transition-colors">
              <span className="text-[11px] text-stone-400 font-light">Drop files here or click to choose from local disk storage</span>
            </div>
            <button className="w-full bg-dark-brown text-white text-xs font-semibold py-3 rounded-lg uppercase tracking-wider hover:bg-gold transition-colors">Submit Clip</button>
          </form>
        </div>

      </div>
    </div>
  );
}