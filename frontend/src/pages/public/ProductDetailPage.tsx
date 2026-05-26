import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axiosClient'
import { useAppDispatch } from '../../app/hooks'
import { addToCart } from '../../features/cart/cartSlice'
import { Loader2, ShoppingCart, ArrowLeft, Star, ShieldCheck, Truck } from 'lucide-react'

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

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!")
      navigate('/login')
      return
    }

    setIsAdding(true)
    try {
      await dispatch(addToCart({ 
        variantId: selectedVariant.id, 
        quantity 
      })).unwrap()
      alert("Đã thêm vào giỏ hàng thành công!")
    } catch (error) {
      alert("Lỗi khi thêm vào giỏ hàng")
    } finally {
      setIsAdding(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h2>
        <button onClick={() => navigate('/products')} className="text-indigo-600 hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-2" /> Quay lại danh sách
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate('/products')} className="text-gray-500 hover:text-indigo-600 flex items-center mb-6 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Trở lại danh mục
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Images Section */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            {selectedImage ? (
              <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">Không có ảnh</div>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {product.images?.map((img: any) => (
              <button 
                key={img.id} 
                onClick={() => setSelectedImage(img.imageUrl)}
                className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img.imageUrl ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-transparent hover:border-gray-300'}`}
              >
                <img src={img.imageUrl} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
            <span className="flex items-center text-yellow-500"><Star size={16} fill="currentColor" className="mr-1" /> 4.9</span>
            <span>|</span>
            <span>Đã bán: 1.2k</span>
          </div>
          
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedVariant?.price || product.basePrice)}
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-3">Phân loại (Màu sắc / Kích cỡ):</h3>
            <div className="flex flex-wrap gap-3">
              {product.variants?.map((variant: any) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-4 py-2 border rounded-xl font-medium transition-all ${selectedVariant?.id === variant.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                >
                  {variant.color} - {variant.size}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="font-medium mb-3">Số lượng:</h3>
            <div className="flex items-center w-32 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <button 
                className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-l-lg transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <input 
                type="text" 
                className="w-full h-10 text-center bg-transparent border-none focus:ring-0 font-medium"
                value={quantity}
                readOnly
              />
              <button 
                className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-lg transition-colors"
                onClick={() => setQuantity(Math.min(selectedVariant?.stockQuantity || 1, quantity + 1))}
              >
                +
              </button>
            </div>
            {selectedVariant && (
              <p className="text-sm text-gray-500 mt-2">
                Còn lại {selectedVariant.stockQuantity} sản phẩm
              </p>
            )}
          </div>

          <button 
            onClick={handleAddToCart}
            disabled={isAdding || !selectedVariant || selectedVariant.stockQuantity < 1}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-600/30"
          >
            {isAdding ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
            Thêm vào giỏ hàng
          </button>
          
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-800 pt-6">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <ShieldCheck className="text-indigo-500" />
              <span className="text-sm">Cam kết chính hãng 100%</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Truck className="text-indigo-500" />
              <span className="text-sm">Giao hàng toàn quốc</span>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="font-bold text-lg mb-4">Mô tả sản phẩm</h3>
            <div className="prose dark:prose-invert text-gray-600 dark:text-gray-300">
              {product.description}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
