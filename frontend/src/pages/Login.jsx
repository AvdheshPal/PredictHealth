import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FIREBASE_ERRORS = {
  'auth/user-not-found':     'No account found with this email.',
  'auth/wrong-password':     'Incorrect password.',
  'auth/invalid-email':      'Please enter a valid email address.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/too-many-requests':  'Too many attempts. Please wait and try again.',
  'auth/user-disabled':      'This account has been disabled. Contact support.',
};

export default function Login() {
  const navigate = useNavigate();
  const { login, user, loading: authLoading } = useAuth();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  // Redirect already-authenticated verified users
  useEffect(() => {
    if (!authLoading && user?.emailVerified) navigate('/dashboard', { replace: true });
    if (!authLoading && user && !user.emailVerified) navigate('/verify-email', { replace: true });
  }, [user, authLoading, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const u = await login(email, password);
      if (!u.emailVerified) {
        navigate('/verify-email');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(FIREBASE_ERRORS[err.code] ?? 'Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
        <Link to="/" className="text-xl font-bold text-primary">PredictHealth</Link>
        <Link to="/register" className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:opacity-90">
          Register
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[380px] bg-white rounded-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1 mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end text-sm">
              <Link to="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary text-white rounded-md font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-3 text-xs text-gray-400">or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <p className="text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
