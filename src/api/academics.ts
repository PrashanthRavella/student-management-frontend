import apiClient from './client'
import type { Course, StudentAcademic } from '../types/academic'

export async function listCourses(): Promise<Course[]> {
  const { data } = await apiClient.get<Course[]>('/api/v1/courses')
  return data
}

export async function createCourse(input: Pick<Course, 'code' | 'name' | 'credits' | 'description' | 'teacher_id'>): Promise<Course> {
  const { data } = await apiClient.post<Course>('/api/v1/courses', input)
  return data
}

export async function getStudentAcademics(studentId: number): Promise<StudentAcademic[]> {
  const { data } = await apiClient.get<StudentAcademic[]>(`/api/v1/courses/students/${studentId}`)
  return data
}

export async function enrollStudent(courseId: number, studentId: number) {
  const { data } = await apiClient.post(`/api/v1/courses/${courseId}/enrollments`, { student_id: studentId })
  return data
}

export async function createGrade(enrollmentId: number, input: { title: string; score: number; maximum_score: number; feedback?: string }) {
  const { data } = await apiClient.post(`/api/v1/courses/enrollments/${enrollmentId}/grades`, input)
  return data
}
