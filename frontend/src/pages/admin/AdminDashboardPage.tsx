import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react'

export const AdminDashboardPage = () => {
  const stats = [
    { name: 'Tổng doanh thu', value: '120.500.000 ₫', icon: DollarSign, change: '+12%', changeType: 'positive' },
    { name: 'Đơn hàng mới', value: '45', icon: ShoppingBag, change: '+5%', changeType: 'positive' },
    { name: 'Khách hàng', value: '2.450', icon: Users, change: '+18%', changeType: 'positive' },
    { name: 'Tỷ lệ chuyển đổi', value: '3.2%', icon: TrendingUp, change: '-1%', changeType: 'negative' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tổng quan Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Chào mừng bạn trở lại, hệ thống đang hoạt động tốt.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                <stat.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.name}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder for Charts / Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px]">
          <h3 className="text-lg font-bold mb-4">Biểu đồ doanh thu (Demo)</h3>
          <div className="flex items-center justify-center h-[300px] border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
            <span className="text-gray-400">Khu vực biểu đồ</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-[400px]">
          <h3 className="text-lg font-bold mb-4">Hoạt động gần đây (Demo)</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3 border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500"></div>
                <div>
                  <p className="text-sm font-medium">Đơn hàng #{1000 + i} vừa được đặt</p>
                  <p className="text-xs text-gray-500">10 phút trước</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
