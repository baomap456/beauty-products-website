import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductPage from './pages/admin/ProductPage';
import CategoryPage from './pages/admin/CategoryPage';
import BrandPage from './pages/admin/BrandPage';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRouter';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected wrapper */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          {/* Admin layout inside protected area */}
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="categories" element={<CategoryPage />} />
            <Route path="brands" element={<BrandPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;