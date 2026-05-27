import { useState, useEffect, useRef } from 'react'
import { Bell, CheckCircle, Package, MessageSquare, Info, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../../api/axiosClient'

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchUnreadCount()
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/api/notifications/unread-count')
      setUnreadCount(res.data.count)
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const res = await api.get('/api/notifications?page=0&size=10')
      setNotifications(res.data.content)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: number, isRead: boolean) => {
    if (isRead) return
    try {
      await api.put(`/api/notifications/${id}/read`)
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/read-all')
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'ORDER_STATUS': return <Package size={18} className="text-blue-500" />
      case 'REVIEW_REPLY': return <MessageSquare size={18} className="text-emerald-500" />
      default: return <Info size={18} className="text-indigo-500" />
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Vừa xong'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`
    return date.toLocaleDateString('vi-VN')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-300 relative"
        title="Thông báo"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full animate-pulse-slow">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-premium border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-fade-in origin-top-right">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-bold text-slate-900 dark:text-white">Thông báo</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
            {isLoading ? (
              <div className="flex justify-center p-8 text-indigo-600"><Loader2 className="animate-spin" /></div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    onClick={() => markAsRead(notif.id, notif.isRead)}
                    className={`p-4 flex gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer ${!notif.isRead ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                  >
                    <div className={`mt-1 p-2 rounded-full h-fit flex-shrink-0 ${!notif.isRead ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                        {notif.title}
                      </h4>
                      <p className={`text-xs mt-1 ${!notif.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2">{formatTime(notif.createdAt)}</p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                <Bell size={32} className="mb-2 opacity-20" />
                <p>Chưa có thông báo nào.</p>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-800/50">
             <span className="text-xs text-slate-500">HienStore - Luôn đồng hành cùng bạn</span>
          </div>
        </div>
      )}
    </div>
  )
}
