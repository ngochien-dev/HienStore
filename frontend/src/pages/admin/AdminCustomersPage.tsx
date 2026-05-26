import { useState, useEffect } from 'react'
import { Search, ShieldAlert, ShieldCheck } from 'lucide-react'
import api from '../../api/axiosClient'

export const AdminCustomersPage = () => {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers()
    }, 500)
    return () => clearTimeout(timer)
  }, [page, searchTerm])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/api/admin/users', { 
        params: { 
          page, 
          size: 10,
          keyword: searchTerm || undefined
        } 
      })
      setUsers(response.data.content)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleUserStatus = async (id: number) => {
    try {
      await api.put(`/api/admin/users/${id}/status`)
      fetchUsers() // refresh list
    } catch (error) {
      console.error('Failed to toggle user status:', error)
      alert('Có lỗi xảy ra khi đổi trạng thái tài khoản.')
    }
  }

  const filteredUsers = users // We no longer filter in memory

  const getUserTypeColor = (type: string) => {
    switch(type) {
      case 'GOLD': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case 'SILVER': return 'bg-gray-100 text-gray-800 border border-gray-200'
      case 'COPPER': return 'bg-orange-50 text-orange-800 border border-orange-200'
      default: return 'bg-blue-50 text-blue-800 border border-blue-200'
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý Khách hàng</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý tài khoản khách hàng và hạng thành viên.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Tìm email, SĐT, tên..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none w-full"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold w-16">ID</th>
                <th className="px-6 py-4 font-semibold">Khách hàng</th>
                <th className="px-6 py-4 font-semibold">Liên hệ</th>
                <th className="px-6 py-4 font-semibold">Hạng</th>
                <th className="px-6 py-4 font-semibold">Ngày đăng ký</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">#{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user.lastName} {user.firstName}
                    </div>
                    {user.role === 'ADMIN' && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] rounded font-bold uppercase tracking-wide">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 dark:text-gray-300">{user.email}</div>
                    <div className="text-xs text-gray-500">{user.phone || 'Chưa cập nhật SĐT'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getUserTypeColor(user.userType)}`}>
                      {user.userType || 'MEMBER'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.isEnabled ? 'Đang hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role !== 'ADMIN' && (
                      <button 
                        onClick={() => toggleUserStatus(user.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isEnabled 
                            ? 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                        }`}
                        title={user.isEnabled ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        {user.isEnabled ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {!isLoading && filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy khách hàng nào.
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
