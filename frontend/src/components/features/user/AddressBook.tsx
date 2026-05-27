import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, MapPin, CheckCircle, Loader2 } from 'lucide-react'
import api from '../../../api/axiosClient'

export const AddressBook = () => {
  const [addresses, setAddresses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    streetNumber: '',
    streetName: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setIsLoading(true)
      const res = await api.get('/api/addresses')
      setAddresses(res.data)
    } catch (error) {
      console.error('Lỗi tải danh sách địa chỉ:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenForm = (address?: any) => {
    if (address) {
      setEditingId(address.id)
      setFormData({
        fullName: address.fullName,
        phone: address.phone,
        streetNumber: address.streetNumber || '',
        streetName: address.streetName,
        ward: address.ward,
        district: address.district,
        city: address.city,
        isDefault: address.isDefault
      })
    } else {
      setEditingId(null)
      setFormData({
        fullName: '',
        phone: '',
        streetNumber: '',
        streetName: '',
        ward: '',
        district: '',
        city: '',
        isDefault: addresses.length === 0 // Force default if it's the first one
      })
    }
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingId) {
        await api.put(`/api/addresses/${editingId}`, formData)
        showToast('Cập nhật địa chỉ thành công')
      } else {
        await api.post('/api/addresses', formData)
        showToast('Thêm địa chỉ thành công')
      }
      handleCloseForm()
      fetchAddresses()
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Có lỗi xảy ra'
      showToast(msg, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return
    try {
      await api.delete(`/api/addresses/${id}`)
      showToast('Đã xóa địa chỉ')
      fetchAddresses()
    } catch (error) {
      showToast('Lỗi khi xóa địa chỉ', 'error')
    }
  }

  const handleSetDefault = async (id: number, currentData: any) => {
    if (currentData.isDefault) return
    try {
      await api.put(`/api/addresses/${id}`, { ...currentData, isDefault: true })
      fetchAddresses()
      showToast('Đã đặt làm địa chỉ mặc định')
    } catch (error) {
      showToast('Lỗi', 'error')
    }
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-600" /></div>
  }

  return (
    <div className="space-y-6">
      
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 glass-premium border-l-4 border-l-indigo-500 border-white/20 text-slate-800 dark:text-slate-100 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3.5">
          {toast.type === 'success' ? <CheckCircle className="text-emerald-500" size={18} /> : <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />}
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <MapPin className="text-indigo-500" size={20} />
          Sổ địa chỉ của bạn
        </h3>
        {!isFormOpen && (
          <button 
            onClick={() => handleOpenForm()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus size={16} /> Thêm địa chỉ mới
          </button>
        )}
      </div>

      {isFormOpen ? (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
          <h4 className="font-bold mb-4">{editingId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Họ và tên *</label>
                <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Số điện thoại *</label>
                <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tỉnh / Thành phố *</label>
                <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quận / Huyện *</label>
                <input required type="text" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phường / Xã *</label>
                <input required type="text" value={formData.ward} onChange={e => setFormData({...formData, ward: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tên đường *</label>
                <input required type="text" value={formData.streetName} onChange={e => setFormData({...formData, streetName: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Số nhà, Ngõ ngách (Tùy chọn)</label>
                <input type="text" value={formData.streetNumber} onChange={e => setFormData({...formData, streetNumber: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-4">
              <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" disabled={addresses.length === 0} />
              <label htmlFor="isDefault" className="text-sm font-medium cursor-pointer">Đặt làm địa chỉ mặc định</label>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button type="button" onClick={handleCloseForm} className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700">Hủy</button>
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">Lưu địa chỉ</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.length > 0 ? (
            addresses.map(addr => (
              <div key={addr.id} className={`p-5 border rounded-2xl ${addr.isDefault ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-gray-200 dark:border-gray-700'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-gray-900 dark:text-white text-lg">{addr.fullName}</span>
                      {addr.isDefault && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Mặc định</span>}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>Điện thoại: <span className="font-semibold text-gray-800 dark:text-gray-200">{addr.phone}</span></p>
                      <p>{addr.fullAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenForm(addr)} className="text-gray-500 hover:text-indigo-600 p-2"><Edit2 size={16} /></button>
                    {!addr.isDefault && <button onClick={() => handleDelete(addr.id)} className="text-gray-500 hover:text-red-600 p-2"><Trash2 size={16} /></button>}
                  </div>
                </div>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id, addr)} className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                    Thiết lập làm mặc định
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-500">
              <MapPin size={40} className="mx-auto mb-3 opacity-50" />
              <p>Bạn chưa có địa chỉ nào trong sổ.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
