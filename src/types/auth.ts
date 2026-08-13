export type UserRole = 'Admin' | 'Teacher' | 'Student' | 'Parent'

export interface User {
  id: number
  email: string
  role: UserRole
  is_active: boolean
  student_id: number | null
  last_login_at: string | null
  created_at: string
}

export interface UserInput {
  email: string
  password: string
  role: UserRole
  student_id?: number | null
  assigned_student_ids?: number[]
}

export interface AuditEvent {
  id: number
  actor_user_id: number | null
  action: string
  target_type: string | null
  target_id: string | null
  outcome: string
  created_at: string
}
