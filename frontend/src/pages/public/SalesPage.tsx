import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axiosClient'
import { ProductCard } from '../../components/features/products/ProductCard'
import { Loader2, Flame, Gift, ArrowRight } from 'lucide-react'

export const SalesPage = () => {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Fake Countdown Timer state (e.g., 2 days, 4 hours, 12 mins, 50 secs)
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 4,
    minutes: 12,
    seconds: 50
  })

  // Decrement Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        } else {
          clearInterval(timer)
          return prev
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchPromoProducts = async () => {
      setIsLoading(true)
      try {
        // Fetch products, simulate sales
        const response = await api.get('/api/products', {
          params: { page: 0, size: 8 }
        })
        setProducts(response.data.content || [])
      } catch (error) {
        console.error('Failed to fetch sales products:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPromoProducts()
  }, [])

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 space-y-16 animate-fade-in font-sans">
      
      {/* 1. HERO BANNER WITH COUNTDOWN */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white p-8 sm:p-12 md:p-16 shadow-premium border border-white/10">
        
        {/* Glow Spheres */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Banner Text */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              <Flame size={14} className="fill-white" />
              Khuyến mãi giới hạn
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading leading-tight">
              Giảm Giá Mùa Hè <br />
              Lên Đến <span className="text-yellow-300">50% Off</span>
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-lg leading-relaxed mx-auto lg:mx-0">
              Đón hè rực rỡ với ưu đãi cực sâu dành riêng cho các thiết kế Basic Cotton và Blazer thời thượng. Miễn phí giao hàng toàn quốc!
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-white/70">
              Chương trình kết thúc sau
            </span>
            <div className="flex gap-3">
              {[
                { label: 'Ngày', val: timeLeft.days },
                { label: 'Giờ', val: timeLeft.hours },
                { label: 'Phút', val: timeLeft.minutes },
                { label: 'Giây', val: timeLeft.seconds }
              ].map((time, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 flex items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/10 text-xl sm:text-2xl font-bold font-heading">
                    {time.val.toString().padStart(2, '0')}
                  </div>
                  <span className="text-[10px] font-semibold text-white/70 mt-1.5 uppercase">
                    {time.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 2. SPECIAL OFFERS CATEGORY LINKS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Deal 1 */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] group shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-100 dark:border-slate-800">
          <img 
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80" 
            alt="Double Deal" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-transparent" />
          <div className="absolute inset-y-0 left-0 p-8 flex flex-col justify-center space-y-3.5 text-white max-w-sm text-left">
            <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-widest">
              Combo Tiết kiệm
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading">Mua 2 tặng 1</h3>
            <p className="text-white/70 text-xs">Áp dụng cho toàn bộ danh mục áo thun trơn basic cotton.</p>
            <Link to="/products?category=T-Shirt" className="inline-flex items-center gap-1 text-xs font-semibold hover:text-yellow-300 transition-colors pt-1">
              Mua ngay <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Deal 2 */}
        <div className="relative rounded-2xl overflow-hidden aspect-[16/9] group shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-100 dark:border-slate-800">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80" 
            alt="Coupon Offer" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/20 to-transparent" />
          <div className="absolute inset-y-0 left-0 p-8 flex flex-col justify-center space-y-3.5 text-white max-w-sm text-left">
            <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-widest">
              Khách hàng mới
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading">Nhập mã HIEN50K</h3>
            <p className="text-white/70 text-xs">Giảm ngay 50k cho đơn hàng đầu tiên từ 350k trở lên.</p>
            <Link to="/products" className="inline-flex items-center gap-1 text-xs font-semibold hover:text-yellow-300 transition-colors pt-1">
              Khám phá <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </section>

      {/* 3. DYNAMIC SALE PRODUCTS GRID */}
      <section className="space-y-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-500">
            <Gift size={18} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
            Sản phẩm giá ưu đãi
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative">
                {/* Special Sale Tag overlying the Card */}
                <div className="absolute top-3.5 right-3.5 z-20 px-3 py-1 rounded-full bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  SALE -20%
                </div>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500">
            Hiện tại chưa có sản phẩm khuyến mãi nào khả dụng.
          </div>
        )}
      </section>

    </div>
  )
}
