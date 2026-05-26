import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axiosClient'
import { useAppDispatch } from '../../app/hooks'
import { addToCart } from '../../features/cart/cartSlice'
import { Loader2, ArrowLeft, Star, ShieldCheck, Truck, Plus, Minus, ShoppingBag, CheckCircle } from 'lucide-react'

export const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/products/${slug}`)
        const data = response.data
        setProduct(data)
        
        // Select first image
        if (data.images && data.images.length > 0) {
          const primaryImage = data.images.find((img: any) => img.isPrimary)
          setSelectedImage(primaryImage ? primaryImage.imageUrl : data.images[0].imageUrl)
        }
        
        // Select first variant
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) fetchProduct()
  }, [slug])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      showToast("Vui lòng đăng nhập để thêm vào giỏ hàng!", 'error')
      setTimeout(() => navigate('/login'), 1500)
      return
    }

    setIsAdding(true)
    try {
      await dispatch(addToCart({ 
        variantId: selectedVariant.id, 
        quantity 
      })).unwrap()
      showToast("Đã thêm vào giỏ hàng thành công!")
    } catch (error) {
      showToast("Lỗi khi thêm vào giỏ hàng", 'error')
    } finally {
      setIsAdding(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold font-heading">Không tìm thấy sản phẩm</h2>
        <button 
          onClick={() => navigate('/products')} 
          className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" /> Quay lại cửa hàng
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 relative">
      
      {/* Custom Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 glass-premium border-l-4 border-l-indigo-500 border-white/20 text-slate-800 dark:text-slate-100 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3.5 animate-fade-in-up">
          {toast.type === 'success' ? (
            <CheckCircle className="text-emerald-500 shrink-0" size={18} />
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
          )}
          <span className="font-semibold text-sm tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* Back Link */}
      <button 
        onClick={() => navigate('/products')} 
        className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-semibold mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Trở lại danh mục sản phẩm
      </button>

      {/* Product Detail Main */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Images */}
        <div className="lg:col-span-6 space-y-5">
          {/* Main Showcase */}
          <div className="aspect-[4/5] bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-sm relative group">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">Không có ảnh</div>
            )}
          </div>
          
          {/* Thumbnails list */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3.5 overflow-x-auto pb-2 scrollbar-thin">
              {product.images.map((img: any) => (
                <button 
                  key={img.id} 
                  onClick={() => setSelectedImage(img.imageUrl)}
                  className={`shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === img.imageUrl 
                      ? 'border-indigo-600 scale-[1.03] shadow-md shadow-indigo-600/10' 
                      : 'border-slate-200/55 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <img src={img.imageUrl} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details Info */}
        <div className="lg:col-span-6 space-y-8">
          
          {/* Title and Ratings */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span className="flex items-center gap-1 text-amber-500">
                <Star size={14} fill="currentColor" /> 4.9
              </span>
              <span>|</span>
              <span>Đã bán: 1.2k</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 px-5 py-4 rounded-2xl inline-block font-heading">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedVariant?.price || product.basePrice)}
          </div>

          {/* Variants selector */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Phân loại (Màu sắc / Kích cỡ)
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {product.variants?.map((variant: any) => (
                <button
                  key={variant.id}
                  onClick={() => {
                    setSelectedVariant(variant)
                    // Auto-adjust quantity if needed
                    if (quantity > variant.stockQuantity) {
                      setQuantity(variant.stockQuantity || 1)
                    }
                  }}
                  className={`px-4.5 py-3 rounded-xl border text-sm font-semibold tracking-wide transition-all duration-300 ${
                    selectedVariant?.id === variant.id 
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 ring-1 ring-indigo-600' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {variant.color} / {variant.size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Actions */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Số lượng mua
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <button 
                  className="w-11 h-11 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus size={14} />
                </button>
                <input 
                  type="text" 
                  className="w-12 text-center bg-transparent border-none text-sm font-bold focus:outline-none focus:ring-0"
                  value={quantity}
                  readOnly
                />
                <button 
                  className="w-11 h-11 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setQuantity(Math.min(selectedVariant?.stockQuantity || 99, quantity + 1))}
                  disabled={selectedVariant && quantity >= selectedVariant.stockQuantity}
                >
                  <Plus size={14} />
                </button>
              </div>
              
              {selectedVariant && (
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {selectedVariant.stockQuantity > 0 
                    ? `Còn lại ${selectedVariant.stockQuantity} sản phẩm trong kho` 
                    : 'Hết hàng'
                  }
                </span>
              )}
            </div>
          </div>

          {/* Main Button */}
          <button 
            onClick={handleAddToCart}
            disabled={isAdding || !selectedVariant || selectedVariant.stockQuantity < 1}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-4.5 px-8 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-indigo-600/20"
          >
            {isAdding ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <ShoppingBag size={20} />
            )}
            Thêm vào giỏ hàng
          </button>
          
          {/* Commitments Banner */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800/80 pt-6">
            <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
              <ShieldCheck className="text-indigo-500" size={18} />
              <span className="text-xs font-semibold">Chính hãng 100%</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
              <Truck className="text-indigo-500" size={18} />
              <span className="text-xs font-semibold">Giao toàn quốc 2-3 ngày</span>
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-800/80 pt-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-heading">
              Mô tả sản phẩm
            </h3>
            <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description || 'Chưa có thông tin mô tả chi tiết cho sản phẩm này.'}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
