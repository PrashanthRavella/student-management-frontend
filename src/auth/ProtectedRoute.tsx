import { Box, CircularProgress } from '@mui/material'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <Box minHeight="100vh" display="grid" sx={{ placeItems: 'center' }}><CircularProgress aria-label="Checking session" /></Box>
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
