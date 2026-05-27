import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, Ticket } from 'lucide-react'
import api from '../../api/axiosClient'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderValue: '0',
    maxDiscountAmount: '',
    expiryDate: '',
    usageLimit: '0',
    isActive: true
  })

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCoupons()
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, page])

  const fetchCoupons = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/api/admin/coupons', { 
        params: { 
          page, 
          size: 10,
          keyword: searchTerm || undefined
        } 
      })
      setCoupons(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Failed to fetch coupons:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này không?')) return
    
    try {
      await api.delete(`/api/admin/coupons/${id}`)
      fetchCoupons()
    } catch (error) {
      console.error('Failed to delete coupon:', error)
      alert('Không thể xóa mã giảm giá.')
    }
  }

  const openCreateModal = () => {
    setEditingCoupon(null)
    setFormData({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderValue: '0',
      maxDiscountAmount: '',
      expiryDate: '',
      usageLimit: '0',
      isActive: true
    })
    setIsModalOpen(true)
  }

  const openEditModal = (coupon: any) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue.toString(),
      minOrderValue: coupon.minOrderValue.toString(),
      maxDiscountAmount: coupon.maxDiscountAmount ? coupon.maxDiscountAmount.toString() : '',
      expiryDate: coupon.expiryDate ? coupon.expiryDate.substring(0, 16) : '',
      usageLimit: coupon.usageLimit.toString(),
      isActive: coupon.isActive
    })
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const payload = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minOrderValue: parseFloat(formData.minOrderValue) || 0,
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
        usageLimit: parseInt(formData.usageLimit) || 0,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null
      }

      if (editingCoupon) {
        await api.put(`/api/admin/coupons/${editingCoupon.id}`, payload)
      } else {
        await api.post('/api/admin/coupons', payload)
      }
      
      setIsModalOpen(false)
      fetchCoupons()
    } catch (error: any) {
      console.error('Failed to save coupon:', error)
      alert(error.response?.data || 'Có lỗi xảy ra khi lưu mã giảm giá')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Mã Giảm Giá</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Tạo và quản lý các mã khuyến mãi (Coupons/Vouchers).</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text" 
              placeholder="Tìm kiếm mã..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none w-full"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <Button onClick={openCreateModal} className="shrink-0 flex items-center gap-2">
            <Plus size={18} /> <span className="hidden sm:inline">Thêm mới</span>
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Mã code</th>
                <th className="px-6 py-4 font-semibold">Mức giảm</th>
                <th className="px-6 py-4 font-semibold">Đơn tối thiểu</th>
                <th className="px-6 py-4 font-semibold">Đã dùng</th>
                <th className="px-6 py-4 font-semibold">Hạn sử dụng</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading && coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <Ticket size={16} />
                      {coupon.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : formatPrice(coupon.discountValue)}
                    {coupon.maxDiscountAmount && <div className="text-xs text-gray-500 font-normal mt-0.5">Tối đa {formatPrice(coupon.maxDiscountAmount)}</div>}
                  </td>
                  <td className="px-6 py-4">{formatPrice(coupon.minOrderValue)}</td>
                  <td className="px-6 py-4">
                    {coupon.usedCount} {coupon.usageLimit > 0 ? `/ ${coupon.usageLimit}` : '(Không giới hạn)'}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('vi-VN') : 'Vô thời hạn'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {coupon.isActive ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(coupon)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(coupon.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {!isLoading && coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy mã giảm giá nào.
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingCoupon ? 'Cập nhật mã giảm giá' : 'Thêm mã giảm giá mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="coupon-form" onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Mã giảm giá (Code) *</label>
                  <Input 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    required
                    placeholder="Vd: SUMMER2026"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Loại giảm giá *</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="PERCENTAGE">Giảm theo %</option>
                      <option value="FIXED">Giảm số tiền cố định</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Giá trị giảm *</label>
                    <Input 
                      type="number"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                      required
                      placeholder={formData.discountType === 'PERCENTAGE' ? "Vd: 10" : "Vd: 50000"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Đơn tối thiểu *</label>
                    <Input 
                      type="number"
                      value={formData.minOrderValue}
                      onChange={(e) => setFormData({...formData, minOrderValue: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Giảm tối đa (Nếu theo %)</label>
                    <Input 
                      type="number"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData({...formData, maxDiscountAmount: e.target.value})}
                      disabled={formData.discountType === 'FIXED'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Lượt dùng tối đa (0 = Không giới hạn)</label>
                    <Input 
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hạn sử dụng</label>
                    <Input 
                      type="datetime-local"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm font-medium">Kích hoạt mã giảm giá này</label>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" form="coupon-form" disabled={isLoading}>
                Lưu mã giảm giá
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
