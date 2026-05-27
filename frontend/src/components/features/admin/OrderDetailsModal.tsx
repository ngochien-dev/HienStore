import React from 'react'
import { X, Package, CreditCard, Truck, User, Phone, MapPin, Calendar } from 'lucide-react'

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: any
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Chờ xử lý'
      case 'PROCESSING': return 'Đang xử lý'
      case 'SHIPPED': return 'Đang giao hàng'
      case 'DELIVERED': return 'Đã giao hàng'
      case 'CANCELLED': return 'Đã hủy'
      default: return status
    }
  }

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'UNPAID': return 'Chưa thanh toán'
      case 'PAID': return 'Đã thanh toán'
      case 'REFUNDED': return 'Đã hoàn tiền'
      default: return status
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'COD': return 'Thanh toán khi nhận hàng (COD)'
      case 'VNPAY': return 'Thanh toán qua VNPay'
      default: return method
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Package size={22} className="text-indigo-600 dark:text-indigo-400" />
              Chi tiết Đơn hàng #{order.id}
            </h2>
            <div className="text-sm text-gray-500 mt-1 flex items-center gap-4">
              <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(order.createdAt).toLocaleString('vi-VN')}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-900/20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Customer & Delivery Info */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Customer Info */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                  <User size={18} className="text-blue-500" /> Thông tin khách hàng
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-1.5"><User size={14} /> Người nhận:</span>
                    <span className="font-medium">{order.receiverName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-1.5"><Phone size={14} /> Điện thoại:</span>
                    <span className="font-medium">{order.phone}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                  <Truck size={18} className="text-emerald-500" /> Giao hàng
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 flex items-center gap-1.5"><MapPin size={14} /> Địa chỉ giao hàng:</span>
                    <span className="font-medium leading-relaxed pl-5">{order.shippingAddress}</span>
                  </div>
                  {order.note && (
                    <div className="flex flex-col gap-1 pt-2 border-t border-gray-50 dark:border-gray-700">
                      <span className="text-gray-500">Ghi chú:</span>
                      <span className="italic bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-yellow-800 dark:text-yellow-200">{order.note}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment & Status */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                  <CreditCard size={18} className="text-purple-500" /> Thanh toán & Trạng thái
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Trạng thái ĐH:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Thanh toán:</span>
                    <span className={`font-semibold px-2 py-1 rounded ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Phương thức:</span>
                    <span className="font-medium text-right max-w-[150px] truncate" title={getPaymentMethodLabel(order.paymentMethod)}>
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm h-full flex flex-col">
                <h3 className="font-semibold text-gray-900 dark:text-white p-5 border-b border-gray-100 dark:border-gray-700">
                  Sản phẩm đã đặt ({order.items?.length || 0})
                </h3>
                
                <div className="p-5 flex-1 overflow-y-auto">
                  <div className="space-y-4">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex gap-4 p-3 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-800/30">
                        <div className="w-16 h-16 rounded-md bg-gray-200 flex-shrink-0 overflow-hidden border border-gray-200 dark:border-gray-600">
                          {item.productVariant?.imageUrl ? (
                            <img src={item.productVariant.imageUrl} alt={item.productVariant.productName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Package size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">{item.productVariant?.productName}</h4>
                          <div className="text-xs text-gray-500 mt-1 flex gap-2">
                            {item.productVariant?.color && <span>Màu: {item.productVariant.color}</span>}
                            {item.productVariant?.color && item.productVariant?.size && <span>|</span>}
                            {item.productVariant?.size && <span>Size: {item.productVariant.size}</span>}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">SKU: {item.productVariant?.sku}</div>
                        </div>
                        <div className="text-right flex flex-col justify-center">
                          <div className="font-medium text-gray-900 dark:text-white">{formatPrice(item.price)}</div>
                          <div className="text-sm text-gray-500">x {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                    
                    {(!order.items || order.items.length === 0) && (
                      <div className="text-center py-8 text-gray-500">Không có sản phẩm nào.</div>
                    )}
                  </div>
                </div>

                <div className="p-5 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 rounded-b-xl space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Tạm tính:</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{formatPrice(order.totalAmount + (order.discountAmount || 0))}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Giảm giá <span className="font-medium text-emerald-600">({order.couponCode})</span>:</span>
                      <span className="text-red-500 font-medium">- {formatPrice(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Tổng cộng:</span>
                    <span className="text-indigo-600 dark:text-indigo-400 text-2xl">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
