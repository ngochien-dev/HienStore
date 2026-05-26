import { useState, useEffect } from 'react'
import { Save, Key, Store, Globe, Mail } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export const AdminSettingsPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  
  // Basic settings
  const [settings, setSettings] = useState({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    facebookUrl: '',
    instagramUrl: ''
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/api/admin/settings')
      if (data && Object.keys(data).length > 0) {
        setSettings({
          storeName: data.storeName || '',
          storeEmail: data.storeEmail || '',
          storePhone: data.storePhone || '',
          storeAddress: data.storeAddress || '',
          facebookUrl: data.facebookUrl || '',
          instagramUrl: data.instagramUrl || ''
        })
      }
    } catch (error) {
      console.error('Failed to load settings', error)
    }
  }

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    })
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.put('/api/admin/settings', settings)
      alert('Đã lưu cấu hình thành công!')
    } catch (error) {
      alert('Lưu cấu hình thất bại!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Mật khẩu mới không khớp!')
      return
    }
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      alert('Đã đổi mật khẩu thành công!')
    }, 1000)
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cài đặt hệ thống</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Quản lý cấu hình chung của cửa hàng và tài khoản Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2">
            <nav className="flex flex-col space-y-1">
              <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                <Store size={18} />
                Thông tin cửa hàng
              </button>
              <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Key size={18} />
                Đổi mật khẩu
              </button>
              <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Globe size={18} />
                Tích hợp mạng xã hội
              </button>
              <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Mail size={18} />
                Cấu hình Email (SMTP)
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-2 space-y-8">
          
          {/* Store Info Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Thông tin cửa hàng</h2>
              <p className="text-sm text-gray-500 mt-1">Thông tin này sẽ được hiển thị công khai trên website.</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Tên cửa hàng</label>
                    <Input name="storeName" value={settings.storeName} onChange={handleSettingsChange} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Số điện thoại</label>
                    <Input name="storePhone" value={settings.storePhone} onChange={handleSettingsChange} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium">Email liên hệ</label>
                    <Input name="storeEmail" type="email" value={settings.storeEmail} onChange={handleSettingsChange} />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-sm font-medium">Địa chỉ</label>
                    <Input name="storeAddress" value={settings.storeAddress} onChange={handleSettingsChange} />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" isLoading={isLoading} className="flex items-center gap-2">
                    <Save size={18} /> Lưu cấu hình
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Đổi mật khẩu Admin</h2>
              <p className="text-sm text-gray-500 mt-1">Đảm bảo tài khoản của bạn sử dụng mật khẩu dài và an toàn.</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSavePassword} className="space-y-6">
                <div className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Mật khẩu hiện tại</label>
                    <Input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Mật khẩu mới</label>
                    <Input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Xác nhận mật khẩu mới</label>
                    <Input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} required />
                  </div>
                </div>
                <div className="flex justify-start pt-2">
                  <Button type="submit" variant="secondary" isLoading={isLoading} className="flex items-center gap-2">
                    <Key size={18} /> Đổi mật khẩu
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
