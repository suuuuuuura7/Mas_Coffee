import React from 'react';
import { Link } from 'react-router-dom';

export const MasCoffeeLogo = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="32" cy="55" rx="14" ry="22" transform="rotate(-25 32 55)" fill="#E5E7EB" stroke="#dfb73c" strokeWidth="2" />
    <path d="M24 40 C 30 48, 28 62, 38 70" stroke="#dfb73c" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
    <ellipse cx="68" cy="55" rx="14" ry="22" transform="rotate(25 68 55)" fill="#E5E7EB" stroke="#dfb73c" strokeWidth="2" />
    <path d="M62 70 C 72 62, 70 48, 76 40" stroke="#dfb73c" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
    <ellipse cx="50" cy="48" rx="16" ry="26" fill="#dfb73c" />
    <path d="M50 22 C46 32, 54 42, 50 54 C46 64, 52 70, 50 74" stroke="#f9f6ee" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M47 40 C44 46, 48 52, 54 50" stroke="#f9f6ee" strokeWidth="1.5" fill="none" strokeLinecap="round" />
  </svg>
);



// ... MasCoffeeLogo stays exactly the same ...

export default function Layout({ children, showAdminBadge = false }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-cafe-cream text-cafe-dark flex flex-col font-sans">
      <header className="bg-cafe-dark text-white py-3 px-4 sticky top-0 z-50 shadow-md flex items-center justify-between">
        <Link to="/menu" className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
          <MasCoffeeLogo className="w-10 h-10" />
          <span className="font-display font-bold tracking-wider text-xl text-cafe-green">
            MAS <span className="text-cafe-gold">COFFEE</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {!showAdminBadge && (
            <Link
              to="/admin/dashboard"
              className="text-[10px] font-bold px-2 py-1 rounded border border-stone-700 text-stone-300 uppercase tracking-tight hover:bg-[#dfb73c] hover:text-black hover:border-[#dfb73c] transition-colors"
            >
              Admin
            </Link>
          )}
          <div className="text-xs bg-cafe-green text-black px-2 py-1 rounded font-bold uppercase tracking-tight">
            {showAdminBadge ? 'Admin' : 'Digital Menu'}
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-cafe-dark text-gray-400 py-8 px-4 mt-auto border-t border-stone-800 text-center">
        <div className="flex flex-col items-center gap-3">
          <MasCoffeeLogo className="w-14 h-14 opacity-80" />
          <p className="text-sm font-semibold tracking-widest text-white">MAS COFFEE & CAKE</p>
          <p className="text-xs max-w-xs text-stone-500">
            Freshly roasted coffee and exquisite cakes in Bahir Dar. Scan for modern table service.
          </p>
          <div className="w-12 h-px bg-stone-800 my-2"></div>
          <p className="text-xs text-stone-600">&copy; {currentYear} All Rights Reserved. Powered by Mas Digital Core.</p>
        </div>
      </footer>
    </div>
  );
}
