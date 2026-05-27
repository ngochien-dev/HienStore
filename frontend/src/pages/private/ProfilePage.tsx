import { useState } from 'react'
import { useAppSelector } from '../../app/hooks'
import { User, Mail, Shield, UserCircle, MapPin, Settings, Award } from 'lucide-react'
import { AddressBook } from '../../components/features/user/AddressBook'

export const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState<'info' | 'address'>('info')

  if (!user) {
    return null
  }

  const getMembershipDetails = () => {
    const points = user?.point || 0;
    const tier = user?.userType || 'COPPER';
    let nextTier = 'BẠC';
    let nextPoints = 1000;
    let color = 'text-amber-700 bg-amber-100 dark:bg-amber-900/50 dark:text-amber-400'; 
    let discount = 0;
    let displayTier = 'ĐỒNG';

    switch (tier) {
      case 'COPPER':
        displayTier = 'ĐỒNG'; nextTier = 'BẠC'; nextPoints = 1000; color = 'text-amber-700 bg-amber-100 dark:bg-amber-900/50 dark:text-amber-400'; discount = 0; break;
      case 'SILVER':
        displayTier = 'BẠC'; nextTier = 'VÀNG'; nextPoints = 5000; color = 'text-gray-600 bg-gray-200 dark:bg-gray-700 dark:text-gray-300'; discount = 3; break;
      case 'GOLD':
        displayTier = 'VÀNG'; nextTier = 'KIM CƯƠNG'; nextPoints = 10000; color = 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-400'; discount = 5; break;
      case 'DIAMOND':
        displayTier = 'KIM CƯƠNG'; nextTier = 'MAX'; nextPoints = 10000; color = 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/50 dark:text-cyan-400'; discount = 10; break;
    }

    const progress = tier === 'DIAMOND' ? 100 : Math.min(100, Math.round((points / nextPoints) * 100));

    return { displayTier, nextTier, nextPoints, points, progress, color, discount, tier };
  }
  
  const membership = getMembershipDetails();

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
          <div className="relative flex justify-between items-end -mt-16 mb-8 flex-wrap gap-4">
            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 flex items-center justify-center shadow-md overflow-hidden shrink-0">
              <UserCircle className="w-24 h-24 text-gray-300 dark:text-gray-500" />
            </div>
            
            {/* Membership Status */}
            <div className="bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-4 flex-1 min-w-[300px] max-w-md ml-auto mt-4 sm:mt-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider mb-1">Thành viên HienStore</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${membership.color}`}>
                      <Award size={14} />
                      HẠNG {membership.displayTier}
                    </span>
                    {membership.discount > 0 && (
                      <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">
                        Giảm {membership.discount}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{membership.points}</p>
                  <p className="text-xs text-gray-500">Điểm tích lũy</p>
                </div>
              </div>
              
              {membership.tier !== 'DIAMOND' && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Tiến độ lên hạng {membership.nextTier}</span>
                    <span>{membership.points} / {membership.nextPoints}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                      style={{ width: `${membership.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
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
