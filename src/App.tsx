import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { AdminRoute } from './auth/AdminRoute'
import { AppLayout } from './components/layout/AppLayout'
import { CreateStudentPage } from './pages/CreateStudentPage'
import { DashboardPage } from './pages/DashboardPage'
import { EditStudentPage } from './pages/EditStudentPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { StudentDetailsPage } from './pages/StudentDetailsPage'
import { StudentsPage } from './pages/StudentsPage'
import { LoginPage } from './pages/LoginPage'
import { CoursesPage } from './pages/CoursesPage'
import { UsersPage } from './pages/UsersPage'
import { ActivityPage } from './pages/ActivityPage'

export default function App() {
  return <Routes><Route path="login" element={<LoginPage />} /><Route element={<ProtectedRoute />}><Route element={<AppLayout />}><Route index element={<DashboardPage />} /><Route path="students" element={<StudentsPage />} /><Route path="students/:id" element={<StudentDetailsPage />} /><Route path="courses" element={<CoursesPage />} /><Route element={<AdminRoute />}><Route path="students/new" element={<CreateStudentPage />} /><Route path="students/:id/edit" element={<EditStudentPage />} /><Route path="users" element={<UsersPage />} /><Route path="activity" element={<ActivityPage />} /></Route><Route path="*" element={<NotFoundPage />} /></Route></Route></Routes>
}
