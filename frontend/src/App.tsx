import { Routes, Route, Outlet } from 'react-router-dom'
import { UserLayout } from './components/layout/UserLayout'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { ProductsPage } from './pages/public/ProductsPage'
import { CartPage } from './pages/private/CartPage'

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
      {/* Public Routes with UserLayout */}
      <Route element={<UserLayout><Outlet /></UserLayout>}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        {/* We will add more routes here like /product/:slug */}
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
