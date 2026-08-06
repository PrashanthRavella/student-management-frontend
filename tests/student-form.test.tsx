import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { createStudent } from '../src/api/students'
import { CreateStudentPage } from '../src/pages/CreateStudentPage'

vi.mock('../src/api/students', () => ({ createStudent: vi.fn() }))

describe('create student form', () => {
  it('shows field-level messages when required values are missing', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><CreateStudentPage /></MemoryRouter>)
    await user.click(screen.getByRole('button', { name: 'Create student' }))
    expect(await screen.findByText('Student ID is required')).toBeInTheDocument()
    expect(screen.getByText('First name is required')).toBeInTheDocument()
    expect(screen.getByText('Last name is required')).toBeInTheDocument()
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
    expect(screen.getByText('Enrollment date is required')).toBeInTheDocument()
    expect(createStudent).not.toHaveBeenCalled()
  })
})

