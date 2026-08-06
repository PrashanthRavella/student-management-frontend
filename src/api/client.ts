import axios, { AxiosError } from 'axios'

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? 'http://localhost:8000' : window.location.origin),
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
})

export function getApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
    if (!error.response) return 'The server could not be reached. Please check that the API is running.'
  }
  return 'Something went wrong. Please try again.'
}

export default apiClient
