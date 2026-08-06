import { Alert, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getApiError } from '../api/client'
import { createStudent } from '../api/students'
import { StudentForm } from '../components/students/StudentForm'
import type { StudentInput } from '../types/student'

export function CreateStudentPage() {
  const navigate = useNavigate(); const [submitting, setSubmitting] = useState(false); const [error, setError] = useState('')
  const submit = async (values: StudentInput) => { setSubmitting(true); setError(''); try { const student = await createStudent(values); navigate(`/students/${student.id}`, { state: { notice: 'Student created successfully.' } }) } catch (reason) { setError(getApiError(reason)); setSubmitting(false) } }
  return <Stack spacing={3}><div><Typography variant="h4" component="h1" fontWeight={800}>Add student</Typography><Typography color="text.secondary">Create a complete student record. Required fields are validated.</Typography></div>{error && <Alert severity="error">{error}</Alert>}<StudentForm submitting={submitting} submitLabel="Create student" onSubmit={submit} onCancel={() => navigate('/students')} /></Stack>
}

