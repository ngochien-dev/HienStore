import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ShieldCheck } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-20 pb-10 font-sans">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Intro */}
          <div className="space-y-5">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight font-heading">
              HienStore
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Thời trang nam nữ cao cấp, chính hãng. Tự tin thể hiện phong cách cá nhân với các thiết kế tinh tế và độc quyền từ HienStore.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white text-slate-400 transition-all duration-300 shadow-sm" aria-label="Facebook">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-pink-600 hover:text-white text-slate-400 transition-all duration-300 shadow-sm" aria-label="Instagram">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-sky-500 hover:text-white text-slate-400 transition-all duration-300 shadow-sm" aria-label="Twitter">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-6 font-heading">Liên kết nhanh</h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/about" className="inline-block text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all duration-300">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/products" className="inline-block text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all duration-300">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/sales" className="inline-block text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all duration-300">
                  Bộ sưu tập khuyến mãi
                </Link>
              </li>
              <li>
                <Link to="/blog" className="inline-block text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all duration-300">
                  Tin tức thời trang
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-6 font-heading">Chăm sóc khách hàng</h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link to="/faq" className="inline-block text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all duration-300">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/policy/shipping" className="inline-block text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all duration-300">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link to="/policy/return" className="inline-block text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all duration-300">
                  Chính sách đổi trả 24h
                </Link>
              </li>
              <li>
                <Link to="/policy/privacy" className="inline-block text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all duration-300">
                  Chính sách bảo mật thông tin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-widest mb-6 font-heading">Thông tin liên hệ</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                <span>12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-indigo-500 shrink-0" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-indigo-500 shrink-0" />
                <span>support@hienstore.com</span>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Footer Bottom */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} HienStore. Crafted with precision and style. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 border border-slate-900 px-3.5 py-1.5 rounded-xl">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Giao dịch an toàn & bảo mật qua VNPay</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
