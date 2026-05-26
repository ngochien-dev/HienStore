import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, TrendingUp, ShieldCheck, Truck, Loader2 } from 'lucide-react'
import api from '../../api/axiosClient'
import { ProductCard } from '../../components/features/products/ProductCard'
import { Button } from '../../components/ui/Button'

export const HomePage = () => {
  const [latestProducts, setLatestProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await api.get('/api/products', {
          params: { page: 0, size: 4 }
        })
        setLatestProducts(response.data.content || [])
      } catch (error) {
        console.error('Failed to fetch latest products on home page:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLatestProducts()
  }, [])

  const categories = [
    {
      name: 'Áo T-Shirt',
      query: 'T-Shirt',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&h=750&q=80',
      description: 'Cơ bản & Tinh tế'
    },
    {
      name: 'Quần Jeans',
      query: 'Jeans',
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&h=750&q=80',
      description: 'Bền bỉ & Phong cách'
    },
    {
      name: 'Áo Khoác',
      query: 'Khoác',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&h=750&q=80',
      description: 'Cá tính & Ấm áp'
    },
    {
      name: 'Phụ kiện',
      query: 'Phụ kiện',
      image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=600&h=750&q=80',
      description: 'Điểm nhấn Hoàn hảo'
    }
  ]

  return (
    <div className="w-full space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-36 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        
        {/* Glow Spheres */}
        <div className="absolute top-0 right-10 -mr-24 -mt-24 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 -ml-24 -mb-24 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-8 animate-fade-in-up">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Star size={12} className="fill-indigo-600 dark:fill-indigo-400" />
                Bộ Sưu Tập Mùa Hè 2026
              </span>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] font-heading">
                Định hình <span className="text-gradient-primary">Phong cách</span> <br />
                Tương lai của bạn
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0">
                Khám phá tủ đồ tối giản nhưng đẳng cấp. HienStore kết hợp hài hòa chất liệu tự nhiên thượng hạng với phom dáng may đo tinh xảo bậc nhất.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button 
                  variant="gradient"
                  size="lg"
                  rounded="full"
                  className="w-full sm:w-auto hover-scale group"
                >
                  <Link to="/products" className="flex items-center justify-center gap-2 w-full">
                    Khám phá ngay 
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  rounded="full"
                  className="w-full sm:w-auto"
                >
                  <Link to="/products" className="w-full block">
                    Bộ sưu tập mới
                  </Link>
                </Button>
              </div>
            </div>

            {/* Hero Image Poster */}
            <div className="lg:col-span-5 relative flex justify-center animate-fade-in animate-delay-200">
              <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-premium group border-4 border-white dark:border-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80" 
                  alt="High Fashion Editorial" 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 glass-premium rounded-2xl border border-white/20">
                  <p className="text-white text-xs font-semibold uppercase tracking-widest mb-1">Thiết kế tối giản</p>
                  <p className="text-white/80 text-[11px]">Chất liệu 100% Cotton hữu cơ siêu mềm mát.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS (FEATURES) */}
      <section className="container mx-auto px-4 sm:px-6 relative -mt-16 z-20">
        <div className="glass-premium rounded-3xl p-8 sm:p-10 shadow-premium border border-slate-100 dark:border-slate-800/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x md:divide-slate-100 dark:md:divide-slate-800/60">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center px-4 space-y-4">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-bold font-heading">Xu hướng dẫn đầu</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Cập nhật liên tục những phom dáng hiện đại, thời thượng nhất từ các kinh đô thời trang toàn cầu.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center px-4 space-y-4 md:pl-8">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold font-heading">Chất lượng cao cấp</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Lựa chọn sợi cotton, sợi len tự nhiên cao cấp, tỉ mỉ từng đường kim mũi chỉ đạt chuẩn xuất khẩu.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center px-4 space-y-4 md:pl-8">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Truck size={24} />
              </div>
              <h3 className="text-lg font-bold font-heading">Giao hàng toàn quốc</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Vận chuyển chuyên nghiệp, đóng gói sang trọng. Miễn phí cho đơn hàng từ 500k cùng hỗ trợ đổi size 24h.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. DYNAMIC PRODUCTS GRID (LATEST PRODUCTS) */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Hàng mới về
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
              Sản phẩm nổi bật
            </h2>
          </div>
          <Link 
            to="/products" 
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
          >
            Xem tất cả
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
          </div>
        ) : latestProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500">
            Chưa có sản phẩm nổi bật nào được đăng bán.
          </div>
        )}
      </section>

      {/* 4. EDITORIAL CATEGORIES */}
      <section className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Tìm kiếm theo sở thích
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
            Danh mục nổi bật
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to={`/products?category=${cat.name}`}
              className="group block relative overflow-hidden rounded-2xl aspect-[4/5] shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="absolute inset-0 bg-slate-900">
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              {/* Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent transition-opacity duration-300" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 p-6 w-full text-left space-y-1.5">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                  {cat.description}
                </span>
                <h3 className="text-2xl font-bold text-white font-heading tracking-tight">
                  {cat.name}
                </h3>
                <div className="flex items-center text-white/80 text-xs font-medium pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span>Khám phá ngay</span>
                  <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20 border-y border-slate-100 dark:border-slate-800/40">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Trải nghiệm thực tế
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-heading">
              Khách hàng chia sẻ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Hoàng Anh',
                role: 'Khách hàng thân thiết',
                text: 'Chất liệu vải cotton của HienStore cực kỳ mềm mát, giặt máy nhiều lần vẫn giữ nguyên form dáng và không xù lông. Cực kỳ ưng ý!'
              },
              {
                name: 'Minh Thư',
                role: 'Người mua sắm online',
                text: 'Đóng gói sản phẩm cực kỳ xịn sò như các hãng quốc tế. Giao hàng hỏa tốc trong 2 giờ nội thành giúp mình kịp chuẩn bị đồ đi tiệc.'
              },
              {
                name: 'Tuấn Kiệt',
                role: 'Người đam mê thời trang',
                text: 'Giao diện web mới cực đẹp, thao tác thanh toán rất mượt mà qua VNPay. Nhân viên hỗ trợ tư vấn đổi size áo khoác rất nhiệt tình.'
              }
            ].map((customer, idx) => (
              <div 
                key={idx} 
                className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-premium transition-all duration-300 text-left space-y-5"
              >
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                  "{customer.text}"
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                    {customer.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">{customer.name}</div>
                    <div className="text-xs text-slate-400">{customer.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
