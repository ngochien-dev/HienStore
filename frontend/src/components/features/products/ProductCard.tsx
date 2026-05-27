import { Link, useNavigate } from 'react-router-dom'
import { Eye, ShoppingBag, Heart } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { toggleWishlistItem } from '../../../features/wishlist/wishlistSlice'

export interface ProductCardProps {
  product: {
    id: number
    name: string
    slug: string
    basePrice: number
    images?: { imageUrl: string; isPrimary: boolean }[]
    category?: { name: string }
  }
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { items: wishlistItems } = useAppSelector(state => state.wishlist)
  const { isAuthenticated } = useAppSelector(state => state.auth)
  
  const isLiked = wishlistItems.includes(product.id)

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    dispatch(toggleWishlistItem(product.id))
  }

  const primaryImage = product.images?.find(img => img.isPrimary)?.imageUrl 
    || product.images?.[0]?.imageUrl 
    || 'https://placehold.co/400x500/f3f4f6/9ca3af?text=No+Image'

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(product.basePrice)

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-premium hover:-translate-y-1.5 transition-all duration-500">
      
      {/* Image Section */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 dark:bg-slate-950">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img 
            src={primaryImage} 
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <Link 
            to={`/product/${product.slug}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-full font-semibold text-xs shadow-lg hover:bg-slate-900 hover:text-white transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            <Eye size={14} />
            Xem chi tiết
          </Link>
          <button 
            onClick={handleToggleWishlist}
            className="flex items-center justify-center w-10 h-10 bg-white text-rose-500 rounded-full shadow-lg hover:bg-slate-900 hover:text-rose-400 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
          >
            <Heart size={16} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
          </button>
        </div>

        {/* Category Tag */}
        {product.category?.name && (
          <span className="absolute top-3.5 left-3.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 rounded-full backdrop-blur-md shadow-sm border border-white/20">
            {product.category.name}
          </span>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4.5 flex flex-col flex-grow">
        {/* Name */}
        <Link to={`/product/${product.slug}`} className="mb-2">
          <h3 className="text-slate-800 dark:text-slate-100 font-semibold text-[15px] leading-snug line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        
        {/* Bottom Price & Button */}
        <div className="mt-auto pt-3.5 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Giá bán
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-slate-50">
              {formattedPrice}
            </span>
          </div>
          
          <Link
            to={`/product/${product.slug}`}
            className="flex items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white hover:scale-105 active:scale-95 transition-all duration-300"
            aria-label="Xem sản phẩm"
          >
            <ShoppingBag size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
