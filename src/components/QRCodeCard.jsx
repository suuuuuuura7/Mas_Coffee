import React from 'react';
import { MasCoffeeLogo } from './Layout';

// Renders a printable QR code that links to the live menu URL.
// Uses the free api.qrserver.com endpoint so no extra npm package is required.
// Swap the "src" for a self-hosted generator (e.g. "qrcode" npm package) later
// if you want the QR image generated fully offline.
export default function QRCodeCard({
  menuUrl = 'https://mas-coffee-black.vercel.app/menu',
  tableLabel = 'Table 1',
  size = 300,
}) {
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&color=18-18-18&bgcolor=249-246-238&data=${encodeURIComponent(menuUrl)}`;

  return (
    <div className="bg-cafe-cream border-4 border-cafe-gold rounded-2xl p-6 flex flex-col items-center gap-4 shadow-xl w-72 mx-auto print:shadow-none print:border-2">
      <div className="flex items-center gap-2">
        <MasCoffeeLogo className="w-8 h-8" />
        <span className="font-display font-bold text-lg text-cafe-dark">
          MAS COFFEE
        </span>
      </div>

      <img
        src={qrImageSrc}
        alt={`QR code linking to the digital menu for ${tableLabel}`}
        width={size}
        height={size}
        className="rounded-lg border border-stone-200"
      />

      <p className="font-display font-bold tracking-wide text-cafe-dark">SCAN TO VIEW MENU</p>
      <p className="text-xs text-stone-500">{tableLabel}</p>
    </div>
  );
}
