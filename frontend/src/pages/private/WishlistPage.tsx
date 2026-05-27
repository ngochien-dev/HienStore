import { useState, useEffect } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import api from '../../api/axiosClient'
import { ProductCard } from '../../components/features/products/ProductCard'

export const WishlistPage = () => {
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    setIsLoading(true)
    try {
      const res = await api.get('/api/wishlist')
      setProducts(res.data.content)
    } catch (error) {
      console.error('Failed to fetch wishlist', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleWishlist = async (productId: number) => {
    try {
      await api.post(`/api/wishlist/${productId}/toggle`)
      // Refresh list
      fetchWishlist()
    } catch (error) {
      console.error('Failed to toggle wishlist', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Heart className="text-rose-500 w-8 h-8 fill-rose-500" />
        Sản phẩm yêu thích
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Danh sách yêu thích trống</h3>
          <p className="text-gray-500 dark:text-gray-400">Bạn chưa lưu sản phẩm nào vào danh sách yêu thích.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="relative">
              <button 
                onClick={() => handleToggleWishlist(product.id)}
                className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-rose-50 transition-colors"
                title="Bỏ yêu thích"
              >
                <Heart size={18} className="text-rose-500 fill-rose-500" />
              </button>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
