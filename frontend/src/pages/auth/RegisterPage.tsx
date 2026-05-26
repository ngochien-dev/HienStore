import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Mail, Lock, User, Phone } from 'lucide-react'
import api from '../../api/axiosClient'

export const RegisterPage = () => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    try {
      setIsLoading(true)
      
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      }
      
      await api.post('/api/auth/register', payload)
      
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.')
      navigate('/login')
      
    } catch (err: any) {
      console.error('Register error:', err)
      
      // Handle validation errors from backend
      if (err.response?.data?.validationErrors) {
        const errors = err.response.data.validationErrors
        const firstError = Object.values(errors)[0] as string
        setError(firstError)
      } else {
        setError(err.response?.data?.message || 'Đăng ký thất bại. Email hoặc số điện thoại có thể đã tồn tại.')
      }
      toast.error('Đăng ký thất bại!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Đăng nhập
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
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                name="firstName"
                type="text"
                label="Tên"
                placeholder="Ngọc Hiển"
                leftIcon={<User size={18} />}
                value={formData.firstName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
              <Input
                id="lastName"
                name="lastName"
                type="text"
                label="Họ"
                placeholder="Nguyễn"
                value={formData.lastName}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="nhap@email.com"
              leftIcon={<Mail size={18} />}
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            
            <Input
              id="phone"
              name="phone"
              type="tel"
              label="Số điện thoại"
              placeholder="0123456789"
              leftIcon={<Phone size={18} />}
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Mật khẩu"
              placeholder="Ít nhất 6 ký tự"
              leftIcon={<Lock size={18} />}
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
            
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Xác nhận mật khẩu"
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              isLoading={isLoading}
            >
              Đăng ký
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
