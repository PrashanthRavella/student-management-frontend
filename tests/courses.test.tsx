import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { getStudentAcademics, listCourses } from '../src/api/academics'
import { listStudents } from '../src/api/students'
import { CoursesPage } from '../src/pages/CoursesPage'

vi.mock('../src/auth/AuthContext', () => ({ useAuth: () => ({ user: { role: 'Student', student_id: 1 } }) }))
vi.mock('../src/api/students', () => ({ listStudents: vi.fn() }))
vi.mock('../src/api/academics', () => ({ listCourses: vi.fn(), getStudentAcademics: vi.fn(), createCourse: vi.fn() }))

describe('courses and grades page', () => {
  it('shows course and grade details for the linked student', async () => {
    vi.mocked(listCourses).mockResolvedValue([])
    vi.mocked(listStudents).mockResolvedValue({ items: [{ id: 1, student_id: 'STU1', first_name: 'Maya', last_name: 'Patel' } as never], page: 1, page_size: 100, total_items: 1, total_pages: 1 })
    vi.mocked(getStudentAcademics).mockResolvedValue([{ enrollment: { id: 1, course_id: 2, student_id: 1, enrolled_at: '', student_name: 'Maya Patel', student_number: 'STU1' }, course: { id: 2, code: 'CS101', name: 'Computer Science', description: null, credits: 3, teacher_id: 4, teacher_email: 'teacher@example.edu', is_active: true, created_at: '', enrolled_students: 1 }, grades: [{ id: 1, enrollment_id: 1, title: 'Midterm', score: 88, maximum_score: 100, weight: null, feedback: 'Good work', graded_at: '' }], percentage: 88 }])
    render(<MemoryRouter><CoursesPage /></MemoryRouter>)
    expect(await screen.findByText('Computer Science')).toBeInTheDocument()
    expect(screen.getByText('88/100')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Add course' })).not.toBeInTheDocument()
  })
})
