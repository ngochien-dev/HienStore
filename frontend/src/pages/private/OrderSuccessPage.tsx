import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../api/axiosClient'
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { useAppDispatch } from '../../app/hooks'
import { clearCurrentOrder } from '../../features/order/orderSlice'

export const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const [status, setStatus] = useState<string | null>(searchParams.get('status'))
  const [orderId, setOrderId] = useState<string | null>(searchParams.get('orderId'))
  const [message, setMessage] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    dispatch(clearCurrentOrder())
    
    // Check if this is a return from VNPay
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode')
    if (vnp_ResponseCode) {
      setIsValidating(true)
      api.get(`/api/payment/vnpay-return?${searchParams.toString()}`)
        .then(res => {
          if (res.data.success) {
            setStatus('success')
            setOrderId(res.data.orderId.toString())
          } else {
            setStatus('failed')
            setMessage(res.data.message || 'Giao dịch không thành công')
          }
        })
        .catch(err => {
          console.error(err)
          setStatus('failed')
          setMessage('Lỗi khi xác thực thanh toán')
        })
        .finally(() => {
          setIsValidating(false)
        })
    }
  }, [dispatch, searchParams])

  const isSuccess = status === 'success'

  if (isValidating) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-gray-600 dark:text-gray-300">Đang xác thực giao dịch từ VNPay...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      {isSuccess ? (
        <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
      ) : (
        <XCircle className="w-24 h-24 text-red-500 mb-6" />
      )}
      
      <h1 className="text-3xl font-bold mb-4 text-center">
        {isSuccess ? 'Đặt hàng thành công!' : 'Đặt hàng thất bại'}
      </h1>
      
      {isSuccess ? (
        <p className="text-gray-500 text-center max-w-md mb-8 text-lg">
          Cảm ơn bạn đã mua sắm tại HienStore. Mã đơn hàng của bạn là <span className="font-bold text-gray-800 dark:text-gray-200">#{orderId}</span>. Chúng tôi sẽ sớm liên hệ để xác nhận giao hàng.
        </p>
      ) : (
        <p className="text-gray-500 text-center max-w-md mb-8 text-lg">
          {message || 'Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.'}
        </p>
      )}

      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/products')}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
        >
          Tiếp tục mua sắm
        </button>
        <button 
          onClick={() => navigate('/orders')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
        >
          Xem đơn hàng <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
