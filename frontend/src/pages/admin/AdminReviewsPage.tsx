import { useState, useEffect } from 'react'
import { MessageSquare, Star, Reply, Trash2, Loader2, AlertCircle } from 'lucide-react'
import api from '../../api/axiosClient'
import { toast } from 'react-toastify'

interface Review {
  id: number
  productId: number
  userId: number
  userName: string
  userAvatar: string | null
  rating: number
  comment: string
  createdAt: string
  adminReply: string | null
  repliedAt: string | null
}

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const res = await api.get('/api/admin/reviews?size=50&sort=createdAt,desc')
      setReviews(res.data.content)
    } catch (error) {
      console.error('Lỗi khi tải danh sách đánh giá', error)
      toast.error('Lỗi khi tải danh sách đánh giá')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return
    try {
      await api.delete(`/api/admin/reviews/${id}`)
      toast.success('Đã xóa đánh giá')
      setReviews(reviews.filter(r => r.id !== id))
    } catch (error) {
      toast.error('Không thể xóa đánh giá')
    }
  }

  const handleReplySubmit = async (id: number) => {
    if (!replyText.trim()) return
    
    try {
      setIsSubmitting(true)
      const res = await api.put(`/api/admin/reviews/${id}/reply`, { replyText })
      toast.success('Gửi phản hồi và email thông báo thành công!')
      setReviews(reviews.map(r => r.id === id ? res.data : r))
      setReplyingTo(null)
      setReplyText('')
    } catch (error) {
      toast.error('Không thể gửi phản hồi')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} size={14} className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
    ))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" />
            Quản lý Đánh giá
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Xem và trả lời phản hồi từ khách hàng. Email thông báo sẽ được gửi tự động khi bạn trả lời.
          </p>
        </div>
      </div>

      <div className="p-6 bg-gray-50 dark:bg-gray-900/30">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có đánh giá nào.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                      {review.userAvatar ? (
                        <img src={review.userAvatar} alt="avatar" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        review.userName.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{review.userName}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                        <span>•</span>
                        <span>{new Date(review.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(review.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Xóa đánh giá"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4 pl-14">{review.comment}</p>
                
                <div className="pl-14">
                  {review.adminReply ? (
                    <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-4 border-l-4 border-indigo-500 relative">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-indigo-700 dark:text-indigo-400 text-sm">Phản hồi của HienStore</span>
                        <span className="text-xs text-indigo-400 dark:text-indigo-500">
                          {review.repliedAt && new Date(review.repliedAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{review.adminReply}</p>
                    </div>
                  ) : (
                    <div>
                      {replyingTo === review.id ? (
                        <div className="space-y-3">
                          <textarea
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none dark:text-white"
                            rows={3}
                            placeholder="Nhập phản hồi của bạn..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                              onClick={() => { setReplyingTo(null); setReplyText(''); }}
                            >
                              Hủy
                            </button>
                            <button
                              className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 font-medium"
                              onClick={() => handleReplySubmit(review.id)}
                              disabled={!replyText.trim() || isSubmitting}
                            >
                              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Reply className="w-4 h-4" />}
                              Gửi phản hồi
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-lg transition-colors"
                          onClick={() => { setReplyingTo(review.id); setReplyText(''); }}
                        >
                          <Reply className="w-4 h-4" /> Trả lời khách hàng
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
