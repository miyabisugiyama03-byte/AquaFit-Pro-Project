import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Header() {
  const { role } = useAuth();
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-white font-bold">A</div>
            <div className="text-lg font-semibold text-sky-800">AquaFit Pro</div>
          </Link>
        </div>


        <nav className="flex flex-wrap items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-blue-600">Home</Link>
          <Link to="/courses" className="text-sm font-medium hover:text-blue-600">Courses</Link>
          <Link to="/booking" className="text-sm font-medium hover:text-blue-600">Booking</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-blue-600">Contact</Link>
          <Link to="/login" className="text-sm font-medium hover:text-blue-600">Login</Link>
          {role === 'member' && <Link to="/member" className="text-sm font-medium hover:text-blue-600">Member Area</Link>}
          {role === 'instructor' && <Link to="/instructor" className="text-sm font-medium hover:text-blue-600">Instructor Area</Link>}
          {role === 'admin' && <Link to="/admin" className="text-sm font-medium hover:text-blue-600">Admin Area</Link>}
        </nav>
      </div>
    </header>
  );
}
