import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'

export const ProtectedAdminRoute = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  // Check if authenticated AND has role ADMIN
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
