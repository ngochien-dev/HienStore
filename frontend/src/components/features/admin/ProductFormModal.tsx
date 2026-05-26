import { useState, useEffect, useRef } from 'react'
import { X, FolderPlus, Loader2, UploadCloud, Plus, Trash2 } from 'lucide-react'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import api from '../../../api/axiosClient'

interface ProductFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  product?: any // If provided, it's edit mode
}

interface UIVariant {
  id?: number
  color: string
  size: string
  sku: string
  price: string
  stockQuantity: string
  imageUrl: string
}

export const ProductFormModal = ({ isOpen, onClose, onSuccess, product }: ProductFormModalProps) => {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const [variants, setVariants] = useState<UIVariant[]>([])
  const [uploadTargetIndex, setUploadTargetIndex] = useState<number | null>(null)
  const variantFileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    basePrice: '',
    categoryId: '',
    isPublished: true,
    images: '',
    stockQuantity: ''
  })

  // New Category inline form states
  const [showNewCatForm, setShowNewCatForm] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatDesc, setNewCatDesc] = useState('')
  const [isSavingCat, setIsSavingCat] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchCategories()
      if (product) {
        const imgUrls = product.images?.map((img: any) => img.imageUrl).join(', ') || ''
        const stock = product.variants?.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0)?.toString() || '0'
        setFormData({
          name: product.name || '',
          slug: product.slug || '',
          description: product.description || '',
          basePrice: product.basePrice?.toString() || '',
          categoryId: product.category?.id?.toString() || '',
          isPublished: product.isPublished,
          images: imgUrls,
          stockQuantity: stock
        })

        if (product.variants && product.variants.length > 0) {
          setVariants(product.variants.map((v: any) => ({
            id: v.id,
            color: v.color || '',
            size: v.size || '',
            sku: v.sku || '',
            price: v.price?.toString() || '',
            stockQuantity: v.stockQuantity?.toString() || '0',
            imageUrl: v.imageUrl || ''
          })))
        } else {
          setVariants([])
        }
      } else {
        setFormData({
          name: '',
          slug: '',
          description: '',
          basePrice: '',
          categoryId: '',
          isPublished: true,
          images: '',
          stockQuantity: ''
        })
        setVariants([])
      }
      setShowNewCatForm(false)
    }
  }, [isOpen, product])

  // Auto calculate total stock from variants
  useEffect(() => {
    if (variants.length > 0) {
      const totalStock = variants.reduce((sum, v) => sum + (parseInt(v.stockQuantity) || 0), 0)
      setFormData(prev => ({ ...prev, stockQuantity: totalStock.toString() }))
    }
  }, [variants])

  const handleAddVariant = () => {
    setVariants(prev => [
      ...prev,
      {
        color: '',
        size: '',
        sku: '',
        price: '',
        stockQuantity: '0',
        imageUrl: ''
      }
    ])
  }

  const handleRemoveVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  const handleVariantChange = (index: number, field: keyof UIVariant, value: any) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v))
  }

  const handleVariantUploadClick = (index: number) => {
    setUploadTargetIndex(index)
    variantFileInputRef.current?.click()
  }

  const handleVariantFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || uploadTargetIndex === null) return

    try {
      const formDataObj = new FormData()
      formDataObj.append('file', files[0])
      
      const res = await api.post('/api/admin/upload', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (res.data && res.data.url) {
        handleVariantChange(uploadTargetIndex, 'imageUrl', res.data.url)
      }
    } catch (error) {
      console.error('Failed to upload variant file:', error)
      alert('Có lỗi xảy ra khi tải ảnh lên cho phân loại')
    } finally {
      setUploadTargetIndex(null)
      if (variantFileInputRef.current) variantFileInputRef.current.value = ''
    }
  }

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

  const handleCreateCategory = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    setIsSavingCat(true)
    try {
      const slug = newCatName
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      
      const res = await api.post('/api/admin/categories', {
        name: newCatName.trim(),
        slug,
        description: newCatDesc.trim()
      })
      
      // Refresh categories list
      const catListRes = await api.get('/api/categories')
      setCategories(catListRes.data)
      
      // Auto-select the newly created category
      setFormData(prev => ({ ...prev, categoryId: res.data.id.toString() }))
      
      // Reset form
      setNewCatName('')
      setNewCatDesc('')
      setShowNewCatForm(false)
    } catch (error) {
      console.error('Failed to create category:', error)
      alert('Có lỗi xảy ra khi tạo danh mục mới')
    } finally {
      setIsSavingCat(false)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const uploadedUrls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const formDataObj = new FormData()
        formDataObj.append('file', files[i])
        
        const res = await api.post('/api/admin/upload', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        if (res.data && res.data.url) {
          uploadedUrls.push(res.data.url)
        }
      }

      // Append new URLs to existing ones
      const existingUrls = formData.images 
        ? formData.images.split(',').map(url => url.trim()).filter(Boolean) 
        : []
      const combined = [...existingUrls, ...uploadedUrls].join(', ')
      setFormData(prev => ({ ...prev, images: combined }))
    } catch (error) {
      console.error('Failed to upload files:', error)
      alert('Có lỗi xảy ra khi tải ảnh lên từ máy tính')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = '' // Reset input
    }
  }

  const handleRemoveImage = (indexToRemove: number) => {
    const urls = formData.images 
      ? formData.images.split(',').map(url => url.trim()).filter(Boolean) 
      : []
    const updated = urls.filter((_, idx) => idx !== indexToRemove).join(', ')
    setFormData(prev => ({ ...prev, images: updated }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const imgList = formData.images
        .split(',')
        .map(url => url.trim())
        .filter(Boolean)

      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        basePrice: parseFloat(formData.basePrice),
        categoryId: parseInt(formData.categoryId),
        isPublished: formData.isPublished,
        images: imgList,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        variants: variants.map(v => ({
          id: v.id,
          color: v.color || 'Freesize',
          size: v.size || 'Freesize',
          sku: v.sku,
          price: v.price ? parseFloat(v.price) : parseFloat(formData.basePrice),
          stockQuantity: parseInt(v.stockQuantity) || 0,
          imageUrl: v.imageUrl
        }))
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
          <form id="product-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* General Info Row */}
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
            </div>

            {/* Category selection and Inline Add Category */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 space-y-4">
              <div className="flex items-end gap-3">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Danh mục *</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    disabled={showNewCatForm}
                    className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                {!showNewCatForm && (
                  <button
                    type="button"
                    onClick={() => setShowNewCatForm(true)}
                    className="h-10 px-3.5 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-lg hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                  >
                    <FolderPlus size={16} />
                    <span>Thêm danh mục mới</span>
                  </button>
                )}
              </div>

              {/* Dynamic Add Category Sub-form */}
              {showNewCatForm && (
                <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-900/50 space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Danh mục mới</span>
                    <button type="button" onClick={() => setShowNewCatForm(false)} className="text-gray-400 hover:text-gray-500"><X size={14} /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Tên danh mục mới (Vd: Áo Vest)"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-transparent px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Mô tả danh mục"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-transparent px-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowNewCatForm(false)}
                      className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      disabled={isSavingCat || !newCatName.trim()}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-1 disabled:opacity-50"
                    >
                      {isSavingCat && <Loader2 className="animate-spin" size={12} />}
                      <span>Lưu danh mục</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Price & Quantity Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Giá cơ bản (VND) *</label>
                <Input
                  type="number"
                  name="basePrice"
                  value={formData.basePrice}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Vd: 150000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Số lượng tồn kho (Tổng số) *</label>
                <Input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Vd: 100"
                  disabled={variants.length > 0}
                />
              </div>
            </div>

            {/* Variants Management Section */}
            <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                    Phân loại sản phẩm (Màu sắc / Kích cỡ)
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Cấu hình màu sắc, kích cỡ, giá riêng và kho riêng cho từng phiên bản.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus size={14} />
                  <span>Thêm phân loại</span>
                </button>
              </div>

              {variants.length > 0 && (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {variants.map((v, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-lg border border-gray-250 dark:border-gray-650 bg-white dark:bg-gray-800 space-y-3 relative group/item shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(index)}
                        className="absolute top-3.5 right-3.5 text-gray-400 hover:text-rose-500 transition-colors"
                        title="Xóa phân loại"
                      >
                        <Trash2 size={15} />
                      </button>

                      <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        Phiên bản #{index + 1}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-gray-500">Màu sắc *</label>
                          <input
                            type="text"
                            required
                            placeholder="Vd: Đỏ, Xanh"
                            value={v.color}
                            onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                            className="flex h-8 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-gray-500">Kích cỡ *</label>
                          <input
                            type="text"
                            required
                            placeholder="Vd: M, L"
                            value={v.size}
                            onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                            className="flex h-8 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-gray-500">Giá riêng (VND)</label>
                          <input
                            type="number"
                            min="0"
                            placeholder="Như giá gốc"
                            value={v.price}
                            onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                            className="flex h-8 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-gray-500">Kho *</label>
                          <input
                            type="number"
                            required
                            min="0"
                            placeholder="Số lượng"
                            value={v.stockQuantity}
                            onChange={(e) => handleVariantChange(index, 'stockQuantity', e.target.value)}
                            className="flex h-8 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-gray-500">Mã SKU (tùy chọn)</label>
                          <input
                            type="text"
                            placeholder="Hệ thống tự tạo"
                            value={v.sku}
                            onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                            className="flex h-8 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-gray-500">Ảnh phân loại</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Nhập URL hoặc bấm tải lên"
                              value={v.imageUrl}
                              onChange={(e) => handleVariantChange(index, 'imageUrl', e.target.value)}
                              className="flex-1 h-8 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => handleVariantUploadClick(index)}
                              className="px-2.5 h-8 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-md text-xs font-semibold flex items-center justify-center transition-colors shrink-0"
                            >
                              Tải lên
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <input
                type="file"
                ref={variantFileInputRef}
                onChange={handleVariantFileUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Images Input & Local Upload */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Hình ảnh sản phẩm (URL hoặc tải từ máy)</label>
                <button
                  type="button"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 flex items-center gap-1.5 disabled:opacity-50 transition-all duration-300"
                >
                  {isUploading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <UploadCloud size={14} />
                  )}
                  <span>Tải ảnh lên...</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </div>

              <Input
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="Nhập link ảnh cách nhau bằng dấu phẩy hoặc tải ảnh ở nút bên trên"
              />

              {/* Images Preview Section */}
              {formData.images && (
                <div className="flex flex-wrap gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80">
                  {formData.images.split(',').map((url, idx) => {
                    const cleanUrl = url.trim()
                    if (!cleanUrl) return null
                    return (
                      <div key={idx} className="relative w-16 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group shadow-sm bg-white dark:bg-gray-800 flex items-center justify-center">
                        <img src={cleanUrl} alt="preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-1.5 -right-1.5 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          title="Xóa ảnh"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mô tả sản phẩm</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Vd: Chất liệu cotton mát mẻ..."
                className="flex w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <label htmlFor="isPublished" className="text-sm font-medium cursor-pointer">
                Hiển thị công khai (Cho khách hàng xem)
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
