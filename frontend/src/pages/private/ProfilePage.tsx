import { useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import { User, Mail, Shield, UserCircle, MapPin, Settings } from 'lucide-react'
import { AddressBook } from '../../components/features/user/AddressBook'

export const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState<'info' | 'address'>('info')

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <UserCircle className="text-indigo-600 w-8 h-8" />
        Hồ sơ cá nhân
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header/Cover Area */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        
        <div className="px-6 sm:px-10 pb-10">
          <div className="relative flex justify-between items-end -mt-16 mb-8">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 flex items-center justify-center shadow-md overflow-hidden">
              <UserCircle className="w-24 h-24 text-gray-300 dark:text-gray-500" />
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('info')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'info' 
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              <Settings size={18} />
              Thông tin tài khoản
            </button>
            <button 
              onClick={() => setActiveTab('address')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'address' 
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'
              }`}
            >
              <MapPin size={18} />
              Sổ địa chỉ
            </button>
          </div>

          {activeTab === 'info' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Thông tin cơ bản</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                      <User className="w-5 h-5 text-gray-400 mr-4" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Họ và tên</p>
                        <p className="font-medium">{user.fullName}</p>
                      </div>
                    </div>

                    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                      <Mail className="w-5 h-5 text-gray-400 mr-4" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bảo mật & Cài đặt</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                      <Shield className="w-5 h-5 text-green-500 mr-4" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Vai trò</p>
                        <p className="font-medium inline-flex items-center gap-2">
                          {user.role === 'ADMIN' ? (
                            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">ADMIN</span>
                          ) : (
                            <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-bold">CUSTOMER</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <AddressBook />
          )}
        </div>
      </div>
    </div>
  )
}
