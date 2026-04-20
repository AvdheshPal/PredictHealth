import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();

  const [email, setEmail]     = useState('');
  const [status, setStatus]   = useState('idle'); // idle | loading | sent | error
  const [error, setError]     = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setStatus('loading');
    try {
      await forgotPassword(email);
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      if (err.code === 'auth/user-not-found') {
        setError('No account found with that email address.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many attempts. Please wait a few minutes and try again.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    }
  }

  if (status === 'sent') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <nav className="flex items-center px-8 py-4 border-b border-gray-200 bg-white">
          <Link to="/" className="text-xl font-bold text-primary">PredictHealth</Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-[380px] bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h1>
            <p className="text-sm text-gray-500 mb-6">
              We sent a password reset link to <strong>{email}</strong>. The link expires in 1 hour.
            </p>
            <p className="text-xs text-gray-400 mb-6">
              Didn't receive it? Check your spam folder or{' '}
              <button
                onClick={() => { setStatus('idle'); setEmail(''); }}
                className="text-primary hover:underline"
              >
                try again
              </button>.
            </p>
            <Link to="/login" className="block w-full py-2 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90 text-center">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="flex items-center px-8 py-4 border-b border-gray-200 bg-white">
        <Link to="/" className="text-xl font-bold text-primary">PredictHealth</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[380px] bg-white rounded-lg border border-gray-200 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
            <p className="text-gray-500 text-sm mt-1">
              Enter your account email and we'll send you a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-2 bg-primary text-white rounded-md font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {status === 'loading' && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {status === 'loading' ? 'Sending…' : 'Send reset link'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-5">
            Remembered it?{' '}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
