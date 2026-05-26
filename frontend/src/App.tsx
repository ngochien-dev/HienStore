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

// Temp Home Component
const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent mb-6">
      Chào mừng đến với HienStore
    </h1>
    <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl">
      Nền tảng mua sắm thời trang hiện đại. Chúng tôi đang xây dựng những tính năng tuyệt vời nhất cho bạn.
    </p>
  </div>
)

function App() {
  return (
    <Routes>
      {/* Public & Customer Routes with UserLayout */}
      <Route element={<UserLayout><Outlet /></UserLayout>}>
        <Route path="/" element={<Home />} />
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
          {/* Add more admin routes here later */}
        </Route>
      </Route>

      {/* Auth Routes */}
      <Route element={<UserLayout><Outlet /></UserLayout>}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin Routes will go here later */}
    </Routes>
  )
}

export default App
