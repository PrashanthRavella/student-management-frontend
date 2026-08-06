import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import { Alert, Box, Grid, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { getApiError } from '../api/client'
import { getDashboardSummary } from '../api/students'
import type { DashboardSummary } from '../types/student'

const cards = [
  ['Total students', 'total_students', GroupsOutlinedIcon, '#2563eb'],
  ['Active', 'active_students', CheckCircleOutlineIcon, '#15803d'],
  ['Inactive', 'inactive_students', PauseCircleOutlineIcon, '#64748b'],
  ['Graduated', 'graduated_students', SchoolOutlinedIcon, '#7c3aed'],
  ['Suspended', 'suspended_students', WarningAmberOutlinedIcon, '#d97706'],
  ['New this month', 'new_students_this_month', GroupsOutlinedIcon, '#0891b2'],
] as const

export function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { getDashboardSummary().then(setData).catch((reason) => setError(getApiError(reason))) }, [])
  const maximum = Math.max(1, ...(data?.students_by_department.map((item) => item.count) ?? []))
  return (
    <Stack spacing={3}>
      <Box><Typography variant="h4" component="h1" fontWeight={800}>Dashboard</Typography><Typography color="text.secondary">A clear snapshot of your student community.</Typography></Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={2}>
        {cards.map(([label, key, Icon, color]) => (
          <Grid key={key} size={{ xs: 12, sm: 6, lg: 4 }}><Paper sx={{ p: 2.5 }}><Stack direction="row" alignItems="center" justifyContent="space-between"><Box><Typography color="text.secondary" variant="body2">{label}</Typography><Typography variant="h4" fontWeight={800}>{data ? data[key] : <Skeleton width={48} />}</Typography></Box><Box sx={{ display: 'grid', placeItems: 'center', p: 1.5, borderRadius: 3, bgcolor: `${color}14`, color }}><Icon /></Box></Stack></Paper></Grid>
        ))}
      </Grid>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" fontWeight={700}>Students by department</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>Longer bars represent more students.</Typography>
        {!data ? <Skeleton height={180} /> : data.students_by_department.length === 0 ? <Typography color="text.secondary">No department data yet. Add the first student to populate this chart.</Typography> : (
          <Stack spacing={2}>{data.students_by_department.map((item) => <Box key={item.department}><Stack direction="row" justifyContent="space-between"><Typography variant="body2">{item.department}</Typography><Typography variant="body2" fontWeight={700}>{item.count}</Typography></Stack><Box sx={{ height: 10, bgcolor: 'grey.200', borderRadius: 5, overflow: 'hidden', mt: 0.75 }}><Box sx={{ width: `${(item.count / maximum) * 100}%`, height: '100%', bgcolor: 'primary.main', borderRadius: 5 }} /></Box></Box>)}</Stack>
        )}
      </Paper>
    </Stack>
  )
}

