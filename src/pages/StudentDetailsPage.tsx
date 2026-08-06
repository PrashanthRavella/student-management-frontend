import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { Alert, Box, Button, Divider, Grid, Paper, Snackbar, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getApiError } from '../api/client'
import { getStudent } from '../api/students'
import { LoadingState } from '../components/common/PageFeedback'
import { StatusChip } from '../components/common/StatusChip'
import type { Student } from '../types/student'

export function StudentDetailsPage() {
  const { id } = useParams(); const location = useLocation(); const [student, setStudent] = useState<Student | null>(null); const [error, setError] = useState(''); const [notice, setNotice] = useState((location.state as { notice?: string } | null)?.notice ?? '')
  useEffect(() => { getStudent(Number(id)).then(setStudent).catch((reason) => setError(getApiError(reason))) }, [id])
  if (!student && !error) return <LoadingState label="Loading student details…" />
  if (error) return <Alert severity="error">{error}</Alert>
  const fields = student ? [['Student ID', student.student_id], ['Email', student.email], ['Phone', student.phone || 'Not provided'], ['Date of birth', student.date_of_birth || 'Not provided'], ['Department', student.department], ['Program', student.program], ['Enrollment date', student.enrollment_date], ['Created', new Date(student.created_at).toLocaleString()], ['Last updated', new Date(student.updated_at).toLocaleString()]] : []
  return student && <Stack spacing={3}><Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}><Box><Button component={Link} to="/students" startIcon={<ArrowBackIcon />}>All students</Button><Typography variant="h4" component="h1" fontWeight={800} mt={1}>{student.first_name} {student.last_name}</Typography><StatusChip status={student.status} /></Box><Button component={Link} to={`/students/${id}/edit`} variant="contained" startIcon={<EditIcon />} sx={{ alignSelf: 'flex-start' }}>Edit student</Button></Stack><Paper sx={{ p: { xs: 2, sm: 3 } }}><Typography variant="h6" fontWeight={700}>Student information</Typography><Divider sx={{ my: 2 }} /><Grid container spacing={3}>{fields.map(([label, value]) => <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}><Typography variant="caption" color="text.secondary" textTransform="uppercase">{label}</Typography><Typography>{value}</Typography></Grid>)}</Grid></Paper><Snackbar open={Boolean(notice)} autoHideDuration={4000} onClose={() => setNotice('')} message={notice} /></Stack>
}

