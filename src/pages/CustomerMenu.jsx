// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import Fuse from 'fuse.js';
// import Layout from '../components/Layout';
// import MenuItemCard from '../components/MenuItemCard';
// import { getProducts } from '../services/productService';

// const CATEGORIES = ['All', 'Coffee Drinks', 'Cakes & Sweets', 'Specials'];

// // threshold 0.4 tolerates a couple of misspelled/missing letters
// // (e.g. "moktale" still matches "Mocktail"). Lower = stricter, higher = looser.
// const FUSE_OPTIONS = {
//   keys: [
//     { name: 'name', weight: 0.7 },
//     { name: 'category', weight: 0.2 },
//     { name: 'description', weight: 0.1 },
//   ],
//   threshold: 0.4,
//   includeScore: true,
// };

// export default function CustomerMenu() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const searchBoxRef = useRef(null);

//   useEffect(() => {
//     let mounted = true;
//     getProducts().then((data) => {
//       if (mounted) {
//         setProducts(data);
//         setLoading(false);
//       }
//     });
//     return () => { mounted = false; };
//   }, []);

//   // Close the suggestion dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const fuse = useMemo(() => new Fuse(products, FUSE_OPTIONS), [products]);

//   // Fuzzy search results, ranked by closeness (best match first)
//   const searchResults = useMemo(() => {
//     if (!searchTerm.trim()) return products;
//     return fuse.search(searchTerm).map((result) => result.item);
//   }, [searchTerm, fuse, products]);

//   const filteredProducts = useMemo(() => {
//     return searchResults.filter(
//       (p) => activeCategory === 'All' || p.category === activeCategory
//     );
//   }, [searchResults, activeCategory]);

//   // Top 5 name suggestions shown under the search box as the user types
//   const suggestions = useMemo(() => {
//     if (!searchTerm.trim()) return [];
//     const seen = new Set();
//     return searchResults
//       .filter((p) => {
//         if (seen.has(p.name)) return false;
//         seen.add(p.name);
//         return true;
//       })
//       .slice(0, 5);
//   }, [searchResults, searchTerm]);

//   const handleSuggestionClick = (name) => {
//     setSearchTerm(name);
//     setShowSuggestions(false);
//   };

//   return (
//     <Layout>
//       <div className="px-4 pt-4 pb-2 bg-cafe-cream relative" ref={searchBoxRef}>
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setShowSuggestions(true);
//           }}
//           onFocus={() => setShowSuggestions(true)}
//           placeholder="Search the menu... (e.g. cake, mocktail)"
//           className="w-full rounded-full border border-stone-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cafe-green"
//         />

//         {showSuggestions && suggestions.length > 0 && (
//           <div className="absolute left-4 right-4 mt-1 bg-white rounded-xl shadow-lg border border-stone-100 z-50 overflow-hidden">
//             {suggestions.map((item) => (
//               <button
//                 key={item._id}
//                 onClick={() => handleSuggestionClick(item.name)}
//                 className="w-full text-left px-4 py-2 text-sm hover:bg-cafe-cream flex items-center justify-between"
//               >
//                 <span className="font-medium text-cafe-dark">{item.name}</span>
//                 <span className="text-xs text-stone-400">{item.category}</span>
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="sticky top-[60px] z-40 bg-cafe-cream/95 backdrop-blur px-4 py-2 flex gap-2 overflow-x-auto border-b border-stone-200">
//         {CATEGORIES.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => setActiveCategory(cat)}
//             className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
//               activeCategory === cat
//                 ? 'bg-cafe-dark text-cafe-green'
//                 : 'bg-white text-stone-500 border border-stone-200'
//             }`}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>

//       <div className="px-4 py-4 flex flex-col gap-3">
//         {loading &&
//           Array.from({ length: 4 }).map((_, i) => (
//             <div key={i} className="h-24 rounded-xl bg-stone-100 animate-pulse" />
//           ))}

//         {!loading && filteredProducts.length === 0 && (
//           <p className="text-center text-sm text-stone-400 py-8">
//             No items match "{searchTerm}". Try a different spelling.
//           </p>
//         )}

//         {!loading &&
//           filteredProducts.map((item) => <MenuItemCard key={item._id} item={item} />)}
//       </div>
//     </Layout>
//   );
// }

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Fuse from 'fuse.js';
import Layout from '../components/Layout';
import MenuItemCard from '../components/MenuItemCard';
import { getProducts } from '../services/productService';

const CATEGORIES = ['All', 'Coffee Drinks', 'Tea', 'Mocktails', 'Cakes & Sweets', 'Specials'];

// threshold 0.4 tolerates a couple of misspelled/missing letters
// (e.g. "moktale" still matches "Mocktail"). Lower = stricter, higher = looser.
const FUSE_OPTIONS = {
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'category', weight: 0.2 },
    { name: 'description', weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
};

export default function CustomerMenu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    getProducts().then((data) => {
      if (mounted) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  // Close the suggestion dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fuse = useMemo(() => new Fuse(products, FUSE_OPTIONS), [products]);

  // Fuzzy search results, ranked by closeness (best match first)
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return products;
    return fuse.search(searchTerm).map((result) => result.item);
  }, [searchTerm, fuse, products]);

  const filteredProducts = useMemo(() => {
    return searchResults.filter(
      (p) => activeCategory === 'All' || p.category === activeCategory
    );
  }, [searchResults, activeCategory]);

  // Top 5 name suggestions shown under the search box as the user types
  const suggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const seen = new Set();
    return searchResults
      .filter((p) => {
        if (seen.has(p.name)) return false;
        seen.add(p.name);
        return true;
      })
      .slice(0, 5);
  }, [searchResults, searchTerm]);

  const handleSuggestionClick = (name) => {
    setSearchTerm(name);
    setShowSuggestions(false);
  };

  return (
    <Layout>
      <div className="px-4 pt-4 pb-2 bg-cafe-cream relative" ref={searchBoxRef}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search the menu... (e.g. cake, mocktail)"
          className="w-full rounded-full border border-stone-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cafe-green"
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-4 right-4 mt-1 bg-white rounded-xl shadow-lg border border-stone-100 z-50 overflow-hidden">
            {suggestions.map((item) => (
              <button
                key={item._id}
                onClick={() => handleSuggestionClick(item.name)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-cafe-cream flex items-center justify-between"
              >
                <span className="font-medium text-cafe-dark">{item.name}</span>
                <span className="text-xs text-stone-400">{item.category}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="sticky top-[60px] z-40 bg-cafe-cream/95 backdrop-blur px-4 py-2 flex gap-2 overflow-x-auto border-b border-stone-200">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${activeCategory === cat
              ? 'bg-cafe-dark text-cafe-green'
              : 'bg-white text-stone-500 border border-stone-200'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-3 py-4 grid grid-cols-2 md:grid-cols-3 gap-3 sm:px-4 sm:gap-4">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-stone-100 animate-pulse" />
          ))}

        {!loading && filteredProducts.length === 0 && (
          <p className="col-span-full text-center text-sm text-stone-400 py-8">
            No items match "{searchTerm}". Try a different spelling.
          </p>
        )}

        {!loading &&
          filteredProducts.map((item) => <MenuItemCard key={item._id} item={item} />)}
      </div>
    </Layout>
  );
}