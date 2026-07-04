import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomerMenu from './pages/CustomerMenu';
import AdminDashboard from './pages/AdminDashboard';
import QRPrintPage from './pages/QRPrintPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/menu" replace />} />
        <Route path="/menu" element={<CustomerMenu />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/qr-print" element={<QRPrintPage />} />
      </Routes>
    </BrowserRouter>
  );
}
