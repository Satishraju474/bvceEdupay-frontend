import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import LibrarianDashboard from './pages/LibrarianDashboard';
import PlacementDashboard from './pages/PlacementDashboard';
import HostelDashboard from './pages/HostelDashboard';
import AdmissionDashboard from './pages/AdmissionDashboard'; // Added
import SpecialThanks from './pages/SpecialThanks';
import Home from './pages/Home';
import Footer from './components/Footer';

function AppContent() {
  const location = useLocation();
  const isSpecialThanks = location.pathname === '/special-thanks';

  return (
    <div className="min-h-screen flex flex-col bg-brand-50/20 text-brand-900 font-sans selection:bg-brand-500 selection:text-white">
      {!isSpecialThanks && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
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

          {/* Librarian Routes */}
          <Route
            path="/librarian/dashboard"
            element={
              <ProtectedRoute allowedRoles={['librarian', 'admin']}>
                <LibrarianDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admission Routes */}
          <Route
            path="/admission/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admission_officer', 'admin']}>
                <AdmissionDashboard />
              </ProtectedRoute>
            }
          />

          {/* Placement Routes */}
          <Route
            path="/placement/dashboard"
            element={
              <ProtectedRoute allowedRoles={['placement_officer', 'admin']}>
                <PlacementDashboard />
              </ProtectedRoute>
            }
          />

          {/* Hostel Routes */}
          <Route
            path="/hostel/dashboard"
            element={
              <ProtectedRoute allowedRoles={['hostel_manager', 'admin']}>
                <HostelDashboard />
              </ProtectedRoute>
            }
          />

          {/* Special Thanks Route */}
          <Route path="/special-thanks" element={<SpecialThanks />} />

          {/* Default Route */}

        </Routes>
      </main>
      {!isSpecialThanks && <Footer />}
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
