export default function Footer() {
  return (
    <footer className="bg-[#FCFBF8] border-t border-[#E6DED2] py-8 sm:py-10 md:py-16 mt-16 sm:mt-20 md:mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        
        <div className="text-center md:text-left">
          <p className="font-serif text-lg sm:text-xl text-[#7A1C1C] font-semibold mb-2 tracking-wide">
            Eternal Memories
          </p>
          <p className="text-[11px] sm:text-xs text-stone-500 font-medium leading-relaxed max-w-md">
            &copy; 2026 OGBUESHI BENNETT AMAECHI OGUEGBU. Memorial crafted with love.
          </p>
        </div>

        {/* <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 text-[11px] sm:text-xs text-stone-500 font-medium tracking-wide">
          <a
            href="#"
            className="hover:text-[#D4AF37] transition-colors duration-200"
          >
            Our Mission
          </a>

          <a
            href="#"
            className="hover:text-[#D4AF37] transition-colors duration-200"
          >
            Privacy Mandate
          </a>

          <a
            href="#"
            className="hover:text-[#D4AF37] transition-colors duration-200"
          >
            System Terms
          </a>
        </div> */}

      </div>
    </footer>
  );
}