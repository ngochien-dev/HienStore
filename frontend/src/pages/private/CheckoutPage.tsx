import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { createOrder } from '../../features/order/orderSlice'
import { fetchCart } from '../../features/cart/cartSlice'
import { Loader2, ArrowLeft, CreditCard, Truck, Ticket, Check, X } from 'lucide-react'
import api from '../../api/axiosClient'

export const CheckoutPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { items, totalAmount } = useAppSelector((state) => state.cart)
  const { user } = useAppSelector((state) => state.auth)
  const { isLoading, error, currentOrder } = useAppSelector((state) => state.order)

  const [formData, setFormData] = useState({
    receiverName: user?.fullName || '',
    phone: '',
    shippingAddress: '',
    note: '',
    paymentMethod: 'COD',
    couponCode: ''
  })
  
  const [couponCodeInput, setCouponCodeInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const [activeCoupons, setActiveCoupons] = useState<any[]>([])

  useEffect(() => {
    dispatch(fetchCart())
    
    // Fetch active coupons
    api.get('/api/coupons/active')
      .then(res => setActiveCoupons(res.data || []))
      .catch(console.error)
  }, [dispatch])

  // If order is created successfully
  useEffect(() => {
    if (currentOrder) {
      if (currentOrder.paymentMethod === 'VNPAY') {
        // Fetch VNPay URL
        api.get(`/api/payment/create-url?orderId=${currentOrder.id}`)
          .then(res => {
            if (res.data && res.data.url) {
              window.location.href = res.data.url
            } else {
              navigate('/payment-return?status=success&orderId=' + currentOrder.id)
            }
          })
          .catch(err => {
            console.error('Lỗi khi lấy link thanh toán:', err)
            navigate('/payment-return?status=success&orderId=' + currentOrder.id)
          })
      } else {
        navigate('/payment-return?status=success&orderId=' + currentOrder.id)
      }
      // Re-fetch cart (which will be empty now)
      dispatch(fetchCart())
    }
  }, [currentOrder, navigate, dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return
    setIsApplyingCoupon(true)
    setCouponError('')
    
    try {
      const response = await api.get('/api/coupons/validate', {
        params: {
          code: couponCodeInput.trim(),
          orderValue: totalAmount
        }
      })
      
      setAppliedCoupon(response.data)
      setFormData(prev => ({ ...prev, couponCode: response.data.code }))
      setCouponCodeInput('')
    } catch (error: any) {
      let errorMsg = 'Mã giảm giá không hợp lệ'
      const data = error.response?.data
      if (typeof data === 'string') {
        errorMsg = data
      } else if (data && typeof data === 'object' && data.message) {
        errorMsg = data.message
      }
      setCouponError(errorMsg)
      setAppliedCoupon(null)
      setFormData(prev => ({ ...prev, couponCode: '' }))
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setFormData(prev => ({ ...prev, couponCode: '' }))
  }

  const getDiscountAmount = () => {
    if (!appliedCoupon) return 0
    let discount = 0
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discount = totalAmount * (appliedCoupon.discountValue / 100)
      if (appliedCoupon.maxDiscountAmount && discount > appliedCoupon.maxDiscountAmount) {
        discount = appliedCoupon.maxDiscountAmount
      }
    } else {
      discount = appliedCoupon.discountValue
    }
    return Math.min(discount, totalAmount) // Cannot discount more than total
  }

  const discountAmount = getDiscountAmount()
  const finalTotalAmount = Math.max(0, totalAmount - discountAmount)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.receiverName || !formData.phone || !formData.shippingAddress) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng")
      return
    }
    dispatch(createOrder(formData))
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-500 mb-8">Bạn cần có sản phẩm trong giỏ hàng để tiến hành thanh toán.</p>
        <button 
          onClick={() => navigate('/products')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate('/cart')} className="text-gray-500 hover:text-indigo-600 flex items-center mb-6">
        <ArrowLeft size={16} className="mr-2" /> Quay lại giỏ hàng
      </button>

      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Col - Form */}
        <div className="w-full lg:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Delivery Info */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Truck className="text-indigo-600" />
                Thông tin giao hàng
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ và tên người nhận *</label>
                  <input 
                    type="text" 
                    name="receiverName"
                    value={formData.receiverName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Số điện thoại *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Địa chỉ giao hàng chi tiết *</label>
                <input 
                  type="text" 
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ghi chú cho đơn hàng</label>
                <textarea 
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="text-indigo-600" />
                Phương thức thanh toán
              </h2>
              
              <div className="space-y-4">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'COD' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="COD" 
                    checked={formData.paymentMethod === 'COD'}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <div className="ml-4">
                    <span className="block font-medium">Thanh toán khi nhận hàng (COD)</span>
                    <span className="block text-sm text-gray-500">Thanh toán bằng tiền mặt khi giao hàng</span>
                  </div>
                </label>

                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'VNPAY' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="VNPAY" 
                    checked={formData.paymentMethod === 'VNPAY'}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <div className="ml-4">
                    <span className="block font-medium">Thanh toán qua VNPay</span>
                    <span className="block text-sm text-gray-500">Quét mã QR qua ứng dụng ngân hàng, thẻ ATM/Visa</span>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800 rounded-lg">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
              {formData.paymentMethod === 'VNPAY' ? 'Tiếp tục đến trang thanh toán' : 'Xác nhận đặt hàng'}
            </button>
          </form>
        </div>

        {/* Right Col - Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Đơn hàng của bạn ({items.length} SP)</h2>
            
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0">
                    <img src={item.productVariant?.imageUrl || 'https://placehold.co/150'} alt="product" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <h3 className="font-medium line-clamp-2">{item.productVariant?.productName || item.productVariant?.sku}</h3>
                    <p className="text-gray-500">{item.productVariant?.color} - {item.productVariant?.size}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.productVariant?.price || 0)}</span>
                      <span className="text-gray-500">x{item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t dark:border-gray-700 pt-4 space-y-3">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tạm tính:</span>
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Phí giao hàng:</span>
                <span>Miễn phí</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Giảm giá ({appliedCoupon.code}):</span>
                  <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold pt-3 border-t dark:border-gray-700">
                <span>Tổng cộng:</span>
                <span className="text-indigo-600 dark:text-indigo-400">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotalAmount)}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t dark:border-gray-700">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                <Ticket size={18} className="text-indigo-600" />
                Mã giảm giá
              </h3>
              
              {!appliedCoupon ? (
                <div>
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      placeholder="Nhập mã giảm giá..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent uppercase"
                    />
                    <button 
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCodeInput.trim()}
                      className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                      {isApplyingCoupon ? <Loader2 size={18} className="animate-spin" /> : 'Áp dụng'}
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><X size={14} /> {couponError}</p>}
                  
                  {activeCoupons.length > 0 && (
                    <div className="mt-4 border-t dark:border-gray-700 pt-3">
                      <p className="text-sm font-medium text-gray-500 mb-2">Mã giảm giá có sẵn:</p>
                      <div className="flex flex-col gap-2">
                        {activeCoupons.map(coupon => {
                          const isEligible = totalAmount >= coupon.minOrderValue
                          return (
                            <button
                              key={coupon.id}
                              type="button"
                              onClick={() => {
                                if (isEligible) {
                                  setCouponCodeInput(coupon.code)
                                }
                              }}
                              className={`text-left p-3 border rounded-xl transition-all duration-300 relative overflow-hidden ${
                                isEligible 
                                  ? 'border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 cursor-pointer'
                                  : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 opacity-60 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-indigo-700 dark:text-indigo-400">{coupon.code}</span>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                  Giảm {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.discountValue)}
                                </span>
                              </div>
                              {coupon.minOrderValue > 0 && (
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                  Đơn tối thiểu: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.minOrderValue)}
                                </p>
                              )}
                              {!isEligible && (
                                <p className="text-[10px] text-red-500 font-medium mt-1">
                                  Chưa đạt giá trị đơn hàng tối thiểu
                                </p>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                    <Check size={18} />
                    <span className="font-semibold">{appliedCoupon.code}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Bỏ mã
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
