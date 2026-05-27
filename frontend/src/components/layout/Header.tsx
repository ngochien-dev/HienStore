import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Sun, Moon, LogOut, Package, Shield, Heart } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { logout } from '../../features/auth/authSlice'
import { fetchCart } from '../../features/cart/cartSlice'
import { fetchWishlistIds } from '../../features/wishlist/wishlistSlice'
import { NotificationDropdown } from '../features/user/NotificationDropdown'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { items } = useAppSelector((state) => state.cart)
  const location = useLocation()
  
  const cartItemsCount = items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  const [storeName, setStoreName] = useState('HienStore')

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart())
      dispatch(fetchWishlistIds())
    }
  }, [isAuthenticated, dispatch])

  useEffect(() => {
    import('../../api/axiosClient').then(({ default: api }) => {
      api.get('/api/settings').then(res => {
        if (res.data?.storeName) {
          setStoreName(res.data.storeName)
        }
      }).catch(console.error)
    })
  }, [])

  // Track scroll position to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? 'glass shadow-premium py-2 sm:py-3 border-b border-slate-100/80 dark:border-slate-800/50' 
          : 'bg-transparent py-4 sm:py-6 border-b border-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent tracking-tight font-heading">
            {storeName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 font-medium">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`relative py-1 text-sm tracking-wide transition-all duration-300 font-heading ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                } group`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 h-[2px] bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          {/* Dark Mode Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-300"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} className="animate-fade-in" /> : <Moon size={20} className="animate-fade-in" />}
          </button>
          
          {/* Cart Icon */}
          <Link 
            to="/cart" 
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-300 relative"
          >
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full animate-pulse-slow">
                {cartItemsCount > 9 ? '9+' : cartItemsCount}
              </span>
            )}
          </Link>

          {/* User Profile / Auth Actions */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-1 sm:space-x-3">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 hidden lg:inline max-w-[120px] truncate">
                  Hi, {user?.fullName?.split(' ').pop() || 'User'}
                </span>
                
                {user?.role === 'ADMIN' && (
                  <Link 
                    to="/admin" 
                    className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl flex items-center gap-1.5 transition-all duration-300" 
                    title="Trang quản trị"
                  >
                    <Shield size={20} />
                    <span className="text-xs font-bold hidden xl:inline">Quản Trị</span>
                  </Link>
                )}
                
                <Link 
                  to="/profile" 
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-300" 
                  title="Hồ sơ cá nhân"
                >
                  <User size={20} />
                </Link>

                <Link 
                  to="/wishlist" 
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-300" 
                  title="Sản phẩm yêu thích"
                >
                  <Heart size={20} />
                </Link>
                
                <NotificationDropdown />
                
                <Link 
                  to="/orders" 
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-300" 
                  title="Đơn hàng"
                >
                  <Package size={20} />
                </Link>
                
                <button 
                  onClick={() => dispatch(logout())}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-300"
                  title="Đăng xuất"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-300"
                title="Đăng nhập"
              >
                <User size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng nhập / Đăng ký
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
