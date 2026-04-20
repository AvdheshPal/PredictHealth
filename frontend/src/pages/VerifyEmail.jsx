import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';

export default function VerifyEmail() {
  const { user, resendVerification, logout } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus]   = useState('idle'); // idle | sending | sent | error
  const [checked, setChecked] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  async function handleResend() {
    setStatus('sending');
    setVerifyError('');
    try {
      await resendVerification();
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setVerifyError(
        err.code === 'auth/too-many-requests'
          ? 'Too many requests. Wait a few minutes before resending.'
          : 'Failed to resend verification email.',
      );
    }
  }

  async function handleContinue() {
    setVerifyError('');
    setChecked(true);
    await auth.currentUser?.reload();
    if (auth.currentUser?.emailVerified) {
      navigate('/dashboard');
    } else {
      setVerifyError('Email not verified yet. Check your inbox and click the link.');
      setChecked(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
        <Link to="/" className="text-xl font-bold text-primary">PredictHealth</Link>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-900">
          Sign out
        </button>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-[420px] bg-white rounded-lg border border-gray-200 p-8 text-center">
          {/* Icon */}
          <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-green-50 border-2 border-primary flex items-center justify-center">
            <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
          <p className="text-gray-500 text-sm mb-1">
            We sent a verification link to
          </p>
          <p className="font-semibold text-gray-900 text-sm mb-5 break-all">
            {user?.email}
          </p>

          <ol className="text-left text-sm text-gray-600 space-y-2 mb-6 bg-gray-50 rounded-lg p-4">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">1</span>
              Open your email inbox
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">2</span>
              Click the <strong>Verify email</strong> link in the message from PredictHealth
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">3</span>
              Come back here and click <strong>I've verified my email</strong>
            </li>
          </ol>

          {verifyError && (
            <p className="text-red-600 text-sm mb-4">{verifyError}</p>
          )}
          {status === 'sent' && (
            <p className="text-green-600 text-sm mb-4">Verification email resent — check your inbox.</p>
          )}

          <button
            onClick={handleContinue}
            disabled={checked}
            className="w-full py-2 bg-primary text-white rounded-md font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2 mb-3"
          >
            {checked && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            I've verified my email
          </button>

          <button
            onClick={handleResend}
            disabled={status === 'sending' || status === 'sent'}
            className="w-full py-2 border border-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Email sent ✓' : 'Resend verification email'}
          </button>

          <p className="text-xs text-gray-400 mt-4">
            Wrong email?{' '}
            <button onClick={handleLogout} className="text-primary hover:underline">
              Sign out
            </button>{' '}
            and register with the correct address.
          </p>
        </div>
      </div>
    </div>
  );
}
