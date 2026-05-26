import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'

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
  const primaryImage = product.images?.find(img => img.isPrimary)?.imageUrl 
    || product.images?.[0]?.imageUrl 
    || 'https://via.placeholder.com/400x500?text=No+Image'

  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(product.basePrice)

  return (
    <div className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <Link to={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img 
          src={primaryImage} 
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">
          {product.category?.name || 'Category'}
        </div>
        
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-gray-900 dark:text-white font-semibold line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formattedPrice}
          </span>
          
          <button 
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
