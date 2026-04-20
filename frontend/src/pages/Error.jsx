import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Error() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <p className="text-8xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 text-sm mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100"
          >
            Go back
          </button>
          <Link
            to="/"
            className="px-5 py-2 bg-primary text-white rounded-md text-sm hover:opacity-90"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
