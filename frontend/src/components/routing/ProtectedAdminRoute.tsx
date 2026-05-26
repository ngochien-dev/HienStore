import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'

export const ProtectedAdminRoute = () => {
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // Check if authenticated AND has role ADMIN
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
