import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrincipalDashboard from './pages/PrincipalDashboard';
import ExamHeadDashboard from './pages/ExamHeadDashboard';
import TransportDashboard from './pages/TransportDashboard';
import RegistrarDashboard from './pages/RegistrarDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-brand-50/20 text-brand-900 font-sans selection:bg-brand-500 selection:text-white">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Principal Routes */}
            <Route
              path="/principal/dashboard"
              element={
                <ProtectedRoute allowedRoles={['principal', 'admin']}> {/* Admin can view principal dash too usually */}
                  <PrincipalDashboard />
                </ProtectedRoute>
              }
            />

            {/* Exam Head Routes */}
            <Route
              path="/exam-head/dashboard"
              element={
                <ProtectedRoute allowedRoles={['exam_head', 'admin']}>
                  <ExamHeadDashboard />
                </ProtectedRoute>
              }
            />

            {/* Transport Dept Routes */}
            <Route
              path="/transport/dashboard"
              element={
                <ProtectedRoute allowedRoles={['transport_dept', 'admin']}>
                  <TransportDashboard />
                </ProtectedRoute>
              }
            />

            {/* Registrar Routes */}
            <Route
              path="/registrar/dashboard"
              element={
                <ProtectedRoute allowedRoles={['registrar', 'admin']}>
                  <RegistrarDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
