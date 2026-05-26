import { Link } from 'react-router-dom'
import { ArrowRight, Star, TrendingUp, ShieldCheck, Truck } from 'lucide-react'

export const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 pt-16 pb-32">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Định hình Phong cách <br className="hidden md:block" />
              <span className="text-gradient">Tương lai của bạn</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto animate-delay-100">
              Khám phá bộ sưu tập thời trang cao cấp với thiết kế tối giản, tinh tế. HienStore mang đến trải nghiệm mua sắm đẳng cấp và khác biệt.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-delay-200">
              <Link 
                to="/products" 
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-all hover-card flex items-center gap-2 w-full sm:w-auto justify-center shadow-lg shadow-indigo-600/30"
              >
                Khám phá ngay <ArrowRight size={20} />
              </Link>
              <Link 
                to="/products?category=new" 
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 font-medium rounded-full transition-all w-full sm:w-auto text-center shadow-sm"
              >
                Bộ sưu tập mới
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800 relative z-20 -mt-10 mx-4 md:mx-auto max-w-6xl rounded-3xl glass shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
          <div className="flex flex-col items-center text-center p-6 hover-card">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 transform -rotate-6">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Xu hướng mới nhất</h3>
            <p className="text-gray-500 dark:text-gray-400">Luôn cập nhật những mẫu thiết kế thời thượng nhất từ các sàn diễn thời trang quốc tế.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 hover-card">
            <div className="w-16 h-16 bg-cyan-50 dark:bg-cyan-900/30 rounded-2xl flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6 transform rotate-3">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Chất lượng cao cấp</h3>
            <p className="text-gray-500 dark:text-gray-400">Mỗi sản phẩm đều được kiểm định khắt khe, chất liệu vải thượng hạng bền bỉ theo thời gian.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 hover-card">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 transform -rotate-3">
              <Truck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3">Giao hàng hỏa tốc</h3>
            <p className="text-gray-500 dark:text-gray-400">Miễn phí giao hàng cho đơn từ 500k. Nhận hàng ngay trong 2 giờ đối với nội thành.</p>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Danh mục Nổi bật</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Áo T-Shirt', 'Quần Jeans', 'Áo Khoác', 'Phụ kiện'].map((category, index) => (
              <Link 
                key={category} 
                to={`/products?category=${category}`}
                className="group block relative overflow-hidden rounded-2xl aspect-[4/5] hover-card"
              >
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800">
                  <img 
                    src={`https://placehold.co/400x500/334155/ffffff?text=${category}`} 
                    alt={category}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-2xl font-bold text-white mb-2 transform transition-transform group-hover:-translate-y-2">{category}</h3>
                  <div className="flex items-center text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:-translate-y-2">
                    <span>Xem thêm</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-gray-800">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-16">Khách hàng nói gì về chúng tôi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 relative">
                  <div className="flex justify-center mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic mb-6">
                    "Chất liệu vải cực kỳ tốt, form áo chuẩn như hình. Giao hàng rất nhanh chóng và đóng gói cẩn thận. Chắc chắn sẽ ủng hộ HienStore lâu dài!"
                  </p>
                  <div className="font-medium text-gray-900 dark:text-white">- Khách hàng {i}</div>
                </div>
              ))}
            </div>
         </div>
      </section>
    </div>
  )
}
