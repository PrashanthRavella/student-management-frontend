import { Alert, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { listAuditEvents } from '../api/auth'
import { getApiError } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import type { AuditEvent } from '../types/auth'

export function ActivityPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [error, setError] = useState('')
  useEffect(() => { if (user?.role === 'Admin') listAuditEvents().then(setEvents).catch((reason) => setError(getApiError(reason))) }, [user?.role])
  if (user?.role !== 'Admin') return <Alert severity="warning">Administrator access is required to view activity.</Alert>
  return <Stack spacing={3}><div><Typography variant="h4" component="h1" fontWeight={800}>Security activity</Typography><Typography color="text.secondary">Recent account and data-changing events. Passwords and session tokens are never recorded.</Typography></div>{error && <Alert severity="error">{error}</Alert>}<TableContainer component={Paper}><Table><TableHead><TableRow><TableCell>Time</TableCell><TableCell>Action</TableCell><TableCell>Target</TableCell><TableCell>Actor</TableCell><TableCell>Outcome</TableCell></TableRow></TableHead><TableBody>{events.map((event) => <TableRow key={event.id}><TableCell>{new Date(event.created_at).toLocaleString()}</TableCell><TableCell>{event.action.replaceAll('.', ' ')}</TableCell><TableCell>{event.target_type ? `${event.target_type} #${event.target_id}` : '—'}</TableCell><TableCell>{event.actor_user_id || 'Anonymous'}</TableCell><TableCell><Chip size="small" label={event.outcome} color={event.outcome === 'success' ? 'success' : 'warning'} /></TableCell></TableRow>)}</TableBody></Table></TableContainer></Stack>
}
