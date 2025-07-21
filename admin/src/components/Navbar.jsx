import { ExternalLink } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40 w-full border-b-2 border-[#D4AF37]">
      <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between gap-6">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <span className="text-3xl font-extrabold font-serif text-[#D4AF37] tracking-wide">Auréa</span>
          <span className="ml-2 text-base font-semibold text-[#B8860B] hidden md:inline">Admin Panel</span>
        </div>
        {/* Center: (empty for admin) */}
        <div className="flex-1"></div>
        {/* Right: View Store & Admin */}
        <div className="flex items-center gap-6">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#D4AF37] font-semibold hover:underline text-base"
          >
            <ExternalLink className="w-5 h-5" />
            <span>View Store</span>
          </a>
          <div className="flex items-center gap-2 bg-[#fff6ee] px-3 py-1 rounded-full border border-[#D4AF37]">
            <span className="font-medium text-gray-800">Admin</span>
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center border-2 border-[#B8860B]">
              <span className="text-white font-bold font-serif text-lg">A</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 