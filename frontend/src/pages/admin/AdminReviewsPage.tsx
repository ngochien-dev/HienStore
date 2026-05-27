import { useState, useEffect } from 'react'
import { MessageSquare, Trash2, Star } from 'lucide-react'
import api from '../../api/axiosClient'

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchReviews()
  }, [page])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/api/admin/reviews', { 
        params: { page, size: 10, sort: 'createdAt,desc' } 
      })
      setReviews(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này không?')) return
    
    try {
      await api.delete(`/api/admin/reviews/${id}`)
      fetchReviews()
    } catch (error) {
      console.error('Failed to delete review:', error)
      alert('Không thể xóa đánh giá.')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Đánh giá</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý và kiểm duyệt các đánh giá của khách hàng.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 whitespace-nowrap">
              <tr>
                <th className="px-6 py-4 font-semibold">Khách hàng</th>
                <th className="px-6 py-4 font-semibold">Đánh giá</th>
                <th className="px-6 py-4 font-semibold">Nội dung</th>
                <th className="px-6 py-4 font-semibold">Thời gian</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading && reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold overflow-hidden">
                        {review.userAvatar ? (
                          <img src={review.userAvatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          review.userName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{review.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-amber-500">{review.rating}</span>
                      <Star size={14} className="text-amber-500 fill-current" />
                    </div>
                  </td>
                  <td className="px-6 py-4 min-w-[300px]">
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{review.comment}</p>
                    <div className="text-xs text-indigo-600 mt-1 cursor-pointer">ID SP: {review.productId}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Xóa đánh giá"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {!isLoading && reviews.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 flex flex-col items-center">
                    <MessageSquare size={32} className="text-gray-300 mb-2" />
                    Chưa có đánh giá nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500">
            <div>Trang {page + 1} / {totalPages}</div>
            <div className="flex gap-1">
              <button 
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
