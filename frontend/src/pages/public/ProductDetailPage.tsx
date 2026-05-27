import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Check, ChevronRight, Loader2, ArrowLeft, Star, ShieldCheck, Plus, Minus, ShoppingBag, CheckCircle, MessageSquare } from 'lucide-react'
import api from '../../api/axiosClient'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { addToCart } from '../../features/cart/cartSlice'
import { toggleWishlistItem } from '../../features/wishlist/wishlistSlice'

export const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { items: wishlistItems } = useAppSelector(state => state.wishlist)
  
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  
  // Reviews state
  const [reviews, setReviews] = useState<any[]>([])
  const [reviewsPage, setReviewsPage] = useState(0)
  const [reviewsTotalPages, setReviewsTotalPages] = useState(0)
  const [ratingInput, setRatingInput] = useState(5)
  const [commentInput, setCommentInput] = useState('')
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

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

    if (slug) {
      fetchProduct()
    }
  }, [slug, location.key])

  useEffect(() => {
    if (product?.id) {
      fetchReviews(product.id, reviewsPage)
    }
  }, [product?.id, reviewsPage])

  const fetchReviews = async (productId: number, pageNum: number) => {
    try {
      const response = await api.get(`/api/reviews/product/${productId}`, {
        params: { page: pageNum, size: 5 }
      })
      setReviews(response.data.content)
      setReviewsTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      showToast("Vui lòng đăng nhập để đánh giá", 'error')
      return
    }
    
    setIsSubmittingReview(true)
    try {
      await api.post('/api/reviews', {
        productId: product.id,
        rating: ratingInput,
        comment: commentInput
      })
      showToast("Đánh giá của bạn đã được gửi thành công!")
      setCommentInput('')
      setRatingInput(5)
      fetchReviews(product.id, 0)
      setReviewsPage(0)
    } catch (error: any) {
      showToast(error.response?.data || "Có lỗi xảy ra khi gửi đánh giá", 'error')
    } finally {
      setIsSubmittingReview(false)
    }
  }

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
      setQuantity(1)
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
                <Star size={14} fill="currentColor" /> {product.averageRating ? product.averageRating.toFixed(1) : '5.0'}
              </span>
              <span>|</span>
              <span>{product.reviewCount || 0} Đánh giá</span>
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
          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              disabled={isAdding || !selectedVariant || selectedVariant.stockQuantity < 1}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-4.5 px-8 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-indigo-600/20"
            >
              {isAdding ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <ShoppingBag size={20} />
              )}
              {selectedVariant && selectedVariant.stockQuantity < 1 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
            </button>
            <button 
              onClick={handleToggleWishlist}
              className="w-16 h-16 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors bg-white dark:bg-slate-900 shadow-sm"
              title="Yêu thích"
            >
              <Heart size={24} className={isLiked ? 'text-rose-500 fill-rose-500' : 'text-gray-400'} />
            </button>
          </div>
          
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

      {/* Reviews Section */}
      <div className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-12">
        <h2 className="text-2xl font-bold font-heading flex items-center gap-2 mb-8 text-slate-900 dark:text-white">
          <MessageSquare size={24} className="text-indigo-600" /> Đánh giá sản phẩm ({product.reviewCount || 0})
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Write a review */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-200">Gửi đánh giá của bạn</h3>
              {isAuthenticated ? (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Đánh giá sao</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingInput(star)}
                          className="focus:outline-none"
                        >
                          <Star 
                            size={24} 
                            className={star <= ratingInput ? "text-amber-500 fill-current" : "text-slate-300 dark:text-slate-700"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Nhận xét chi tiết</label>
                    <textarea 
                      required
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none h-32"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmittingReview ? <Loader2 className="animate-spin" size={18} /> : null}
                    Gửi đánh giá
                  </button>
                </form>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-500 mb-4">Vui lòng đăng nhập để gửi đánh giá</p>
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Đăng nhập
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Review List */}
          <div className="lg:col-span-2">
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg overflow-hidden">
                      {review.userAvatar ? (
                        <img src={review.userAvatar} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        review.userName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">{review.userName}</h4>
                        <span className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < review.rating ? "text-amber-500 fill-current" : "text-slate-200 dark:text-slate-800"} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Pagination */}
                {reviewsTotalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button 
                      onClick={() => setReviewsPage(p => Math.max(0, p - 1))}
                      disabled={reviewsPage === 0}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                    >
                      Trước
                    </button>
                    <span className="px-4 py-2 text-sm text-slate-500">
                      Trang {reviewsPage + 1} / {reviewsTotalPages}
                    </span>
                    <button 
                      onClick={() => setReviewsPage(p => Math.min(reviewsTotalPages - 1, p + 1))}
                      disabled={reviewsPage >= reviewsTotalPages - 1}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <MessageSquare size={40} className="mx-auto text-slate-300 mb-4" />
                <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Chưa có đánh giá nào</h3>
                <p className="text-sm text-slate-500">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
