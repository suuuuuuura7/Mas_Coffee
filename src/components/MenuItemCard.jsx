// import React from 'react';

// export default function MenuItemCard({ item }) {
//   const { name, description, price, imageUrl, inStock } = item;

//   return (
//     <div className="flex gap-3 bg-white rounded-xl p-3 shadow-sm border border-stone-100 relative">
//       <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0 relative">
//         {imageUrl ? (
//           <img src={imageUrl} alt={name} className="w-full h-full object-cover" loading="lazy" />
//         ) : (
//           <div className="w-full h-full animate-pulse bg-stone-200" />
//         )}
//         {!inStock && (
//           <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
//             <span className="text-[10px] font-bold text-white uppercase tracking-wide">Out of stock</span>
//           </div>
//         )}
//       </div>

//       <div className="flex-grow flex flex-col justify-center">
//         <h3 className="font-display font-semibold text-cafe-dark text-sm">{name}</h3>
//         <p className="text-xs text-stone-500 line-clamp-2">{description}</p>
//       </div>

//       <div className="flex flex-col items-end justify-center">
//         <span className="font-display font-bold text-cafe-gold text-sm whitespace-nowrap">
//           {price.toFixed(2)} ETB
//         </span>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';

// Each category gets its own footer color, matching the vertical card style
// (image top, centered text middle, solid color price bar at the bottom).
const CATEGORY_FOOTER_STYLES = {
  'Coffee Drinks': 'bg-cafe-gold text-cafe-dark',
  'Tea': 'bg-emerald-500 text-white',
  'Mocktails': 'bg-pink-500 text-white',
  'Cakes & Sweets': 'bg-rose-400 text-white',
  'Specials': 'bg-cafe-green text-cafe-dark',
};

const DEFAULT_FOOTER_STYLE = 'bg-cafe-dark text-white';

export default function MenuItemCard({ item }) {
  const { name, description, price, category, imageUrl, inStock } = item;
  const [imageLoaded, setImageLoaded] = useState(false);
  const footerStyle = CATEGORY_FOOTER_STYLES[category] || DEFAULT_FOOTER_STYLE;

  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 relative h-full">
      <div className="relative w-full h-48 sm:h-56 bg-stone-100">
        {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-stone-200" />}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        )}
        {!inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-xs font-bold text-white uppercase tracking-wide">Out of stock</span>
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col items-center text-center px-4 py-3 gap-1">
        <h3 className="font-display font-semibold text-cafe-dark text-sm leading-snug">{name}</h3>
        <p className="text-xs text-stone-500 line-clamp-2">{description}</p>
      </div>

      <div className={`w-full py-2 text-center font-display font-bold text-sm tracking-wide ${footerStyle}`}>
        {price.toFixed(2)} ETB
      </div>
    </div>
  );
}
