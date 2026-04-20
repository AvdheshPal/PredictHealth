import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { verifyPasswordResetCode } from 'firebase/auth';

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const oobCode = searchParams.get('oobCode');

  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [confirm, setConfirm]         = useState('');
  const [status, setStatus]           = useState('verifying'); // verifying | ready | loading | success | invalid
  const [error, setError]             = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setStatus('invalid');
      return;
    }
    verifyPasswordResetCode(auth, oobCode)
      .then((emailFromCode) => {
        setEmail(emailFromCode);
        setStatus('ready');
      })
      .catch(() => {
        setStatus('invalid');
      });
  }, [oobCode]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setStatus('loading');
    try {
      await resetPassword(oobCode, password);
      setStatus('success');
    } catch (err) {
      setStatus('ready');
      if (err.code === 'auth/expired-action-code') {
        setError('This reset link has expired. Please request a new one.');
      } else if (err.code === 'auth/invalid-action-code') {
        setError('This reset link is invalid or has already been used.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    }
  }

  // ── Invalid / expired link ──────────────────────────────────────────────────
  if (status === 'invalid') {
    return (
      <PageShell>
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Link invalid or expired</h1>
          <p className="text-sm text-gray-500 mb-6">
            This password reset link has expired or already been used. Reset links are valid for 1 hour.
          </p>
          <Link to="/forgot-password" className="block w-full py-2 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90 text-center">
            Request a new link
          </Link>
          <Link to="/login" className="block mt-3 text-sm text-primary hover:underline text-center">
            Back to sign in
          </Link>
        </div>
      </PageShell>
    );
  }

  // ── Verifying oobCode ───────────────────────────────────────────────────────
  if (status === 'verifying') {
    return (
      <PageShell>
        <div className="text-center py-4">
          <svg className="animate-spin h-8 w-8 text-primary mx-auto mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm text-gray-500">Verifying reset link…</p>
        </div>
      </PageShell>
    );
  }

  // ── Success ─────────────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <PageShell>
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Password updated!</h1>
          <p className="text-sm text-gray-500 mb-6">
            Your password has been changed. You can now sign in with your new password.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="block w-full py-2 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90 text-center"
          >
            Sign in
          </button>
        </div>
      </PageShell>
    );
  }

  // ── Reset form ──────────────────────────────────────────────────────────────
  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
        {email && (
          <p className="text-gray-500 text-sm mt-1">
            Resetting password for <strong>{email}</strong>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
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

          {/* Strength indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      passwordStrength(password) >= level
                        ? level <= 1 ? 'bg-red-400' : level <= 2 ? 'bg-amber-400' : level <= 3 ? 'bg-yellow-400' : 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">{strengthLabel(password)}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat new password"
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {confirm && password !== confirm && (
            <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
          )}
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={status === 'loading' || (confirm && password !== confirm)}
          className="w-full py-2 bg-primary text-white rounded-md font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {status === 'loading' && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          {status === 'loading' ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </PageShell>
  );
}

function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 6)  score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

function strengthLabel(pw) {
  const s = passwordStrength(pw);
  return ['', 'Weak', 'Fair', 'Good', 'Strong'][s] ?? '';
}

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="flex items-center px-8 py-4 border-b border-gray-200 bg-white">
        <Link to="/" className="text-xl font-bold text-primary">PredictHealth</Link>
      </nav>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[380px] bg-white rounded-lg border border-gray-200 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
