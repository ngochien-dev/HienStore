import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Sun, Moon, LogOut, Package } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { logout } from '../../features/auth/authSlice'
import { fetchCart } from '../../features/cart/cartSlice'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { items } = useAppSelector((state) => state.cart)
  
  const cartItemsCount = items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart())
    }
  }, [isAuthenticated, dispatch])

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setIsDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Sản phẩm', path: '/products' },
    { name: 'Khuyến mãi', path: '/sales' },
    { name: 'Giới thiệu', path: '/about' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 glass border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="container mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 -ml-2 text-gray-500 hover:text-indigo-600 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            HienStore
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 font-medium">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className="text-[var(--color-text-secondary)] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-[var(--color-text-secondary)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <Link to="/cart" className="p-2 text-[var(--color-text-secondary)] hover:text-indigo-600 transition-colors relative">
            <ShoppingCart size={24} />
            {cartItemsCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {cartItemsCount > 9 ? '9+' : cartItemsCount}
              </span>
            )}
          </Link>

          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Hi, {user?.fullName || 'User'}</span>
                
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="p-2 text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center gap-2" title="Admin Portal">
                    <span className="text-sm font-semibold hidden sm:inline">Trang Quản Trị</span>
                  </Link>
                )}
                <Link to="/orders" className="p-2 text-[var(--color-text-secondary)] hover:text-indigo-600 transition-colors" title="Đơn hàng của tôi">
                  <Package size={20} />
                </Link>
                <button 
                  onClick={() => dispatch(logout())}
                  className="p-2 text-[var(--color-text-secondary)] hover:text-red-500 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 text-[var(--color-text-secondary)] hover:text-indigo-600 transition-colors">
                <User size={24} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-[var(--color-bg)]">
          <div className="px-4 py-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-[var(--color-text)] hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-[var(--color-text)] hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(false)}
            >
              Đăng nhập / Đăng ký
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
