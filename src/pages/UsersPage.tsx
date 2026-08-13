import AddIcon from '@mui/icons-material/Add'
import { Alert, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { useEffect, useState, type FormEvent } from 'react'
import { createUser, listUsers, setUserActive } from '../api/auth'
import { getApiError } from '../api/client'
import { listStudents } from '../api/students'
import { useAuth } from '../auth/AuthContext'
import type { User, UserInput, UserRole } from '../types/auth'
import type { Student } from '../types/student'

const roles: UserRole[] = ['Admin', 'Teacher', 'Student', 'Parent']
const emptyForm: UserInput = { email: '', password: '', role: 'Teacher', student_id: null, assigned_student_ids: [] }

export function UsersPage() {
  const { user: current } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [form, setForm] = useState<UserInput>(emptyForm)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const load = async () => { try { const [accounts, records] = await Promise.all([listUsers(), listStudents({ page: 1, page_size: 100 })]); setUsers(accounts); setStudents(records.items) } catch (reason) { setError(getApiError(reason)) } }
  useEffect(() => { if (current?.role === 'Admin') void load() }, [current?.role])
  if (current?.role !== 'Admin') return <Alert severity="warning">Administrator access is required to manage accounts.</Alert>
  const submit = async (event: FormEvent) => { event.preventDefault(); setError(''); try { await createUser(form); setOpen(false); setForm(emptyForm); await load() } catch (reason) { setError(getApiError(reason)) } }
  const toggle = async (user: User) => { try { await setUserActive(user.id, !user.is_active); await load() } catch (reason) { setError(getApiError(reason)) } }
  return <Stack spacing={3}>
    <Stack direction="row" justifyContent="space-between" alignItems="center"><div><Typography variant="h4" component="h1" fontWeight={800}>User accounts</Typography><Typography color="text.secondary">Create accounts and control portal access.</Typography></div><Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add account</Button></Stack>
    {error && <Alert severity="error">{error}</Alert>}
    <TableContainer component={Paper}><Table><TableHead><TableRow><TableCell>User</TableCell><TableCell>Role</TableCell><TableCell>Linked record</TableCell><TableCell>Last login</TableCell><TableCell align="right">Active</TableCell></TableRow></TableHead><TableBody>{users.map((user) => <TableRow key={user.id}><TableCell><Typography fontWeight={700}>{user.email}</Typography></TableCell><TableCell><Chip label={user.role} size="small" color={user.role === 'Admin' ? 'primary' : 'default'} /></TableCell><TableCell>{user.student_id ? students.find((item) => item.id === user.student_id)?.student_id || user.student_id : '—'}</TableCell><TableCell>{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}</TableCell><TableCell align="right"><Switch checked={user.is_active} disabled={user.id === current.id} onChange={() => void toggle(user)} inputProps={{ 'aria-label': `${user.is_active ? 'Disable' : 'Enable'} ${user.email}` }} /></TableCell></TableRow>)}</TableBody></Table></TableContainer>
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm"><Stack component="form" onSubmit={submit}><DialogTitle>Create user account</DialogTitle><DialogContent><Stack spacing={2} pt={1}><TextField required type="email" label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><TextField required type="password" label="Temporary password" helperText="At least 12 characters" inputProps={{ minLength: 12 }} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><TextField select label="Role" value={form.role} onChange={(e) => setForm({ ...emptyForm, email: form.email, password: form.password, role: e.target.value as UserRole })}>{roles.map((role) => <MenuItem key={role} value={role}>{role}</MenuItem>)}</TextField>{form.role === 'Student' && <TextField required select label="Linked student" value={form.student_id || ''} onChange={(e) => setForm({ ...form, student_id: Number(e.target.value) })}>{students.map((student) => <MenuItem key={student.id} value={student.id}>{student.first_name} {student.last_name} · {student.student_id}</MenuItem>)}</TextField>}{['Teacher', 'Parent'].includes(form.role) && <TextField select SelectProps={{ multiple: true }} label={form.role === 'Teacher' ? 'Assigned students' : 'Linked children'} value={form.assigned_student_ids || []} onChange={(e) => setForm({ ...form, assigned_student_ids: typeof e.target.value === 'string' ? e.target.value.split(',').map(Number) : e.target.value })}>{students.map((student) => <MenuItem key={student.id} value={student.id}>{student.first_name} {student.last_name} · {student.student_id}</MenuItem>)}</TextField>}</Stack></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" variant="contained">Create account</Button></DialogActions></Stack></Dialog>
  </Stack>
}
