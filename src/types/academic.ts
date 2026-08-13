export interface Course {
  id: number
  code: string
  name: string
  description: string | null
  credits: number
  teacher_id: number | null
  teacher_email: string | null
  is_active: boolean
  created_at: string
  enrolled_students: number
}

export interface GradeDetail {
  id: number
  enrollment_id: number
  title: string
  score: number
  maximum_score: number
  weight: number | null
  feedback: string | null
  graded_at: string
}

export interface StudentAcademic {
  enrollment: {
    id: number
    course_id: number
    student_id: number
    enrolled_at: string
    student_name: string
    student_number: string
  }
  course: Course
  grades: GradeDetail[]
  percentage: number | null
}
