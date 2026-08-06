export const STATUSES = ['Active', 'Inactive', 'Graduated', 'Suspended'] as const
export type StudentStatus = (typeof STATUSES)[number]

export const DEPARTMENTS = [
  'Computer Science',
  'Management Information Systems',
  'Business Administration',
  'Data Science',
  'Engineering',
  'Other',
] as const

export interface StudentInput {
  student_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  department: string
  program: string
  enrollment_date: string
  status: StudentStatus
}

export interface Student extends StudentInput {
  id: number
  created_at: string
  updated_at: string
}

export interface StudentPage {
  items: Student[]
  page: number
  page_size: number
  total_items: number
  total_pages: number
}

export interface DashboardSummary {
  total_students: number
  active_students: number
  inactive_students: number
  graduated_students: number
  suspended_students: number
  new_students_this_month: number
  students_by_department: Array<{ department: string; count: number }>
}

export interface StudentQuery {
  search?: string
  department?: string
  status?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  page_size?: number
}

