import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchCart, updateQuantity, removeItem } from '../../features/cart/cartSlice'
import { Button } from '../../components/ui/Button'

export const CartPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const { items, totalAmount, isLoading } = useAppSelector((state) => state.cart)
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    } else {
      dispatch(fetchCart())
    }
  }, [isAuthenticated, dispatch, navigate])

  const handleUpdateQuantity = (itemId: number, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change
    if (newQuantity > 0) {
      dispatch(updateQuantity({ itemId, quantity: newQuantity }))
    }
  }

  const handleRemoveItem = (itemId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      dispatch(removeItem(itemId))
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  if (isLoading && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

      {items.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-50 dark:bg-gray-700 p-6 rounded-full">
              <ShoppingBag size={48} className="text-indigo-300 dark:text-gray-400" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy quay lại trang sản phẩm để chọn mua những món đồ ưng ý nhé!
          </p>
          <Link to="/products">
            <Button size="lg" className="px-8">
              Tiếp tục mua sắm
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {items.map((item) => (
                  <li key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                    <div className="shrink-0 w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                      <img 
                        src={item.productVariant?.imageUrl || 'https://placehold.co/150'} 
                        alt="Product" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {item.productVariant?.productName || item.productVariant?.sku}
                          </h3>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <span>Màu: {item.productVariant?.color}</span>
                            <span className="mx-2">|</span>
                            <span>Size: {item.productVariant?.size}</span>
                          </div>
                          <div className="font-medium text-indigo-600 dark:text-indigo-400">
                            {formatPrice(item.productVariant?.salePrice || item.productVariant?.price)}
                            {item.productVariant?.salePrice && (
                              <span className="text-xs text-gray-400 line-through ml-2 font-normal">
                                {formatPrice(item.productVariant?.price)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-md">
                          <button 
                            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors rounded-l-md"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-medium text-sm">
                            {item.quantity}
                          </span>
                          <button 
                            className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors rounded-r-md"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <div className="font-bold text-gray-900 dark:text-white">
                          {formatPrice(item.subTotal)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Tổng quan đơn hàng
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tạm tính</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Khuyến mãi</span>
                  <span className="text-sm italic text-indigo-500">Nhập ở bước thanh toán</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Phí vận chuyển</span>
                  <span>Tính khi thanh toán</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                  <span>Tổng tiền</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{formatPrice(totalAmount)}</span>
                </div>
              </div>
              
              <Link to="/checkout" className="block">
                <Button fullWidth size="lg" className="flex items-center justify-center gap-2">
                  Tiến hành thanh toán
                  <ArrowRight size={18} />
                </Button>
              </Link>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Chúng tôi chấp nhận thanh toán qua VNPay, Momo và thẻ tín dụng.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
