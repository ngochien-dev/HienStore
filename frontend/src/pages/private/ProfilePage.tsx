import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { User, Mail, Shield, UserCircle, MapPin, Settings, Award, ChevronRight, Crown } from 'lucide-react'
import { AddressBook } from '../../components/features/user/AddressBook'
import { updateUser } from '../../features/auth/authSlice'
import api from '../../api/axiosClient'

export const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState<'info' | 'address'>('info')

  useEffect(() => {
    if (user) {
      api.get('/api/auth/me').then(res => {
        dispatch(updateUser(res.data))
      }).catch(console.error)
    }
  }, [dispatch])

  if (!user) {
    return null
  }

  const getMembershipDetails = () => {
    const points = (user as any)?.point || 0;
    const tier = (user as any)?.userType || 'COPPER';
    let nextTier = 'BẠC';
    let nextPoints = 1000;
    let discount = 0;
    let displayTier = 'ĐỒNG';
    let cardStyle = 'from-amber-700 via-amber-600 to-amber-800 text-amber-50 border-amber-900';
    let iconColor = 'text-amber-200';

    switch (tier) {
      case 'COPPER':
        displayTier = 'ĐỒNG'; nextTier = 'BẠC'; nextPoints = 1000; discount = 0; 
        cardStyle = 'from-amber-800 via-amber-600 to-amber-900 text-amber-50 border-amber-900 shadow-amber-900/50';
        iconColor = 'text-amber-300';
        break;
      case 'SILVER':
        displayTier = 'BẠC'; nextTier = 'VÀNG'; nextPoints = 5000; discount = 3; 
        cardStyle = 'from-slate-300 via-gray-100 to-slate-400 text-slate-800 border-slate-400 shadow-slate-500/50';
        iconColor = 'text-slate-600';
        break;
      case 'GOLD':
        displayTier = 'VÀNG'; nextTier = 'KIM CƯƠNG'; nextPoints = 10000; discount = 5; 
        cardStyle = 'from-yellow-400 via-yellow-200 to-yellow-600 text-yellow-900 border-yellow-500 shadow-yellow-500/50';
        iconColor = 'text-yellow-700';
        break;
      case 'DIAMOND':
        displayTier = 'KIM CƯƠNG'; nextTier = 'MAX'; nextPoints = 10000; discount = 10; 
        cardStyle = 'from-cyan-400 via-blue-500 to-indigo-600 text-white border-blue-400 shadow-blue-500/50';
        iconColor = 'text-cyan-200';
        break;
    }

    const progress = tier === 'DIAMOND' ? 100 : Math.min(100, Math.round((points / nextPoints) * 100));

    return { displayTier, nextTier, nextPoints, points, progress, cardStyle, iconColor, discount, tier };
  }
  
  const membership = getMembershipDetails();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3 text-gray-900 dark:text-white">
          Hồ sơ cá nhân
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: User Card & Membership Card */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* User Info Basic */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20"></div>
              
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 flex items-center justify-center shadow-md overflow-hidden relative z-10 mb-4">
                <UserCircle className="w-20 h-20 text-gray-300 dark:text-gray-500" />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 dark:text-white relative z-10">{user.fullName}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 relative z-10">{user.email}</p>
              
              <div className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex justify-between items-center text-sm relative z-10">
                <span className="text-gray-500 dark:text-gray-400">Vai trò</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">{user.role}</span>
              </div>
            </div>

            {/* Membership Premium Card */}
            <div className={`relative rounded-3xl p-6 bg-gradient-to-br ${membership.cardStyle} shadow-lg border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}>
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
              
              {/* Card Decorative Elements */}
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
              <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1">HienStore Member</p>
                    <div className="flex items-center gap-2">
                      <Crown className={membership.iconColor} size={24} />
                      <h3 className="text-2xl font-black uppercase tracking-wider">{membership.displayTier}</h3>
                    </div>
                  </div>
                  {membership.discount > 0 && (
                    <div className="bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                      <span className="text-xs font-bold whitespace-nowrap">Giảm {membership.discount}%</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-sm opacity-80 mb-1">Điểm tích lũy</p>
                  <p className="text-4xl font-black tracking-tight">{new Intl.NumberFormat('vi-VN').format(membership.points)}</p>
                </div>

                {membership.tier !== 'DIAMOND' ? (
                  <div>
                    <div className="flex justify-between text-xs opacity-90 mb-2 font-medium">
                      <span>Lên hạng {membership.nextTier}</span>
                      <span>{new Intl.NumberFormat('vi-VN').format(membership.points)} / {new Intl.NumberFormat('vi-VN').format(membership.nextPoints)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-1000"
                        style={{ width: `${membership.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-black/10 rounded-xl p-3 border border-white/10 backdrop-blur-sm">
                    <p className="text-xs font-medium flex items-center justify-center gap-2">
                      <Award size={16} /> Bạn đã đạt hạng thẻ cao nhất
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Sidebar */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <nav className="flex flex-col gap-2">
                <button 
                  onClick={() => setActiveTab('info')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'info' 
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Settings size={18} />
                    <span>Thông tin tài khoản</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === 'info' ? 'opacity-100' : 'opacity-0'} />
                </button>
                <button 
                  onClick={() => setActiveTab('address')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeTab === 'address' 
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin size={18} />
                    <span>Sổ địa chỉ</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === 'address' ? 'opacity-100' : 'opacity-0'} />
                </button>
              </nav>
            </div>
            
          </div>

          {/* Right Column: Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 min-h-full">
              {activeTab === 'info' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">Thông tin cơ bản</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Họ và tên</label>
                        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all group-hover:border-indigo-300 dark:group-hover:border-indigo-700">
                          <User className="w-5 h-5 text-indigo-500 mr-4" />
                          <p className="font-semibold text-gray-900 dark:text-white text-lg">{user.fullName}</p>
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email liên hệ</label>
                        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all group-hover:border-indigo-300 dark:group-hover:border-indigo-700">
                          <Mail className="w-5 h-5 text-indigo-500 mr-4" />
                          <p className="font-semibold text-gray-900 dark:text-white truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">Bảo mật</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phân quyền tài khoản</label>
                        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 transition-all group-hover:border-green-300 dark:group-hover:border-green-700">
                          <Shield className="w-5 h-5 text-green-500 mr-4" />
                          <p className="font-semibold text-gray-900 dark:text-white">{user.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">Sổ địa chỉ của bạn</h3>
                  <AddressBook />
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
