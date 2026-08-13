import apiClient from './client'
import type { AuditEvent, User, UserInput } from '../types/auth'

export async function login(email: string, password: string): Promise<User> {
  const { data } = await apiClient.post<{ user: User }>('/api/v1/auth/login', { email, password })
  return data.user
}

export async function currentUser(): Promise<User> {
  const { data } = await apiClient.get<{ user: User }>('/api/v1/auth/me')
  return data.user
}

export async function logout(): Promise<void> {
  await apiClient.post('/api/v1/auth/logout')
}

export async function listUsers(): Promise<User[]> {
  const { data } = await apiClient.get<User[]>('/api/v1/users')
  return data
}

export async function createUser(input: UserInput): Promise<User> {
  const { data } = await apiClient.post<User>('/api/v1/users', input)
  return data
}

export async function setUserActive(id: number, is_active: boolean): Promise<User> {
  const { data } = await apiClient.patch<User>(`/api/v1/users/${id}/status`, { is_active })
  return data
}

export async function listAuditEvents(): Promise<AuditEvent[]> {
  const { data } = await apiClient.get<AuditEvent[]>('/api/v1/users/audit/events')
  return data
}
