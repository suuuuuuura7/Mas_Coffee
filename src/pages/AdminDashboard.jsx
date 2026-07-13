import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { addProduct, getProducts, toggleStock, updateImageUrl, updatePrice, deleteProduct } from '../services/productService';

const CATEGORY_OPTIONS = ['Coffee Drinks', 'Tea', 'Mocktails', 'Cakes & Sweets', 'Specials'];
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function LoginGate({ onSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed.');
        return;
      }
      // No token to store — the browser already holds the httpOnly cookie
      // the backend set on this response.
      onSuccess();
    } catch (err) {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cafe-dark px-4">
      <form onSubmit={handleSubmit} className="bg-cafe-cream rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4 shadow-2xl">
        <h1 className="font-display font-bold text-xl text-cafe-dark text-center">Admin Login</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button type="submit" disabled={loading} className="bg-cafe-dark text-cafe-green font-semibold rounded-lg py-2 text-sm disabled:opacity-60">
          {loading ? 'Logging in...' : 'Enter Dashboard'}
        </button>
      </form>
    </div>
  );
}

function ChangePasswordPanel() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }
    setUpdatingPassword(true);
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || 'Could not update password.' });
        return;
      }
      setMessage({ type: 'success', text: 'Password updated. Use the new password next time you log in.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Could not reach the server.' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <section className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
      <h2 className="font-display font-bold text-cafe-dark mb-4">Security Settings</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
        {message.text && (
          <p className={`text-xs ${message.type === 'error' ? 'text-red-500' : 'text-cafe-green'}`}>
            {message.text}
          </p>
        )}
        <button type="submit" disabled={updatingPassword} className="bg-cafe-dark text-cafe-green font-semibold rounded-lg py-2 text-sm transition-all disabled:opacity-60 hover:-translate-y-0.5 hover:shadow-md active:scale-95">
          {updatingPassword ? 'Changing password...' : 'Update Password'}
        </button>
      </form>
    </section>
  );
}

function PriceInput({ product, onSaved }) {
  const [value, setValue] = useState(String(product.price));
  const [status, setStatus] = useState('');

  const commit = async () => {
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (Number.isNaN(numeric) || numeric < 0 || numeric === product.price) {
      setValue(String(product.price));
      return;
    }
    setStatus('saving');
    try {
      const updated = await updatePrice(product._id, numeric);
      onSaved(updated);
      setStatus('saved');
    } catch (err) {
      setStatus('');
      setValue(String(product.price));
      alert('Could not save price — try again.');
      return;
    }
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      {status === 'saved' && <span className="text-[10px] text-cafe-green font-bold uppercase animate-pulse">Saved!</span>}
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

function ImageUrlEditor({ product, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(product.imageUrl || '');
  const [error, setError] = useState('');

  const commit = async () => {
    if (!value.trim()) {
      setValue(product.imageUrl || '');
      setEditing(false);
      return;
    }
    try {
      setError('');
      const updated = await updateImageUrl(product._id, value.trim());
      onSaved(updated);
      setEditing(false);
    } catch (err) {
      setError('Save failed — try again.');
    }
  };

  if (!editing) {
    return (
      <div className="flex flex-col items-end">
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-1.5 text-[10px] font-semibold text-stone-400 hover:text-cafe-dark"
        >
          {product.imageUrl && (
            <img src={product.imageUrl} alt="" className="w-6 h-6 rounded object-cover" />
          )}
          Edit photo
        </button>
        {error && <span className="text-[10px] text-red-500">{error}</span>}
      </div>
    );
  }

  return (
    <input
      autoFocus
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      placeholder="Paste image URL"
      className="w-40 rounded-md border border-stone-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-cafe-gold"
    />
  );
}

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', category: CATEGORY_OPTIONS[0], price: '', description: '', imageUrl: '' });
  const [formError, setFormError] = useState('');
  const [addingProduct, setAddingProduct] = useState(false);

  useEffect(() => {
    // Cookie-based session check: no token to read from storage anymore.
    // The browser sends the httpOnly cookie automatically as long as we
    // pass credentials: 'include'.
    fetch(`${API_BASE}/auth/me`, { credentials: 'include' })
      .then((res) => setAuthed(res.ok))
      .finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    if (authed) getProducts().then(setProducts);
  }, [authed]);

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
    setAddingProduct(true);
    try {
      const created = await addProduct({
        name: form.name.trim(),
        category: form.category,
        price: priceNumber,
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
      });
      setProducts((prev) => [...prev, created]);
      setForm({ name: '', category: CATEGORY_OPTIONS[0], price: '', description: '', imageUrl: '' });
    } catch (err) {
      setFormError('Failed to add product. Please try again.');
    } finally {
      setAddingProduct(false);
    }
  };

  const handleProductSaved = (updated) => {
    setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  const handleToggleStock = async (product) => {
    const updated = await toggleStock(product._id, !product.inStock);
    setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  const handleDeleteProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) return;
    try {
      await deleteProduct(product._id);
      setProducts((prev) => prev.filter((p) => p._id !== product._id));
    } catch (err) {
      alert('Failed to delete product. Please try again.');
    }
  };

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cafe-dark">
        <p className="text-cafe-cream text-sm">Loading...</p>
      </div>
    );
  }

  if (!authed) return <LoginGate onSuccess={() => setAuthed(true)} />;

  return (
    <Layout showAdminBadge>
      <div className="px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
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
              <button type="submit" disabled={addingProduct} className="bg-cafe-dark text-cafe-green font-semibold rounded-lg py-2 text-sm mt-1 transition-all disabled:opacity-60 hover:-translate-y-0.5 hover:shadow-md active:scale-95">
                {addingProduct ? 'Adding...' : 'Add Product'}
              </button>
            </form>
          </section>

          <ChangePasswordPanel />
        </div>

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
                    onClick={() => handleDeleteProduct(product)}
                    className="text-[10px] font-bold px-2 py-1 rounded-full uppercase bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleToggleStock(product)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${product.inStock ? 'bg-cafe-green/20 text-cafe-green' : 'bg-red-100 text-red-500'
                      }`}
                  >
                    {product.inStock ? 'In stock' : 'Out of stock'}
                  </button>
                  <ImageUrlEditor product={product} onSaved={handleProductSaved} />
                  <PriceInput product={product} onSaved={handleProductSaved} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}