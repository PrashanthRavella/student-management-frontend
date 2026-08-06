import apiClient from './client'
import type { DashboardSummary, Student, StudentInput, StudentPage, StudentQuery } from '../types/student'

export async function listStudents(query: StudentQuery): Promise<StudentPage> {
  const { data } = await apiClient.get<StudentPage>('/api/v1/students', { params: query })
  return data
}

export async function getStudent(id: number): Promise<Student> {
  const { data } = await apiClient.get<Student>(`/api/v1/students/${id}`)
  return data
}

export async function createStudent(input: StudentInput): Promise<Student> {
  const { data } = await apiClient.post<Student>('/api/v1/students', cleanInput(input))
  return data
}

export async function updateStudent(id: number, input: StudentInput): Promise<Student> {
  const { data } = await apiClient.put<Student>(`/api/v1/students/${id}`, cleanInput(input))
  return data
}

export async function deleteStudent(id: number): Promise<void> {
  await apiClient.delete(`/api/v1/students/${id}`)
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>('/api/v1/dashboard/summary')
  return data
}

function cleanInput(input: StudentInput) {
  return {
    ...input,
    phone: input.phone || null,
    date_of_birth: input.date_of_birth || null,
  }
}

