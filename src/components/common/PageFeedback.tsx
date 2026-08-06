import { Alert, Box, CircularProgress, Typography } from '@mui/material'

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <Box role="status" sx={{ display: 'grid', placeItems: 'center', py: 8, gap: 2 }}>
      <CircularProgress />
      <Typography color="text.secondary">{label}</Typography>
    </Box>
  )
}

export function ErrorState({ message }: { message: string }) {
  return <Alert severity="error">{message}</Alert>
}

