import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { LoginPage } from '../src/pages/LoginPage'

const signIn = vi.fn()
vi.mock('../src/auth/AuthContext', () => ({
  useAuth: () => ({ user: null, signIn }),
}))

describe('login page', () => {
  it('submits local account credentials', async () => {
    signIn.mockResolvedValue(undefined)
    render(<MemoryRouter><LoginPage /></MemoryRouter>)
    fireEvent.change(screen.getByLabelText(/Email address/), { target: { value: 'teacher@example.edu' } })
    fireEvent.change(screen.getByLabelText(/Password/), { target: { value: 'TeacherPassword123!' } })
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }))
    await waitFor(() => expect(signIn).toHaveBeenCalledWith('teacher@example.edu', 'TeacherPassword123!'))
  })
})
