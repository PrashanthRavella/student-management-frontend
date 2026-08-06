import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getDashboardSummary } from '../src/api/students'
import { DashboardPage } from '../src/pages/DashboardPage'

vi.mock('../src/api/students', () => ({ getDashboardSummary: vi.fn() }))

describe('application dashboard', () => {
  beforeEach(() => {
    vi.mocked(getDashboardSummary).mockResolvedValue({
      total_students: 15,
      active_students: 8,
      inactive_students: 2,
      graduated_students: 3,
      suspended_students: 2,
      new_students_this_month: 4,
      students_by_department: [{ department: 'Computer Science', count: 5 }],
    })
  })

  it('renders the application dashboard and summary data', async () => {
    render(<MemoryRouter><DashboardPage /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(await screen.findByText('15')).toBeInTheDocument()
    expect(screen.getByText('Computer Science')).toBeInTheDocument()
  })
})

