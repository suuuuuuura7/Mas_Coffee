import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { MasCoffeeLogo } from './Layout';

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
      })
        .then(() => {
          // The qrcode library sets its own inline width/height styles on
          // the canvas, which override our Tailwind classes. Clear them so
          // our CSS sizing actually takes effect.
          if (canvasRef.current) {
            canvasRef.current.style.width = '100%';
            canvasRef.current.style.height = '100%';
          }
        })
        .catch((err) => console.error('QR code generation failed:', err));
    }
  }, [menuUrl, size]);

  return (
    <div className="bg-cafe-cream border-4 border-cafe-gold rounded-2xl p-6 flex flex-col items-center gap-4 shadow-xl w-80 mx-auto print:shadow-none print:border-2">
      <div className="flex items-center gap-2">
        <MasCoffeeLogo className="w-8 h-8" />
        <span className="font-display font-bold text-lg text-cafe-green">
          MAS COFFEE
        </span>
      </div>

      <div className="w-56 h-56 sm:w-64 sm:h-64">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-lg border border-stone-200"
        />
      </div>

      <p className="font-display font-bold tracking-wide text-cafe-dark">SCAN TO VIEW MENU</p>
    </div>
  );
}