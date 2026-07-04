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

## Hosting — Option B: Firebase (Hosting + Firestore, no separate backend)
Only relevant if you rebuild the data layer on Firestore instead of MongoDB/Express.

1. `npm install -g firebase-tools` → `firebase login`.
2. `firebase init` in the project root → choose Hosting (and Firestore if using it) → set the public/build directory to `dist` → configure as a single-page app (yes).
3. `npm run build` to generate `dist/`.
4. `firebase deploy` → Firebase gives you a `https://mascoffee.web.app` URL.
5. If using Firestore, replace the calls in `productService.js` with `getDocs`, `updateDoc`, `addDoc` from the Firebase SDK, and use Firebase Auth for the admin login instead of the simulated password gate.

---

## Firebase vs MongoDB Atlas (MERN) — honest recommendation

**Pick MongoDB Atlas + Express (MERN).** Here's the actual reasoning, not just "both are fine":

- You already have two MERN projects (MamaGuide, PhotoSasha) where you own the backend. Reusing Atlas + Express means you're compounding a skill you're actively building, not starting a new paradigm for a small client project.
- This app doesn't need Firestore's realtime listeners. A customer scans a QR code, gets a fresh page load, sees current prices/stock — you don't need sub-second sync while they're sitting at the table. A normal REST fetch on page load is enough.
- MERN gives you a real Express API you fully control — easier to add features later (order tracking, analytics per table using that `?table=` param, staff roles) without hitting Firestore's query/pricing limits.
- Backend engineering (schema design, REST routes, auth middleware) is exactly what your coursework and job-relevant skills are pointing at. Firebase would trade some of that learning for convenience you don't need at this scale.

**Where Firebase would actually win** (being fair to it): if you wanted zero backend code at all, built-in auth in five minutes, and free hosting + database in one console — Firebase is faster to ship for a genuinely tiny, single-cafe app with no ambition to grow. If this were a one-off weekend project instead of a portfolio/skill-building piece, I'd lean Firebase. But given what you're building toward, MERN is the better call here.

---

## A few things I assumed — correct me if wrong
- Prices are in ETB (Ethiopian Birr) since the cafe is in Bahir Dar — swap the label in `MenuItemCard.jsx` if not.
- The admin login is a simulated password gate, not real auth — fine for a demo/client pitch, but replace with real auth (JWT + bcrypt on your Express backend, or Firebase Auth) before this touches real orders.
- I didn't implement the EN/AM language toggle mentioned in your notes — happy to add it if you tell me whether you want static translated strings or a full i18n library (react-i18next).
