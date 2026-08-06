import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteStudent, listStudents } from '../src/api/students'
import { StudentsPage } from '../src/pages/StudentsPage'
import type { Student } from '../src/types/student'

vi.mock('../src/api/students', () => ({
  listStudents: vi.fn(),
  deleteStudent: vi.fn(),
}))

const student: Student = {
  id: 1,
  student_id: 'STU0001',
  first_name: 'Maya',
  last_name: 'Patel',
  email: 'maya@example.edu',
  phone: '',
  date_of_birth: '2001-02-03',
  department: 'Data Science',
  program: 'MSc Data Science',
  enrollment_date: '2025-08-20',
  status: 'Active',
  created_at: '2026-08-01T12:00:00Z',
  updated_at: '2026-08-01T12:00:00Z',
}

function renderPage() {
  return render(<MemoryRouter><StudentsPage /></MemoryRouter>)
}

describe('students page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(listStudents).mockResolvedValue({ items: [student], page: 1, page_size: 10, total_items: 1, total_pages: 1 })
    vi.mocked(deleteStudent).mockResolvedValue()
  })

  it('renders student data in the table', async () => {
    renderPage()
    expect(await screen.findByText('Maya Patel')).toBeInTheDocument()
    expect(screen.getByText('STU0001')).toBeInTheDocument()
    expect(screen.getByText('Data Science')).toBeInTheDocument()
  })

  it('shows a loading state while the API is pending', () => {
    vi.mocked(listStudents).mockReturnValue(new Promise(() => undefined))
    renderPage()
    expect(screen.getByRole('status')).toHaveTextContent('Loading students')
  })

  it('shows a helpful empty state', async () => {
    vi.mocked(listStudents).mockResolvedValue({ items: [], page: 1, page_size: 10, total_items: 0, total_pages: 0 })
    renderPage()
    expect(await screen.findByText('No students found')).toBeInTheDocument()
  })

  it('shows a user-friendly API error state', async () => {
    vi.mocked(listStudents).mockRejectedValue(new Error('network detail'))
    renderPage()
    expect(await screen.findByText('Something went wrong. Please try again.')).toBeInTheDocument()
  })

  it('asks for confirmation before deleting', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(await screen.findByRole('button', { name: 'Delete Maya' }))
    expect(screen.getByRole('dialog')).toHaveTextContent('Delete student?')
    expect(deleteStudent).not.toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await waitFor(() => expect(deleteStudent).toHaveBeenCalledWith(1))
  })
})

