import { z } from 'zod'

const dateString = /^\d{4}-\d{2}-\d{2}$/
const validDate = (value: string) => dateString.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00`))

export const studentSchema = z.object({
  student_id: z.string().trim().min(2, 'Student ID is required').max(30),
  first_name: z.string().trim().min(1, 'First name is required').max(100),
  last_name: z.string().trim().min(1, 'Last name is required').max(100),
  email: z.email('Enter a valid email address').max(320),
  phone: z.string().trim().max(30),
  date_of_birth: z
    .string()
    .refine((value) => !value || validDate(value), 'Enter a valid date'),
  department: z.string().trim().min(1, 'Department is required').max(100),
  program: z.string().trim().min(1, 'Program is required').max(150),
  enrollment_date: z.string().refine(validDate, 'Enrollment date is required'),
  status: z.enum(['Active', 'Inactive', 'Graduated', 'Suspended'], {
    error: 'Select a status',
  }),
})
