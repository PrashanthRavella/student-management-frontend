import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Alert, Avatar, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { getApiError } from '../api/client'
import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/" replace />
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setBusy(true)
    try {
      await signIn(email, password)
      const target = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/'
      navigate(target, { replace: true })
    } catch (reason) { setError(getApiError(reason)) } finally { setBusy(false) }
  }
  return <Box minHeight="100vh" display="grid" sx={{ placeItems: 'center', p: 2, background: 'linear-gradient(135deg, #eef4ff, #f8fafc 55%, #eef2ff)' }}>
    <Paper component="form" onSubmit={submit} sx={{ p: { xs: 3, sm: 5 }, width: '100%', maxWidth: 440 }}>
      <Stack spacing={2.5} alignItems="stretch">
        <Avatar sx={{ bgcolor: 'primary.main', alignSelf: 'center' }}><LockOutlinedIcon /></Avatar>
        <Box textAlign="center"><Typography variant="h4" component="h1" fontWeight={800}>Welcome back</Typography><Typography color="text.secondary">Sign in to your student portal</Typography></Box>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Email address" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" autoComplete="current-password" required inputProps={{ minLength: 8 }} value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" variant="contained" size="large" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</Button>
        <Typography variant="caption" textAlign="center" color="text.secondary">Accounts are created by your administrator.</Typography>
      </Stack>
    </Paper>
  </Box>
}
