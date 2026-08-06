import { Button, Paper, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <Paper sx={{ p: 6, textAlign: 'center' }}><Stack spacing={2} alignItems="center"><Typography variant="h2" fontWeight={800}>404</Typography><Typography variant="h5">Page not found</Typography><Typography color="text.secondary">The page may have moved or the address may be incorrect.</Typography><Button component={Link} to="/" variant="contained">Back to dashboard</Button></Stack></Paper>
}

