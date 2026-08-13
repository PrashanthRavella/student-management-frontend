import AddIcon from '@mui/icons-material/Add'
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'
import { Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, LinearProgress, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { createCourse, createGrade, enrollStudent, getStudentAcademics, listCourses } from '../api/academics'
import { getApiError } from '../api/client'
import { listStudents } from '../api/students'
import { useAuth } from '../auth/AuthContext'
import { listUsers } from '../api/auth'
import type { Course, StudentAcademic } from '../types/academic'
import type { User } from '../types/auth'
import type { Student } from '../types/student'

export function CoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<User[]>([])
  const [selectedStudent, setSelectedStudent] = useState<number | ''>(user?.student_id ?? '')
  const [academics, setAcademics] = useState<StudentAcademic[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [gradeFor, setGradeFor] = useState<StudentAcademic | null>(null)
  const [grade, setGrade] = useState({ title: '', score: 0, maximum_score: 100, feedback: '' })
  const [form, setForm] = useState({ code: '', name: '', credits: 3, description: '', teacher_id: null as number | null })

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const courseData = await listCourses(); setCourses(courseData)
      const studentData = await listStudents({ page: 1, page_size: 100 }); setStudents(studentData.items)
      if (user?.role === 'Admin') setTeachers((await listUsers()).filter((account) => account.role === 'Teacher' && account.is_active))
      const target = selectedStudent || user?.student_id || studentData.items[0]?.id
      if (target) { setSelectedStudent(target); setAcademics(await getStudentAcademics(Number(target))) }
    } catch (reason) { setError(getApiError(reason)) } finally { setLoading(false) }
  }, [selectedStudent, user?.role, user?.student_id])
  useEffect(() => { void load() }, [load])
  const changeStudent = async (id: number) => {
    setSelectedStudent(id); setError('')
    try { setAcademics(await getStudentAcademics(id)) } catch (reason) { setError(getApiError(reason)) }
  }
  const submitCourse = async (event: FormEvent) => {
    event.preventDefault()
    try { await createCourse(form); setOpen(false); setForm({ code: '', name: '', credits: 3, description: '', teacher_id: null }); await load() }
    catch (reason) { setError(getApiError(reason)) }
  }
  const submitGrade = async (event: FormEvent) => {
    event.preventDefault()
    if (!gradeFor) return
    try { await createGrade(gradeFor.enrollment.id, grade); setGradeFor(null); setGrade({ title: '', score: 0, maximum_score: 100, feedback: '' }); await changeStudent(Number(selectedStudent)) }
    catch (reason) { setError(getApiError(reason)) }
  }
  const enroll = async (courseId: number) => {
    if (!selectedStudent) return
    try { await enrollStudent(courseId, Number(selectedStudent)); await changeStudent(Number(selectedStudent)) }
    catch (reason) { setError(getApiError(reason)) }
  }
  return <Stack spacing={3}>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}><Box><Typography variant="h4" component="h1" fontWeight={800}>Courses & grades</Typography><Typography color="text.secondary">Academic progress, course enrollment, and assessment details.</Typography></Box>{user?.role === 'Admin' && <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add course</Button>}</Stack>
    {error && <Alert severity="error">{error}</Alert>}{loading && <LinearProgress />}
    <Stack direction="row" gap={1} flexWrap="wrap">{courses.map((course) => <Chip key={course.id} label={`${course.code} · ${course.name}`} variant="outlined" onClick={user?.role === 'Admin' || user?.role === 'Teacher' ? () => void enroll(course.id) : undefined} />)}</Stack>
    <Paper sx={{ p: 2 }}><Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ md: 'center' }} gap={2}><Typography fontWeight={700}>Student academic record</Typography><TextField select size="small" label="Student" value={selectedStudent} onChange={(e) => void changeStudent(Number(e.target.value))} sx={{ minWidth: 280 }}>{students.map((student) => <MenuItem key={student.id} value={student.id}>{student.first_name} {student.last_name} · {student.student_id}</MenuItem>)}</TextField></Stack></Paper>
    {academics.length > 0 ? <Grid container spacing={2}>{academics.map((item) => <Grid key={item.enrollment.id} size={{ xs: 12, lg: 6 }}><Card sx={{ height: '100%' }}><CardContent><Stack spacing={2}><Stack direction="row" justifyContent="space-between"><Box><Typography variant="overline" color="primary">{item.course.code}</Typography><Typography variant="h6" fontWeight={800}>{item.course.name}</Typography></Box><Chip label={item.percentage === null ? 'Not graded' : `${item.percentage}%`} color={item.percentage !== null && item.percentage >= 70 ? 'success' : 'default'} /></Stack><Typography variant="body2" color="text.secondary">{item.course.credits} credits · {item.course.teacher_email || 'Teacher not assigned'}</Typography>{item.grades.length === 0 ? <Typography color="text.secondary">No grade details yet.</Typography> : item.grades.map((grade) => <Paper variant="outlined" key={grade.id} sx={{ p: 1.5 }}><Stack direction="row" justifyContent="space-between"><Typography fontWeight={700}>{grade.title}</Typography><Typography fontWeight={800}>{grade.score}/{grade.maximum_score}</Typography></Stack>{grade.feedback && <Typography variant="body2" color="text.secondary">{grade.feedback}</Typography>}</Paper>)}{(user?.role === 'Admin' || user?.role === 'Teacher') && <Button size="small" onClick={() => setGradeFor(item)}>Add grade detail</Button>}</Stack></CardContent></Card></Grid>)}</Grid> : !loading && <Paper sx={{ p: 6, textAlign: 'center' }}><MenuBookOutlinedIcon color="disabled" sx={{ fontSize: 48 }} /><Typography variant="h6">No courses to display</Typography><Typography color="text.secondary">Course enrollment and grade details will appear here.</Typography></Paper>}
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm"><Box component="form" onSubmit={submitCourse}><DialogTitle>Add course</DialogTitle><DialogContent><Stack spacing={2} pt={1}><TextField required label="Course code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /><TextField required label="Course name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><TextField required label="Credits" type="number" inputProps={{ min: 1, max: 12 }} value={form.credits} onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })} /><TextField select label="Assigned teacher" value={form.teacher_id || ''} onChange={(e) => setForm({ ...form, teacher_id: e.target.value ? Number(e.target.value) : null })}><MenuItem value="">Not assigned</MenuItem>{teachers.map((teacher) => <MenuItem key={teacher.id} value={teacher.id}>{teacher.email}</MenuItem>)}</TextField><TextField label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Stack></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" variant="contained">Create course</Button></DialogActions></Box></Dialog>
    <Dialog open={Boolean(gradeFor)} onClose={() => setGradeFor(null)} fullWidth maxWidth="sm"><Box component="form" onSubmit={submitGrade}><DialogTitle>Add grade detail</DialogTitle><DialogContent><Stack spacing={2} pt={1}><TextField required label="Assessment" value={grade.title} onChange={(e) => setGrade({ ...grade, title: e.target.value })} /><Stack direction="row" spacing={2}><TextField required label="Score" type="number" inputProps={{ min: 0, step: .01 }} value={grade.score} onChange={(e) => setGrade({ ...grade, score: Number(e.target.value) })} /><TextField required label="Maximum score" type="number" inputProps={{ min: .01, step: .01 }} value={grade.maximum_score} onChange={(e) => setGrade({ ...grade, maximum_score: Number(e.target.value) })} /></Stack><TextField label="Feedback" multiline rows={3} value={grade.feedback} onChange={(e) => setGrade({ ...grade, feedback: e.target.value })} /></Stack></DialogContent><DialogActions><Button onClick={() => setGradeFor(null)}>Cancel</Button><Button type="submit" variant="contained">Save grade</Button></DialogActions></Box></Dialog>
  </Stack>
}
