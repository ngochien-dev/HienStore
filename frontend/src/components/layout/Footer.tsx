import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand & Intro */}
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent mb-4">
              HienStore
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thời trang nam nữ cao cấp, chính hãng. Tự tin thể hiện phong cách của bạn với những bộ sưu tập mới nhất từ HienStore.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Về chúng tôi</Link></li>
              <li><Link to="/products" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Sản phẩm</Link></li>
              <li><Link to="/sales" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Khuyến mãi</Link></li>
              <li><Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Tin tức thời trang</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Chăm sóc khách hàng</h4>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Câu hỏi thường gặp</Link></li>
              <li><Link to="/policy/shipping" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Chính sách giao hàng</Link></li>
              <li><Link to="/policy/return" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Chính sách đổi trả</Link></li>
              <li><Link to="/policy/privacy" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Liên hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-indigo-600 mr-3 shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP.HCM</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-indigo-600 mr-3 shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">0123 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-indigo-600 mr-3 shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">support@hienstore.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} HienStore. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            {/* Payment methods icons could go here */}
            <span className="text-sm font-semibold text-gray-400">VNPay Supported</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
