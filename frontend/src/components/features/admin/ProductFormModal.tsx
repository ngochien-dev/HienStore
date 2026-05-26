import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import api from '../../../api/axiosClient'

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  product?: any // If provided, it's edit mode
}

export const ProductFormModal = ({ isOpen, onClose, onSuccess, product }: ProductFormModalProps) => {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    basePrice: '',
    categoryId: '',
    isPublished: true
  })

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
      if (product) {
        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          description: product.description || '',
          basePrice: product.basePrice?.toString() || '',
          categoryId: product.category?.id?.toString() || '',
          isPublished: product.isPublished
        })
      } else {
        setFormData({
          name: '',
          slug: '',
          description: '',
          basePrice: '',
          categoryId: '',
          isPublished: true
        })
      }
    }
  }, [isOpen, product])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories')
      setCategories(res.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const generateSlug = () => {
    if (!formData.name) return
    const slug = formData.name
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-z0-9 ]/g, '') // remove special chars
      .trim()
      .replace(/\s+/g, '-') // replace spaces with hyphens
    setFormData(prev => ({ ...prev, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const payload = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        basePrice: parseFloat(formData.basePrice)
      }

      if (product) {
        await api.put(`/api/admin/products/${product.id}`, payload)
      } else {
        await api.post('/api/admin/products', payload)
      }
      onSuccess()
    } catch (error) {
      console.error('Failed to save product:', error)
      alert('Có lỗi xảy ra khi lưu sản phẩm')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold">{product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên sản phẩm *</label>
                <Input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  onBlur={generateSlug}
                  required 
                  placeholder="Vd: Áo thun nam"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Đường dẫn (Slug) *</label>
                <Input 
                  name="slug" 
                  value={formData.slug} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Danh mục *</label>
                <select 
                  name="categoryId" 
                  value={formData.categoryId} 
                  onChange={handleChange}
                  required
                  className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Giá cơ bản (VND) *</label>
                <Input 
                  type="number" 
                  name="basePrice" 
                  value={formData.basePrice} 
                  onChange={handleChange} 
                  required 
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả sản phẩm</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="isPublished" 
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="isPublished" className="text-sm font-medium cursor-pointer">
                Hiển thị (Công khai)
              </label>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
          <Button variant="ghost" onClick={onClose} type="button">Hủy bỏ</Button>
          <Button type="submit" form="product-form" isLoading={isLoading}>
            {product ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
          </Button>
        </div>
      </div>
    </div>
  )
}
