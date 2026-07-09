import React from 'react';
import QRCodeCard from '../components/QRCodeCard';

// Visit /qr-print in the browser, then use the browser's Print dialog
// to print this card (as many copies as you need for your tables).
const MENU_URL = import.meta.env.VITE_MENU_URL || 'https://mas-coffee-black.vercel.app/menu';

export default function QRPrintPage() {
  return (
    <div className="min-h-screen bg-white py-10 print:py-0 flex items-center justify-center">
      <QRCodeCard menuUrl={MENU_URL} />
    </div>
  );
}