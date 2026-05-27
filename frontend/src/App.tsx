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
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage'
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage'
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage'
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'

// Public informational components
import { HomePage } from './pages/public/HomePage'
import { AboutPage } from './pages/public/AboutPage'
import { SalesPage } from './pages/public/SalesPage'
import { BlogPage } from './pages/public/BlogPage'
import { FaqPage } from './pages/public/FaqPage'
import { ShippingPolicyPage } from './pages/public/policies/ShippingPolicyPage'
import { ReturnPolicyPage } from './pages/public/policies/ReturnPolicyPage'
import { PrivacyPolicyPage } from './pages/public/policies/PrivacyPolicyPage'

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
        
        {/* Informational Subpages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/policy/shipping" element={<ShippingPolicyPage />} />
        <Route path="/policy/return" element={<ReturnPolicyPage />} />
        <Route path="/policy/privacy" element={<PrivacyPolicyPage />} />
      </Route>

      {/* Admin Routes with AdminLayout */}
      <Route path="/admin" element={<ProtectedAdminRoute />}>
        <Route element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
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
