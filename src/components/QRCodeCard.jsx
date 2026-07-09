import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { MasCoffeeLogo } from './Layout';

// Renders a printable QR code that links to the live menu URL.
// Generated fully client-side with the 'qrcode' package — no external
// API calls, so it never depends on a third-party service being up.
export default function QRCodeCard({
  menuUrl = 'https://mas-coffee-black.vercel.app/menu',
  size = 300,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, menuUrl, {
        width: size,
        margin: 1,
        color: {
          dark: '#121212',
          light: '#F9F6EE',
        },
      }).catch((err) => console.error('QR code generation failed:', err));
    }
  }, [menuUrl, size]);

  return (
    <div className="bg-cafe-cream border-4 border-cafe-gold rounded-2xl p-6 flex flex-col items-center gap-4 shadow-xl w-72 mx-auto print:shadow-none print:border-2">
      <div className="flex items-center gap-2">
        <MasCoffeeLogo className="w-8 h-8" />
        <span className="font-display font-bold text-lg text-cafe-green">
          MAS COFFEE
        </span>
      </div>

      <canvas
        ref={canvasRef}
        className="rounded-lg border border-stone-200"
      />

      <p className="font-display font-bold tracking-wide text-cafe-dark">SCAN TO VIEW MENU</p>
    </div>
  );
}