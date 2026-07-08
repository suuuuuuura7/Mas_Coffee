import { getToken, clearToken } from './authToken';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MOCK_DELAY = 400;

let mockProducts = [
  { _id: '1', name: 'Macchiato', category: 'Coffee Drinks', price: 65, description: 'Espresso with a dash of steamed milk foam.', imageUrl: 'https://loremflickr.com/400/300/espresso,coffee', inStock: true },
  { _id: '2', name: 'Cappuccino', category: 'Coffee Drinks', price: 75, description: 'Equal parts espresso, steamed milk, and foam.', imageUrl: 'https://loremflickr.com/400/300/cappuccino', inStock: true },
  { _id: '3', name: 'Latte', category: 'Coffee Drinks', price: 80, description: 'Smooth espresso with steamed milk and light foam.', imageUrl: 'https://loremflickr.com/400/300/latte,coffee', inStock: true },
  { _id: '4', name: 'Americano', category: 'Coffee Drinks', price: 55, description: 'Espresso diluted with hot water for a lighter body.', imageUrl: 'https://loremflickr.com/400/300/americano,coffee', inStock: true },
  { _id: '5', name: 'Green Tea', category: 'Tea', price: 45, description: 'Light, grassy brew served hot with a hint of honey.', imageUrl: 'https://loremflickr.com/400/300/greentea', inStock: true },
  { _id: '6', name: 'Masala Chai', category: 'Tea', price: 50, description: 'Spiced black tea simmered with milk and warm spices.', imageUrl: 'https://loremflickr.com/400/300/chai,tea', inStock: true },
  { _id: '7', name: 'Mojito Mocktail', category: 'Mocktails', price: 90, description: 'Fresh mint, lime, and soda over crushed ice.', imageUrl: 'https://loremflickr.com/400/300/mojito,mocktail', inStock: true },
  { _id: '8', name: 'Passion Fruit Cooler', category: 'Mocktails', price: 95, description: 'Tropical passion fruit blended with soda and lime.', imageUrl: 'https://loremflickr.com/400/300/passionfruit,drink', inStock: true },
  { _id: '9', name: 'Chocolate Cake', category: 'Cakes & Sweets', price: 120, description: 'Rich layered chocolate sponge with ganache.', imageUrl: 'https://loremflickr.com/400/300/chocolatecake', inStock: false },
  { _id: '10', name: 'Cheesecake', category: 'Cakes & Sweets', price: 130, description: 'Classic creamy cheesecake on a biscuit base.', imageUrl: 'https://loremflickr.com/400/300/cheesecake', inStock: true },
  { _id: '11', name: 'Baklava', category: 'Cakes & Sweets', price: 85, description: 'Layered filo pastry with nuts and honey syrup.', imageUrl: 'https://loremflickr.com/400/300/baklava', inStock: true },
  { _id: '12', name: 'Iced Caramel Special', category: 'Specials', price: 95, description: 'House cold brew with caramel drizzle.', imageUrl: 'https://loremflickr.com/400/300/icedcoffee,caramel', inStock: true },
  { _id: '13', name: "Chef's Seasonal Special", category: 'Specials', price: 110, description: "This month's limited-time signature drink.", imageUrl: 'https://loremflickr.com/400/300/specialdrink', inStock: true },
];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Set to true once your backend is live, false keeps using in-memory mock data.
const USE_REAL_API = true;

// Wraps fetch for protected (write) requests. If the token is missing or
// expired the backend replies 401 — instead of a vague error, we clear the
// stale token and reload so the user lands back on the login screen.
async function authedFetch(url, options) {
  const res = await fetch(url, options);
  if (res.status === 401) {
    clearToken();
    window.location.reload();
    throw new Error('Session expired — please log in again.');
  }
  return res;
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getProducts() {
  if (USE_REAL_API) {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  }
  await delay(MOCK_DELAY);
  return [...mockProducts];
}

export async function updatePrice(productId, newPrice) {
  if (USE_REAL_API) {
    const res = await authedFetch(`${API_BASE}/products/${productId}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ price: newPrice }),
    });
    if (!res.ok) throw new Error('Failed to update price');
    return res.json();
  }
  await delay(200);
  mockProducts = mockProducts.map((p) => (p._id === productId ? { ...p, price: newPrice } : p));
  return mockProducts.find((p) => p._id === productId);
}

export async function updateImageUrl(productId, newImageUrl) {
  if (USE_REAL_API) {
    const res = await authedFetch(`${API_BASE}/products/${productId}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ imageUrl: newImageUrl }),
    });
    if (!res.ok) throw new Error('Failed to update image URL');
    return res.json();
  }
  await delay(200);
  mockProducts = mockProducts.map((p) => (p._id === productId ? { ...p, imageUrl: newImageUrl } : p));
  return mockProducts.find((p) => p._id === productId);
}

export async function toggleStock(productId, inStock) {
  if (USE_REAL_API) {
    const res = await authedFetch(`${API_BASE}/products/${productId}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ inStock }),
    });
    if (!res.ok) throw new Error('Failed to update stock status');
    return res.json();
  }
  await delay(200);
  mockProducts = mockProducts.map((p) => (p._id === productId ? { ...p, inStock } : p));
  return mockProducts.find((p) => p._id === productId);
}

export async function addProduct(product) {
  if (USE_REAL_API) {
    const res = await authedFetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to add product');
    return res.json();
  }
  await delay(300);
  const newProduct = { ...product, _id: String(Date.now()), inStock: true };
  mockProducts = [...mockProducts, newProduct];
  return newProduct;
}