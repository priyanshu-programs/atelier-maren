export default function Footer() {
  return (
    <footer className="w-full bg-[#1A1A1A] text-white rounded-t-[2rem] sm:rounded-t-[3rem] md:rounded-t-[4rem] px-4 sm:px-6 md:px-16 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 mt-16 shadow-[0_-20px_40px_-5px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 lg:gap-24">
        {/* Brand */}
        <div className="md:col-span-5 flex flex-col justify-between h-full">
          <div>
            <h2 className="font-drama italic text-3xl font-medium mb-4">Atelier Maren</h2>
            <p className="font-sans text-white/50 text-sm max-w-[25ch] leading-relaxed">
              Precision design for spaces that honor exactness and warmth.
            </p>
          </div>
          <div className="mt-8 sm:mt-12 md:mt-16 bg-white/5 border border-white/10 rounded-full px-4 py-2 w-max flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/70">
              System Operational
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <h4 className="font-sans text-xs uppercase tracking-widest text-white/40 mb-6">
              Studio
            </h4>
            <ul className="space-y-4 font-sans text-sm text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Philosophy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-xs uppercase tracking-widest text-white/40 mb-6">
              Work
            </h4>
            <ul className="space-y-4 font-sans text-sm text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">Residential</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Commercial</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Archive</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Journal</a></li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h4 className="font-sans text-xs uppercase tracking-widest text-white/40 mb-6">
              Connect
            </h4>
            <ul className="space-y-4 font-sans text-sm text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 sm:mt-16 md:mt-24 pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs font-sans text-white/40 uppercase tracking-widest">
        <span>© {new Date().getFullYear()} Atelier Maren. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
