import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { Courses } from './pages/Courses';
import { Home } from './pages/Home';
import { Booking } from './pages/Booking';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { MemberDashboard } from './pages/MemberDashboard';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { NotAuthorized } from './pages/NotAuthorized';
import { AuthProvider } from './auth/AuthContext';
import { RequireRole } from './auth/RequireRole';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-sky-50 to-indigo-50 text-gray-900 font-sans">
          <Header />

          <main className="py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />

              <Route
                path="/member"
                element={
                  <RequireRole roles={['member']}>
                    <MemberDashboard />
                  </RequireRole>
                }
              />
              <Route
                path="/instructor"
                element={
                  <RequireRole roles={['instructor']}>
                    <InstructorDashboard />
                  </RequireRole>
                }
              />
              <Route
                path="/admin"
                element={
                  <RequireRole roles={['admin']}>
                    <AdminDashboard />
                  </RequireRole>
                }
              />
              <Route path="/not-authorized" element={<NotAuthorized />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
