import { Routes, Route, Outlet } from 'react-router-dom'
import { UserLayout } from './components/layout/UserLayout'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { ProductsPage } from './pages/public/ProductsPage'
import { ProductDetailPage } from './pages/public/ProductDetailPage'
import { CartPage } from './pages/private/CartPage'
import { CheckoutPage } from './pages/private/CheckoutPage'
import { OrderSuccessPage } from './pages/private/OrderSuccessPage'
import { OrderHistoryPage } from './pages/private/OrderHistoryPage'

// Admin Components
import { AdminLayout } from './components/layout/AdminLayout'
import { ProtectedAdminRoute } from './components/routing/ProtectedAdminRoute'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'

import { HomePage } from './pages/public/HomePage'

function App() {
  return (
    <Routes>
      {/* Public & Customer Routes with UserLayout */}
      <Route element={<UserLayout><Outlet /></UserLayout>}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment-return" element={<OrderSuccessPage />} />
        <Route path="/orders" element={<OrderHistoryPage />} />
      </Route>

      {/* Admin Routes with AdminLayout */}
      <Route path="/admin" element={<ProtectedAdminRoute />}>
        <Route element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Route>

      {/* Auth Routes */}
      <Route element={<UserLayout><Outlet /></UserLayout>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  )
}

export default App
