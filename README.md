# MAS COFFEE & CAKE — Digital QR Menu

## Project structure
```
mas-coffee-menu/
├── src/                  React frontend (Vite + Tailwind)
│   ├── components/       Layout, QRCodeCard, MenuItemCard
│   ├── pages/            CustomerMenu, AdminDashboard, QRPrintPage
│   └── services/         productService.js (swap mock → real API)
└── backend/              Express + MongoDB Atlas API
    ├── models/Product.js
    ├── routes/products.js
    └── server.js
```

## Run locally

**Frontend**
```
npm install
npm run dev
```
Visit `http://localhost:5173/menu` (customer view), `/admin/dashboard` (password: `mascoffee2026` — change this before launch), `/qr-print` (printable QR cards).

**Backend**
```
cd backend
npm install
cp .env.example .env   # fill in your MongoDB Atlas connection string
npm run dev
```
Once the backend works, set `USE_REAL_API = true` in `src/services/productService.js` and add `VITE_API_URL=http://localhost:5000/api` to a `.env` file in the project root.

## How the QR code works
`QRCodeCard.jsx` builds a QR image on the fly from `menuUrl` using a free QR image API — no extra package needed. `QRPrintPage.jsx` (`/qr-print`) prints one card per table, each carrying a `?table=` query so you can later track scans per table if you want that analytics later. Print these, laminate, and place one per table.

---

## Hosting — Option A: Vercel (frontend) + Render (backend) + MongoDB Atlas
This is the path that matches the MERN stack in this project.

1. **MongoDB Atlas**: create a free M0 cluster → Database Access (create a user) → Network Access (allow `0.0.0.0/0` for now, restrict later) → copy the connection string into `backend/.env`.
2. **Backend on Render**: push `backend/` to GitHub → on Render, "New Web Service" → connect the repo → build command `npm install`, start command `npm start` → add `MONGODB_URI` as an environment variable → deploy. Render gives you a URL like `https://mas-coffee-api.onrender.com`.
3. **Frontend on Vercel**: push the frontend to GitHub → import the repo in Vercel → framework preset "Vite" → add environment variable `VITE_API_URL=https://mas-coffee-api.onrender.com/api` → deploy. Vercel gives you `https://mascoffee.vercel.app`.
4. Update `MENU_URL` in `src/pages/QRPrintPage.jsx` to your real Vercel domain, redeploy, then print your QR cards from `/qr-print`.
5. Optional: buy a custom domain and point it at Vercel (Vercel → Project → Domains).
