import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductPage from './pages/admin/ProductPage';
import CategoryPage from './pages/admin/CategoryPage';
import BrandPage from './pages/admin/BrandPage';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRouter';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/public/HomePage';
import ShopPage from './pages/public/ShopPage';
import CartPage from './pages/public/CartPage';
import AddressPage from './pages/public/AddressPage';
import { CartProvider } from './contexts/CartContext';
import OrderPage from './pages/public/OrderPage';
import OrderSuccessPage from './pages/public/OrderSuccessPage';
import ProductPageDetail from './pages/public/ProductPageDetail';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<ProductPage />} />
              <Route path="categories" element={<CategoryPage />} />
              <Route path="brands" element={<BrandPage />} />
            </Route>
          </Route>

          <Route path="/" element={<MainLayout />}>

            <Route index element={<HomePage />} />

            <Route path="shop" element={<ShopPage />} />

            <Route path="product/:id" element={<ProductPageDetail />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="addresses" element={<AddressPage />} />
            <Route path="order" element={<OrderPage />} />
            <Route path="order-success" element={<OrderSuccessPage />} />
          </Route>

        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;