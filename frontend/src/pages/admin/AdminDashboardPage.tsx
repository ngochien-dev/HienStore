import { useState, useEffect } from 'react'
import { TrendingUp, Users, ShoppingBag, DollarSign, Package, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '../../api/axiosClient'

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  pendingOrders: number
  deliveredOrders: number
  cancelledOrders: number
  totalCustomers: number
  totalProducts: number
  recentOrders: RecentOrder[]
}

interface RecentOrder {
  id: number
  customerName: string
  totalAmount: number
  status: string
  createdAt: string
}

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/admin/dashboard/stats')
        setStats(response.data)
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING': return { label: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' }
      case 'PROCESSING': return { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' }
      case 'SHIPPED': return { label: 'Đang giao', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', dot: 'bg-purple-500' }
      case 'DELIVERED': return { label: 'Đã giao', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' }
      case 'CANCELLED': return { label: 'Đã hủy', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', dot: 'bg-red-500' }
      default: return { label: status, color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">Không thể tải dữ liệu dashboard.</p>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Tổng doanh thu',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      description: 'Không tính đơn đã hủy',
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      name: 'Tổng đơn hàng',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      description: `${stats.pendingOrders} đang chờ xử lý`,
      gradient: 'from-indigo-500 to-violet-600',
      iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400'
    },
    {
      name: 'Khách hàng',
      value: stats.totalCustomers.toString(),
      icon: Users,
      description: 'Tổng người dùng đã đăng ký',
      gradient: 'from-orange-500 to-amber-600',
      iconBg: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      name: 'Sản phẩm',
      value: stats.totalProducts.toString(),
      icon: Package,
      description: 'Tổng sản phẩm trong hệ thống',
      gradient: 'from-pink-500 to-rose-600',
      iconBg: 'bg-pink-50 dark:bg-pink-900/20',
      iconColor: 'text-pink-600 dark:text-pink-400'
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tổng quan Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Chào mừng bạn trở lại, đây là dữ liệu thống kê thời gian thực.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.iconBg} p-3 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.name}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Order Status Summary + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Order Status Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-indigo-600 w-5 h-5" />
            Trạng thái đơn hàng
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-800 dark:text-amber-300">Chờ xác nhận</span>
              </div>
              <span className="text-lg font-bold text-amber-700 dark:text-amber-400">{stats.pendingOrders}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Đã giao thành công</span>
              </div>
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{stats.deliveredOrders}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-medium text-red-800 dark:text-red-300">Đã hủy</span>
              </div>
              <span className="text-lg font-bold text-red-700 dark:text-red-400">{stats.cancelledOrders}</span>
            </div>
          </div>

          {/* Mini progress bar */}
          {stats.totalOrders > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 mb-2">Tỷ lệ giao thành công</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((stats.deliveredOrders / stats.totalOrders) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                {Math.round((stats.deliveredOrders / stats.totalOrders) * 100)}%
              </p>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <ShoppingBag className="text-indigo-600 w-5 h-5" />
            Đơn hàng gần đây
          </h3>
          
          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    <th className="pb-3 font-semibold">Mã ĐH</th>
                    <th className="pb-3 font-semibold">Khách hàng</th>
                    <th className="pb-3 font-semibold">Tổng tiền</th>
                    <th className="pb-3 font-semibold">Trạng thái</th>
                    <th className="pb-3 font-semibold">Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status)
                    return (
                      <tr key={order.id} className="border-b border-gray-50 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="py-3.5 font-semibold text-indigo-600 dark:text-indigo-400">#{order.id}</td>
                        <td className="py-3.5 font-medium text-gray-800 dark:text-gray-200">{order.customerName}</td>
                        <td className="py-3.5 font-semibold">{formatPrice(order.totalAmount)}</td>
                        <td className="py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="py-3.5 text-gray-500 dark:text-gray-400 text-xs">{order.createdAt}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
