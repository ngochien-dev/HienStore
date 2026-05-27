import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle } from 'lucide-react'
import api from '../../api/axiosClient'

export const ForgotPasswordPage = () => {
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await api.post(`/api/auth/forgot-password?email=${email}`)
      setSuccess(res.data)
      setStep(2)
    } catch (err: any) {
      setError(err.response?.data || 'Không thể gửi email. Vui lòng kiểm tra lại!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!')
      return
    }
    
    setIsLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await api.post(`/api/auth/reset-password?token=${token}&newPassword=${newPassword}`)
      setSuccess(res.data)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data || 'Mã xác nhận không hợp lệ hoặc đã hết hạn!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden">
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800 p-8 relative z-10">
        
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block mb-6">
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              HienStore
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-heading">
            Khôi phục mật khẩu
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {step === 1 ? 'Nhập email của bạn để nhận mã khôi phục.' : 'Nhập mã gồm 6 chữ số và mật khẩu mới.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 text-sm font-medium animate-fade-in">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 text-sm font-medium animate-fade-in flex items-center gap-2">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
              Gửi mã xác nhận
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5 animate-fade-in-up">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Mã xác nhận (6 số)</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                maxLength={6}
                placeholder="123456"
                className="w-full px-4 py-3.5 text-center tracking-[0.5em] font-bold text-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Mật khẩu mới</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Xác nhận mật khẩu</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 dark:bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex justify-center items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
              Đổi mật khẩu
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft size={16} /> Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}
