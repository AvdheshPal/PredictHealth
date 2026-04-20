import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FIREBASE_ERRORS = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email':        'Please enter a valid email address.',
  'auth/weak-password':        'Password must be at least 6 characters.',
  'auth/too-many-requests':    'Too many attempts. Please try again later.',
};

function passwordStrength(pw) {
  let s = 0;
  if (pw.length >= 6)  s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthMeta = [
  null,
  { label: 'Weak',   bar: 'bg-red-400' },
  { label: 'Fair',   bar: 'bg-amber-400' },
  { label: 'Good',   bar: 'bg-yellow-400' },
  { label: 'Strong', bar: 'bg-green-500' },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm]   = useState({ first_name: '', last_name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError]  = useState('');
  const [loading, setLoading] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  const strength = passwordStrength(form.password);
  const meta     = strengthMeta[strength];

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(form.email, form.password, form.first_name, form.last_name);
      navigate('/verify-email');
    } catch (err) {
      setError(FIREBASE_ERRORS[err.code] ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
        <Link to="/" className="text-xl font-bold text-primary">PredictHealth</Link>
        <Link to="/login" className="px-4 py-2 border border-primary text-primary rounded-md text-sm hover:bg-green-50">
          Login
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px] bg-white rounded-lg border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-500 text-sm mb-6">Start predicting your health risk for free.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={form.first_name}
                  onChange={set('first_name')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input
                  type="text"
                  required
                  value={form.last_name}
                  onChange={set('last_name')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={set('email')}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Min. 6 characters"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                />
                <button type="button" onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {showPw
                      ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                    }
                  </svg>
                </button>
              </div>

              {/* Strength meter */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((l) => (
                      <div key={l}
                        className={`h-1 flex-1 rounded-full transition-colors ${strength >= l ? meta?.bar : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{meta?.label}</p>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input
                type={showPw ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={form.confirm}
                onChange={set('confirm')}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {form.confirm && form.password !== form.confirm && (
                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
              )}
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
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
