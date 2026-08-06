import { Chip } from '@mui/material'
import type { StudentStatus } from '../../types/student'

const colors = {
  Active: 'success',
  Inactive: 'default',
  Graduated: 'primary',
  Suspended: 'warning',
} as const

export function StatusChip({ status }: { status: StudentStatus }) {
  return <Chip label={status} color={colors[status]} size="small" variant="outlined" />
}

