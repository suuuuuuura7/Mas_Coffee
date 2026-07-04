import React from 'react';
import QRCodeCard from '../components/QRCodeCard';

// Visit /qr-print in the browser, then use the browser's Print dialog
// to print one card per table. Change TABLE_COUNT and MENU_URL below.
const MENU_URL = 'https://mascoffee.vercel.app/menu';
const TABLE_COUNT = 8;

export default function QRPrintPage() {
  const tables = Array.from({ length: TABLE_COUNT }, (_, i) => `Table ${i + 1}`);

  return (
    <div className="min-h-screen bg-white py-10 print:py-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 print:grid-cols-2 max-w-3xl mx-auto px-4">
        {tables.map((label) => (
          <QRCodeCard key={label} menuUrl={`${MENU_URL}?table=${encodeURIComponent(label)}`} tableLabel={label} />
        ))}
      </div>
    </div>
  );
}
