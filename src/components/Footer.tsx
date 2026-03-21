export default function Footer() {
  return (
    <footer className="w-full bg-[#1A1A1A] text-white rounded-t-2xl px-6 sm:px-12 md:px-16 pt-16 sm:pt-24 pb-8 mt-16 shadow-[0_-20px_40px_-5px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col justify-between min-h-[60vh]">

      {/* Top section: Content */}
      <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16 mb-24 md:mb-32 z-10">

        {/* Brand & Tagline - Left Side */}
        <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-end h-full">
          <div>
            <p className="font-drama italic text-3xl sm:text-4xl lg:text-4xl text-white/90 leading-tight max-w-[20ch]">
              Precision design for spaces that honor exactness and warmth.
            </p>
          </div>
        </div>

        {/* Links - Right Side */}
        <div className="md:col-span-7 lg:col-start-7 lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-8">
          {/* Studio */}
          <div>
            <p className="font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-white/50 mb-6 sm:mb-8">
              Studio
            </p>
            <ul className="space-y-4 font-sans text-xs md:text-sm text-white/50">
              <li><a href="#" className="hover:text-white transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Philosophy</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Press</a></li>
            </ul>
          </div>

          {/* Work */}
          <div>
            <p className="font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-white/50 mb-6 sm:mb-8">
              Work
            </p>
            <ul className="space-y-4 font-sans text-xs md:text-sm text-white/50">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Residential</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Commercial</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Archive</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Journal</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-white/50 mb-6 sm:mb-8">
              Connect
            </p>
            <ul className="space-y-4 font-sans text-xs md:text-sm text-white/50">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Twitter</a></li>
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom section: Giant Text Ticker */}
      <div
        className="w-full mt-auto overflow-hidden pointer-events-none pb-4 sm:pb-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}
      >
        <div className="flex w-max shrink-0">
          <div className="flex shrink-0 animate-marquee items-center">
            {/* Repeated text blocks for the first half of the seamless loop */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <h1 className="text-[13vw] sm:text-[14vw] leading-[0.75] font-drama uppercase tracking-tighter text-white whitespace-nowrap">
                  ATELIER<span className="font-sans font-light mx-2 sm:mx-4 opacity-70">-</span>MAREN
                </h1>
                <span className="mx-6 sm:mx-12 font-sans font-light text-[4vw] sm:text-[3vw] text-white/30">✦</span>
              </div>
            ))}
          </div>
          <div className="flex shrink-0 animate-marquee items-center" aria-hidden="true">
            {/* Repeated text blocks for the second half of the seamless loop */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <h1 className="text-[13vw] sm:text-[14vw] leading-[0.75] font-drama uppercase tracking-tighter text-white whitespace-nowrap">
                  ATELIER<span className="font-sans font-light mx-2 sm:mx-4 opacity-70">-</span>MAREN
                </h1>
                <span className="mx-6 sm:mx-12 font-sans font-light text-[4vw] sm:text-[3vw] text-white/30">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}
