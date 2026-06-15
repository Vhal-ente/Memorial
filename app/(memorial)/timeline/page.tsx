import Image from 'next/image';

const milestoneEvents = [
  {
    date: "MAY 12, 1942",
    title: "A New Beginning in Newhaven",
    desc: "Born in the coastal town of Newhaven, Samuel was the third of four children. His family ran a small pottery business, instilling a love for craftsmanship early on.",
    img: "/images/timeline-1.jpg"
  },
  {
    date: "SPRING 1960",
    title: "Coastal Adventures & Maritime Curiosity",
    desc: "Samuel spent his youth exploring the coastline, collecting interesting artifacts, and developing a keen fascination with historical navigation charts.",
    img: "/images/timeline-2.jpg"
  },
  {
    date: "JULY 1964",
    title: "A Scholar of Design at State University",
    desc: "A dedicated student of architectural design history, Samuel enrolled in historical research, falling into an intense love affair with drafting blueprints.",
    img: "/images/timeline-3.jpg"
  }
];

export default function TimelineView() {
  return (
    <div className="relative py-10 max-w-5xl mx-auto">
      {/* Central spine track divider */}
      <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[1px] bg-stone-200" />

      <div className="space-y-24">
        {milestoneEvents.map((event, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={index} className="flex flex-col md:flex-row items-center justify-between gap-12 relative w-full">
              
              {/* Content Card Panel */}
              <div className={`w-full md:w-[44%] ${isEven ? 'md:text-right' : 'md:order-last md:text-left'}`}>
                <span className="text-xs font-mono tracking-widest text-gold font-bold block mb-2">{event.date}</span>
                <h3 className="text-3xl font-serif mb-4 leading-tight">{event.title}</h3>
                <p className="text-stone-500 font-light leading-relaxed text-sm">{event.desc}</p>
              </div>

              {/* Decorative Tracker Node Marker */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                <div className="w-4 h-4 bg-gold border-4 border-background rounded-full z-10 shadow-sm" />
              </div>

              {/* Visual Frame Block */}
              <div className="w-full md:w-[44%]">
                <div className="relative h-80 rounded-2xl overflow-hidden shadow-md">
                  <Image src={event.img} alt={event.title} fill className="object-cover" />
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}