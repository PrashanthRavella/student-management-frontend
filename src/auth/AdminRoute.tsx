import { Alert } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function AdminRoute() {
  const { user } = useAuth()
  if (user?.role !== 'Admin') {
    return <Alert severity="warning">Administrator access is required for this page.</Alert>
  }
  return <Outlet />
}
