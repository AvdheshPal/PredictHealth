/**
 * Central handler for all Firebase email action links.
 * Firebase redirects here when users click links in:
 *   - Password reset emails   (mode=resetPassword)
 *   - Email verification emails (mode=verifyEmail)
 *   - Email recovery emails   (mode=recoverEmail)
 *
 * In Firebase console → Authentication → Templates → (each template) →
 * set "Action URL" to:  http://localhost:5173/auth/action
 */
import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function AuthAction() {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const { user }        = useAuth();

  const mode    = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');

  // ── Route to the right sub-handler ─────────────────────────────────────────
  if (!mode || !oobCode) {
    return <InvalidAction message="Missing action code. This link is incomplete." />;
  }

  if (mode === 'resetPassword') return <HandleResetPassword oobCode={oobCode} navigate={navigate} />;
  if (mode === 'verifyEmail')   return <HandleVerifyEmail   oobCode={oobCode} navigate={navigate} user={user} />;
  if (mode === 'recoverEmail')  return <HandleRecoverEmail  oobCode={oobCode} navigate={navigate} />;

  return <InvalidAction message={`Unknown action mode: "${mode}".`} />;
}

// ── Verify Email ──────────────────────────────────────────────────────────────
function HandleVerifyEmail({ oobCode, navigate, user }) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    applyActionCode(auth, oobCode)
      .then(async () => {
        await auth.currentUser?.reload();
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [oobCode]);

  if (status === 'loading') return <LoadingShell message="Verifying your email…" />;

  if (status === 'success') {
    return (
      <PageShell>
        <div className="text-center">
          <SuccessIcon />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Email verified!</h1>
          <p className="text-sm text-gray-500 mb-6">
            Your email address has been confirmed. You can now access all features.
          </p>
          <button
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            className="block w-full py-2 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90 text-center"
          >
            {user ? 'Go to dashboard' : 'Sign in'}
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="text-center">
        <ErrorIcon />
        <h1 className="text-xl font-bold text-gray-900 mb-2">Verification failed</h1>
        <p className="text-sm text-gray-500 mb-6">
          The verification link has expired or already been used. Sign in and request a new one.
        </p>
        <Link to="/login" className="block w-full py-2 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90 text-center">
          Sign in
        </Link>
      </div>
    </PageShell>
  );
}

// ── Reset Password ────────────────────────────────────────────────────────────
function HandleResetPassword({ oobCode, navigate }) {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [status, setStatus]         = useState('loading');
  const [error, setError]           = useState('');
  const [showPw, setShowPw]         = useState(false);

  useEffect(() => {
    verifyPasswordResetCode(auth, oobCode)
      .then((e) => { setEmail(e); setStatus('ready'); })
      .catch(() => setStatus('invalid'));
  }, [oobCode]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setStatus('submitting');
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStatus('success');
    } catch (err) {
      setStatus('ready');
      setError(err.code === 'auth/weak-password' ? 'Choose a stronger password.' : 'Reset failed. Please try again.');
    }
  }

  if (status === 'loading')  return <LoadingShell message="Verifying reset link…" />;
  if (status === 'invalid')  return (
    <PageShell>
      <div className="text-center">
        <ErrorIcon />
        <h1 className="text-xl font-bold text-gray-900 mb-2">Link expired</h1>
        <p className="text-sm text-gray-500 mb-6">This reset link has expired or already been used.</p>
        <Link to="/forgot-password" className="block w-full py-2 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90 text-center">
          Request a new link
        </Link>
      </div>
    </PageShell>
  );

  if (status === 'success') return (
    <PageShell>
      <div className="text-center">
        <SuccessIcon />
        <h1 className="text-xl font-bold text-gray-900 mb-2">Password updated!</h1>
        <p className="text-sm text-gray-500 mb-6">You can now sign in with your new password.</p>
        <button onClick={() => navigate('/login')} className="block w-full py-2 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90 text-center">
          Sign in
        </button>
      </div>
    </PageShell>
  );

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Set new password</h1>
        {email && <p className="text-gray-500 text-sm mt-1">For <strong>{email}</strong></p>}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              required autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10"
            />
            <button type="button" onClick={() => setShowPw(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showPw
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                }
              </svg>
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
          <input
            type={showPw ? 'text' : 'password'}
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {confirm && password !== confirm && <p className="text-xs text-red-500 mt-1">Doesn't match</p>}
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full py-2 bg-primary text-white rounded-md font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {status === 'submitting' && <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>}
          {status === 'submitting' ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </PageShell>
  );
}

// ── Recover Email ─────────────────────────────────────────────────────────────
function HandleRecoverEmail({ oobCode, navigate }) {
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    applyActionCode(auth, oobCode)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [oobCode]);

  if (status === 'loading') return <LoadingShell message="Recovering your email…" />;

  return (
    <PageShell>
      <div className="text-center">
        {status === 'success' ? <SuccessIcon /> : <ErrorIcon />}
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {status === 'success' ? 'Email recovered' : 'Recovery failed'}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {status === 'success'
            ? 'Your email address has been restored. Please reset your password to secure your account.'
            : 'The recovery link is invalid or has expired.'}
        </p>
        <Link
          to={status === 'success' ? '/forgot-password' : '/login'}
          className="block w-full py-2 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90 text-center"
        >
          {status === 'success' ? 'Reset password' : 'Back to sign in'}
        </Link>
      </div>
    </PageShell>
  );
}

// ── Shared UI helpers ─────────────────────────────────────────────────────────
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

function LoadingShell({ message }) {
  return (
    <PageShell>
      <div className="text-center py-4">
        <svg className="animate-spin h-8 w-8 text-primary mx-auto mb-3" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    </PageShell>
  );
}

function InvalidAction({ message }) {
  return (
    <PageShell>
      <div className="text-center">
        <ErrorIcon />
        <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid link</h1>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <Link to="/" className="block w-full py-2 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90 text-center">
          Go home
        </Link>
      </div>
    </PageShell>
  );
}

function SuccessIcon() {
  return (
    <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
      <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

function ErrorIcon() {
  return (
    <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
      <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  );
}
