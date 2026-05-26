import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchAdminOrders, updateOrderStatus } from '../../features/order/orderSlice'
import { Loader2, Search, Edit2 } from 'lucide-react'

export const AdminOrdersPage = () => {
  const dispatch = useAppDispatch()
  const { orders, isLoading, pageInfo } = useAppSelector((state) => state.order)
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [newPaymentStatus, setNewPaymentStatus] = useState<string>('')

  useEffect(() => {
    dispatch(fetchAdminOrders({ page: 0, size: 20 }))
  }, [dispatch])

  const handleEditClick = (order: any) => {
    setEditingOrderId(order.id)
    setNewStatus(order.status)
    setNewPaymentStatus(order.paymentStatus)
  }

  const handleSaveStatus = async (orderId: number) => {
    await dispatch(updateOrderStatus({ 
      orderId, 
      status: newStatus, 
      paymentStatus: newPaymentStatus 
    }))
    setEditingOrderId(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'PROCESSING': return 'bg-blue-100 text-blue-800'
      case 'SHIPPED': return 'bg-purple-100 text-purple-800'
      case 'DELIVERED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quản lý đơn hàng</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Xem và cập nhật trạng thái các đơn hàng.</p>
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Tìm mã đơn, tên KH..." 
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 font-semibold">Mã Đơn</th>
                <th className="px-6 py-4 font-semibold">Ngày đặt</th>
                <th className="px-6 py-4 font-semibold">Khách hàng</th>
                <th className="px-6 py-4 font-semibold">Tổng tiền</th>
                <th className="px-6 py-4 font-semibold">Trạng thái ĐH</th>
                <th className="px-6 py-4 font-semibold">Thanh toán</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium">#{order.id}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{order.receiverName}</div>
                    <div className="text-xs text-gray-500">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    {editingOrderId === order.id ? (
                      <select 
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-xs"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingOrderId === order.id ? (
                      <select 
                        value={newPaymentStatus}
                        onChange={(e) => setNewPaymentStatus(e.target.value)}
                        className="p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-xs"
                      >
                        <option value="UNPAID">UNPAID</option>
                        <option value="PAID">PAID</option>
                        <option value="REFUNDED">REFUNDED</option>
                      </select>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {order.paymentStatus}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingOrderId === order.id ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleSaveStatus(order.id)}
                          className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700"
                        >
                          Lưu
                        </button>
                        <button 
                          onClick={() => setEditingOrderId(null)}
                          className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleEditClick(order)}
                        className="text-gray-400 hover:text-indigo-600 p-1"
                        title="Cập nhật trạng thái"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Chưa có đơn hàng nào trong hệ thống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500">
          <div>Hiển thị {orders.length} đơn hàng</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Trước</button>
            <button className="px-3 py-1 border border-gray-300 rounded bg-indigo-50 text-indigo-600 font-medium">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Sau</button>
          </div>
        </div>
      </div>
    </div>
  )
}
