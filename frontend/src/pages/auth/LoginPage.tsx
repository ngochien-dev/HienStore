import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Mail, Lock } from 'lucide-react'
import { useAppDispatch } from '../../app/hooks'
import { setCredentials } from '../../features/auth/authSlice'
import api from '../../api/axiosClient'

export const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('') // Clear error on typing
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.username || !formData.password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu')
      return
    }

    try {
      setIsLoading(true)
      const response = await api.post('/api/auth/login', formData)
      
      const { token, userId, email, fullName, role } = response.data
      
      dispatch(setCredentials({
        user: { id: userId, email, fullName, role },
        token
      }))
      
      toast.success('Đăng nhập thành công!')
      
      // Redirect based on role
      if (role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
      
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')
      toast.error('Đăng nhập thất bại!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            Đăng nhập
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-500 p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              id="username"
              name="username"
              type="text"
              label="Email hoặc Số điện thoại"
              placeholder="nhap@email.com"
              leftIcon={<Mail size={18} />}
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Mật khẩu"
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <div>
            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              isLoading={isLoading}
            >
              Đăng nhập
            </Button>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Hoặc tiếp tục với
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                fullWidth 
                className="flex items-center justify-center bg-white dark:bg-gray-800"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
                Google
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
