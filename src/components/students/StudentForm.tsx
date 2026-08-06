import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Grid, MenuItem, Paper, Stack, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { studentSchema } from '../../schemas/studentSchema'
import { DEPARTMENTS, STATUSES, type StudentInput } from '../../types/student'

const emptyStudent: StudentInput = {
  student_id: '', first_name: '', last_name: '', email: '', phone: '', date_of_birth: '',
  department: '', program: '', enrollment_date: '', status: 'Active',
}

interface Props {
  initialValues?: StudentInput
  submitting: boolean
  submitLabel: string
  onSubmit: (values: StudentInput) => Promise<void>
  onCancel: () => void
}

export function StudentForm({ initialValues, submitting, submitLabel, onSubmit, onCancel }: Props) {
  const { control, handleSubmit, formState: { errors } } = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialValues ?? emptyStudent,
  })
  const field = (name: keyof StudentInput, label: string, options?: { type?: string; select?: boolean; children?: React.ReactNode }) => (
    <Controller name={name} control={control} render={({ field: input }) => (
      <TextField {...input} fullWidth label={label} type={options?.type} select={options?.select} error={Boolean(errors[name])} helperText={errors[name]?.message} InputLabelProps={options?.type === 'date' ? { shrink: true } : undefined}>
        {options?.children}
      </TextField>
    )} />
  )
  return (
    <Paper component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ p: { xs: 2, sm: 3 } }}>
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6 }}>{field('student_id', 'Student ID')}</Grid>
        <Grid size={{ xs: 12, sm: 6 }}>{field('email', 'Email', { type: 'email' })}</Grid>
        <Grid size={{ xs: 12, sm: 6 }}>{field('first_name', 'First name')}</Grid>
        <Grid size={{ xs: 12, sm: 6 }}>{field('last_name', 'Last name')}</Grid>
        <Grid size={{ xs: 12, sm: 6 }}>{field('phone', 'Phone (optional)')}</Grid>
        <Grid size={{ xs: 12, sm: 6 }}>{field('date_of_birth', 'Date of birth (optional)', { type: 'date' })}</Grid>
        <Grid size={{ xs: 12, sm: 6 }}>{field('department', 'Department', { select: true, children: DEPARTMENTS.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>) })}</Grid>
        <Grid size={{ xs: 12, sm: 6 }}>{field('program', 'Program')}</Grid>
        <Grid size={{ xs: 12, sm: 6 }}>{field('enrollment_date', 'Enrollment date', { type: 'date' })}</Grid>
        <Grid size={{ xs: 12, sm: 6 }}>{field('status', 'Status', { select: true, children: STATUSES.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>) })}</Grid>
        <Grid size={12}>
          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            <Button onClick={onCancel} disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>{submitting ? 'Saving…' : submitLabel}</Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  )
}

