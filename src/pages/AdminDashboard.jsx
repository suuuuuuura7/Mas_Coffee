import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { addProduct, getProducts, toggleStock, updatePrice } from '../services/productService';

const CATEGORY_OPTIONS = ['Coffee Drinks', 'Tea', 'Mocktails', 'Cakes & Sweets', 'Specials'];

function LoginGate({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulation only. Read from localStorage so changed passwords persist.
    const activePassword = localStorage.getItem('adminPassword') || 'mascoffee2026';
    if (password === activePassword) {
      onSuccess();
    } else {
      setError('Incorrect password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cafe-dark px-4">
      <form onSubmit={handleSubmit} className="bg-cafe-cream rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4 shadow-2xl">
        <h1 className="font-display font-bold text-xl text-cafe-dark text-center">Admin Login</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Dashboard password"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-green"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button type="submit" className="bg-cafe-dark text-cafe-green font-semibold rounded-lg py-2 text-sm">
          Enter Dashboard
        </button>
      </form>
    </div>
  );
}

function PriceInput({ product, onSaved }) {
  const [value, setValue] = useState(String(product.price));
  const [status, setStatus] = useState(''); // '' | 'saving' | 'saved'

  const commit = async () => {
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (Number.isNaN(numeric) || numeric < 0 || numeric === product.price) {
      setValue(String(product.price));
      return;
    }
    setStatus('saving');
    const updated = await updatePrice(product._id, numeric);
    onSaved(updated);
    setStatus('saved');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      {status === 'saved' && <span className="text-[10px] text-cafe-green font-bold uppercase transition-all animate-pulse">Saved!</span>}
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => setValue(e.target.value.replace(/[^0-9.]/g, ''))}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        className="w-24 rounded-md border border-stone-300 px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-cafe-gold"
      />
    </div>
  );
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', category: CATEGORY_OPTIONS[0], price: '', description: '', imageUrl: '' });
  const [formError, setFormError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');

  useEffect(() => {
    if (authed) getProducts().then(setProducts);
  }, [authed]);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword.trim().length < 4) {
      setPasswordStatus('Too short!');
      setTimeout(() => setPasswordStatus(''), 2000);
      return;
    }
    localStorage.setItem('adminPassword', newPassword.trim());
    setNewPassword('');
    setPasswordStatus('Saved!');
    setTimeout(() => setPasswordStatus(''), 2000);
  };

  const handleFormChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      setFormError('Name and price are required.');
      return;
    }
    const priceNumber = parseFloat(form.price);
    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      setFormError('Enter a valid price.');
      return;
    }
    setFormError('');
    const created = await addProduct({
      name: form.name.trim(),
      category: form.category,
      price: priceNumber,
      description: form.description.trim(),
      imageUrl: form.imageUrl.trim(),
    });
    setProducts((prev) => [...prev, created]);
    setForm({ name: '', category: CATEGORY_OPTIONS[0], price: '', description: '', imageUrl: '' });
  };

  const handlePriceSaved = (updated) => {
    setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  const handleToggleStock = async (product) => {
    const updated = await toggleStock(product._id, !product.inStock);
    setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  if (!authed) return <LoginGate onSuccess={() => setAuthed(true)} />;

  return (
    <Layout showAdminBadge>
      <div className="px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <h2 className="font-display font-bold text-cafe-dark mb-4">Add New Product</h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
              <input
                value={form.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Product name"
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
              <select
                value={form.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                value={form.price}
                onChange={(e) => handleFormChange('price', e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="Price (ETB)"
                inputMode="decimal"
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
              <textarea
                value={form.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Short description"
                rows={2}
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm resize-none"
              />
              <input
                value={form.imageUrl}
                onChange={(e) => handleFormChange('imageUrl', e.target.value)}
                placeholder="Image URL"
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
              {formError && <p className="text-xs text-red-500">{formError}</p>}
              <button type="submit" className="bg-cafe-dark text-cafe-green font-semibold rounded-lg py-2 text-sm mt-1">
                Add Product
              </button>
            </form>
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <h2 className="font-display font-bold text-cafe-dark mb-4">Security Settings</h2>
            <form onSubmit={handlePasswordChange} className="flex gap-3">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New admin password"
                className="flex-grow rounded-lg border border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button type="submit" className="bg-cafe-dark text-cafe-green font-semibold rounded-lg px-4 py-2 text-sm whitespace-nowrap">
                Update Password
              </button>
            </form>
            {passwordStatus && (
              <p className={`text-xs mt-2 font-bold uppercase transition-all animate-pulse ${passwordStatus === 'Saved!' ? 'text-cafe-green' : 'text-red-500'}`}>
                {passwordStatus}
              </p>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <section className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
          <h2 className="font-display font-bold text-cafe-dark mb-4">Manage Products</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm mb-4"
          />
          <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredProducts.map((product) => (
              <div key={product._id} className="flex items-center justify-between gap-2 border border-stone-100 rounded-lg px-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{product.name}</p>
                  <p className="text-xs text-stone-400">{product.category}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => handleToggleStock(product)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${product.inStock ? 'bg-cafe-green/20 text-cafe-green' : 'bg-red-100 text-red-500'
                      }`}
                  >
                    {product.inStock ? 'In stock' : 'Out of stock'}
                  </button>
                  <PriceInput product={product} onSaved={handlePriceSaved} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
