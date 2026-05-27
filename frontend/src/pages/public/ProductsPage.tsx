import { useState, useEffect } from 'react'
import api from '../../api/axiosClient'
import { ProductCard } from '../../components/features/products/ProductCard'
import { Loader2, Search } from 'lucide-react'
import { Input } from '../../components/ui/Input'

export const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [direction, setDirection] = useState<string>('desc')
  
  // Pagination
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts()
    }, 500) // debounce search

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, selectedCategory, sortBy, direction, page])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories')
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const params: any = { page, size: 12, sortBy, direction }
      
      if (searchTerm) params.keyword = searchTerm
      if (selectedCategory) params.categoryId = selectedCategory
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice

      const response = await api.get('/api/products/filter', { params })
      setProducts(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Tất cả sản phẩm</h1>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-64">
            <Input 
              type="text"
              placeholder="Tìm kiếm..."
              leftIcon={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(0)
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar / Filters */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24 space-y-8">
            
            {/* Category Filter */}
            <div>
              <h3 className="font-semibold text-lg mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                Danh mục
              </h3>
              <ul className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                <li>
                  <button 
                    className={`w-full text-left px-2 py-1.5 rounded-md transition-colors ${selectedCategory === null ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    onClick={() => {
                      setSelectedCategory(null)
                      setPage(0)
                    }}
                  >
                    Tất cả
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button 
                      className={`w-full text-left px-2 py-1.5 rounded-md transition-colors ${selectedCategory === cat.id ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                      onClick={() => {
                        setSelectedCategory(cat.id)
                        setPage(0)
                      }}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-semibold text-lg mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                Khoảng giá
              </h3>
              <div className="space-y-3">
                <div>
                  <input 
                    type="number" 
                    placeholder="Từ (VNĐ)" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input 
                    type="number" 
                    placeholder="Đến (VNĐ)" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-transparent outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button 
                  onClick={() => { setPage(0); fetchProducts() }}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <h3 className="font-semibold text-lg mb-4 pb-2 border-b border-gray-100 dark:border-gray-700">
                Sắp xếp
              </h3>
              <select 
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-transparent outline-none focus:ring-2 focus:ring-indigo-500 dark:text-gray-100"
                value={`${sortBy}-${direction}`}
                onChange={(e) => {
                  const [s, d] = e.target.value.split('-')
                  setSortBy(s)
                  setDirection(d)
                  setPage(0)
                }}
              >
                <option className="dark:bg-gray-800" value="createdAt-desc">Mới nhất</option>
                <option className="dark:bg-gray-800" value="basePrice-asc">Giá: Thấp đến Cao</option>
                <option className="dark:bg-gray-800" value="basePrice-desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
            
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  <button 
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Trước
                  </button>
                  <span className="px-4 py-2 font-medium">
                    {page + 1} / {totalPages}
                  </span>
                  <button 
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-500">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  )
}
