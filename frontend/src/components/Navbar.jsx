import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
      <Link to={user ? '/dashboard' : '/'} className="text-xl font-bold text-primary">
        PredictHealth
      </Link>
      {user ? (
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
          <Link to="/history" className="text-sm text-gray-600 hover:text-gray-900">History</Link>
          <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900">Profile</Link>
          <Link to="/features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
          <Link to="/predict" className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:opacity-90">
            + New prediction
          </Link>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-900">
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-4 py-2 border border-primary text-primary rounded-md text-sm hover:bg-green-50">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:opacity-90">
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
