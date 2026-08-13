import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
  InputAdornment, MenuItem, Pagination, Paper, Snackbar, Stack, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TextField, Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getApiError } from '../api/client'
import { deleteStudent, listStudents } from '../api/students'
import { ErrorState, LoadingState } from '../components/common/PageFeedback'
import { StatusChip } from '../components/common/StatusChip'
import { DEPARTMENTS, STATUSES, type Student, type StudentPage } from '../types/student'
import { useAuth } from '../auth/AuthContext'

export function StudentsPage() {
  const { user } = useAuth()
  const [data, setData] = useState<StudentPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('student_id:asc')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState<Student | null>(null)
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    const [sort_by, sort_order] = sort.split(':') as [string, 'asc' | 'desc']
    try { setData(await listStudents({ search: search || undefined, department: department || undefined, status: status || undefined, sort_by, sort_order, page, page_size: 10 })) }
    catch (reason) { setError(getApiError(reason)) }
    finally { setLoading(false) }
  }, [department, page, search, sort, status])
  useEffect(() => { const timer = window.setTimeout(load, 250); return () => window.clearTimeout(timer) }, [load])
  const changeFilter = (setter: (value: string) => void, value: string) => { setter(value); setPage(1) }
  const confirmDelete = async () => {
    if (!deleting) return
    try { await deleteStudent(deleting.id); setNotice(`${deleting.first_name} ${deleting.last_name} was deleted.`); setDeleting(null); await load() }
    catch (reason) { setError(getApiError(reason)); setDeleting(null) }
  }
  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2}><Box><Typography variant="h4" component="h1" fontWeight={800}>{user?.role === 'Student' ? 'My profile' : user?.role === 'Parent' ? 'My children' : 'Students'}</Typography><Typography color="text.secondary">Review the student records available to your account.</Typography></Box>{user?.role === 'Admin' && <Button component={Link} to="/students/new" variant="contained" startIcon={<AddIcon />}>Add student</Button>}</Stack>
      <Paper sx={{ p: 2 }}><Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField label="Search students" value={search} onChange={(event) => changeFilter(setSearch, event.target.value)} sx={{ flex: 1 }} InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }} />
        <TextField select label="Department" value={department} onChange={(event) => changeFilter(setDepartment, event.target.value)} sx={{ minWidth: 210 }}><MenuItem value="">All departments</MenuItem>{DEPARTMENTS.map((item) => <MenuItem value={item} key={item}>{item}</MenuItem>)}</TextField>
        <TextField select label="Status" value={status} onChange={(event) => changeFilter(setStatus, event.target.value)} sx={{ minWidth: 160 }}><MenuItem value="">All statuses</MenuItem>{STATUSES.map((item) => <MenuItem value={item} key={item}>{item}</MenuItem>)}</TextField>
        <TextField select label="Sort" value={sort} onChange={(event) => changeFilter(setSort, event.target.value)} sx={{ minWidth: 190 }}><MenuItem value="student_id:asc">Student ID (A–Z)</MenuItem><MenuItem value="last_name:asc">Last name (A–Z)</MenuItem><MenuItem value="enrollment_date:desc">Newest enrollment</MenuItem><MenuItem value="created_at:desc">Recently added</MenuItem></TextField>
      </Stack></Paper>
      {error && <ErrorState message={error} />}
      {loading ? <LoadingState label="Loading students…" /> : data?.items.length === 0 ? <Paper sx={{ p: 6, textAlign: 'center' }}><Typography variant="h6">No students found</Typography><Typography color="text.secondary" mb={2}>Try changing the filters or add a new student.</Typography><Button component={Link} to="/students/new">Add the first student</Button></Paper> : (
        <><TableContainer component={Paper}><Table aria-label="Students"><TableHead><TableRow><TableCell>Student</TableCell><TableCell>Student ID</TableCell><TableCell>Department</TableCell><TableCell>Status</TableCell><TableCell>Enrollment</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead><TableBody>{data?.items.map((student) => <TableRow key={student.id} hover><TableCell><Typography fontWeight={700}>{student.first_name} {student.last_name}</Typography><Typography variant="body2" color="text.secondary">{student.email}</Typography></TableCell><TableCell>{student.student_id}</TableCell><TableCell>{student.department}</TableCell><TableCell><StatusChip status={student.status} /></TableCell><TableCell>{new Date(`${student.enrollment_date}T00:00:00`).toLocaleDateString()}</TableCell><TableCell align="right"><IconButton component={Link} to={`/students/${student.id}`} aria-label={`View ${student.first_name}`}><VisibilityOutlinedIcon /></IconButton>{user?.role === 'Admin' && <><IconButton component={Link} to={`/students/${student.id}/edit`} aria-label={`Edit ${student.first_name}`}><EditOutlinedIcon /></IconButton><IconButton color="error" onClick={() => setDeleting(student)} aria-label={`Delete ${student.first_name}`}><DeleteOutlineIcon /></IconButton></>}</TableCell></TableRow>)}</TableBody></Table></TableContainer>{(data?.total_pages ?? 0) > 1 && <Pagination count={data?.total_pages ?? 1} page={page} onChange={(_, value) => setPage(value)} sx={{ alignSelf: 'center' }} />}</>
      )}
      <Dialog open={Boolean(deleting)} onClose={() => setDeleting(null)}><DialogTitle>Delete student?</DialogTitle><DialogContent><Typography>This permanently removes {deleting?.first_name} {deleting?.last_name}. This action cannot be undone.</Typography></DialogContent><DialogActions><Button onClick={() => setDeleting(null)}>Cancel</Button><Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button></DialogActions></Dialog>
      <Snackbar open={Boolean(notice)} autoHideDuration={4000} onClose={() => setNotice('')} message={notice} />
    </Stack>
  )
}
