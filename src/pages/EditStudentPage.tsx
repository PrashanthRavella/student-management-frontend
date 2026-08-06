import { Alert, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getApiError } from '../api/client'
import { getStudent, updateStudent } from '../api/students'
import { LoadingState } from '../components/common/PageFeedback'
import { StudentForm } from '../components/students/StudentForm'
import type { Student, StudentInput } from '../types/student'

export function EditStudentPage() {
  const { id } = useParams(); const navigate = useNavigate(); const [student, setStudent] = useState<Student | null>(null); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false)
  useEffect(() => { getStudent(Number(id)).then(setStudent).catch((reason) => setError(getApiError(reason))) }, [id])
  const submit = async (values: StudentInput) => { setSubmitting(true); try { await updateStudent(Number(id), values); navigate(`/students/${id}`, { state: { notice: 'Student updated successfully.' } }) } catch (reason) { setError(getApiError(reason)); setSubmitting(false) } }
  if (!student && !error) return <LoadingState label="Loading student…" />
  return <Stack spacing={3}><div><Typography variant="h4" component="h1" fontWeight={800}>Edit student</Typography><Typography color="text.secondary">Update the record and save your changes.</Typography></div>{error && <Alert severity="error">{error}</Alert>}{student && <StudentForm initialValues={student} submitting={submitting} submitLabel="Save changes" onSubmit={submit} onCancel={() => navigate(`/students/${id}`)} />}</Stack>
}

