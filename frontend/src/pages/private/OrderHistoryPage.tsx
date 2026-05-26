import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchOrders } from '../../features/order/orderSlice'
import { Loader2, Package, Calendar, MapPin, Phone } from 'lucide-react'

export const OrderHistoryPage = () => {
  const dispatch = useAppDispatch()
  const { orders, isLoading, pageInfo } = useAppSelector((state) => state.order)

  useEffect(() => {
    dispatch(fetchOrders({ page: 0, size: 20 }))
  }, [dispatch])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200'
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xác nhận'
      case 'PROCESSING': return 'Đang xử lý'
      case 'SHIPPED': return 'Đang giao'
      case 'DELIVERED': return 'Đã giao'
      case 'CANCELLED': return 'Đã hủy'
      default: return status
    }
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Package className="text-indigo-600 w-8 h-8" />
        Đơn hàng của tôi
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <p className="text-xl text-gray-500 mb-4">Bạn chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50 dark:bg-gray-800/50">
                <div>
                  <div className="font-bold text-lg">Đơn hàng #{order.id}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Calendar size={14} />
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <div className="text-sm font-medium">
                    Tổng tiền: <span className="text-indigo-600 text-lg">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Sản phẩm</h3>
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden shrink-0">
                        <img src={item.productVariant?.imageUrl || 'https://placehold.co/150'} alt="product" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-1">{item.productVariant?.product?.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">Phân loại: {item.productVariant?.color} - {item.productVariant?.size}</p>
                        <p className="text-sm mt-1">x{item.quantity}</p>
                      </div>
                      <div className="font-medium text-sm">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 md:pl-6 pt-4 md:pt-0">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">Thông tin giao hàng</h3>
                  <div className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{order.receiverName}</p>
                    <p className="flex items-start gap-2"><Phone size={16} className="mt-0.5 shrink-0" /> {order.phone}</p>
                    <p className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> {order.shippingAddress}</p>
                    {order.note && (
                      <p className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded text-xs border border-yellow-100 dark:border-yellow-800/50">
                        Ghi chú: {order.note}
                      </p>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Thanh toán</h3>
                    <p className="text-sm">{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Thanh toán qua VNPay'}</p>
                    <p className={`text-sm font-medium mt-1 ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
