import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { CreateStudentPage } from './pages/CreateStudentPage'
import { DashboardPage } from './pages/DashboardPage'
import { EditStudentPage } from './pages/EditStudentPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { StudentDetailsPage } from './pages/StudentDetailsPage'
import { StudentsPage } from './pages/StudentsPage'

export default function App() {
  return <Routes><Route element={<AppLayout />}><Route index element={<DashboardPage />} /><Route path="students" element={<StudentsPage />} /><Route path="students/new" element={<CreateStudentPage />} /><Route path="students/:id" element={<StudentDetailsPage />} /><Route path="students/:id/edit" element={<EditStudentPage />} /><Route path="*" element={<NotFoundPage />} /></Route></Routes>
}

