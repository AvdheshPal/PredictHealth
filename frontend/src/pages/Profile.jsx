import { useEffect, useState } from 'react';
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import Navbar from '../components/Navbar';

export default function Profile() {
  const { user } = useAuth();

  const [form, setForm] = useState({ first_name: '', last_name: '', email: '' });
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm: '' });
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState('success');
  const [pwError, setPwError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const [first = '', ...rest] = (user.displayName ?? '').split(' ');
      setForm({ first_name: first, last_name: rest.join(' '), email: user.email ?? '' });
    }
  }, [user]);

  function showToast(msg, type = 'success') {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(''), 3000);
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const displayName = `${form.first_name} ${form.last_name}`.trim();
      await updateProfile(auth.currentUser, { displayName });
      if (form.email !== user.email) {
        await updateEmail(auth.currentUser, form.email);
      }
      showToast('Profile updated successfully.');
    } catch (err) {
      const msg = err.code === 'auth/requires-recent-login'
        ? 'Please sign out and sign back in before changing your email.'
        : 'Failed to save changes.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handlePwUpdate(e) {
    e.preventDefault();
    setPwError('');
    if (pwForm.new_password !== pwForm.confirm) {
      setPwError('Passwords do not match.');
      return;
    }
    if (pwForm.new_password.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    setPwLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, pwForm.current_password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, pwForm.new_password);
      setPwForm({ current_password: '', new_password: '', confirm: '' });
      showToast('Password updated successfully.');
    } catch (err) {
      setPwError(
        err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
          ? 'Current password is incorrect.'
          : 'Failed to update password.',
      );
    } finally {
      setPwLoading(false);
    }
  }

  const initials = `${form.first_name?.[0] ?? ''}${form.last_name?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-md text-sm shadow ${toastType === 'error' ? 'bg-red-600' : 'bg-primary'} text-white`}>
          {toast}
        </div>
      )}
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* User info card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {initials || '?'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{form.first_name} {form.last_name}</p>
            <p className="text-sm text-gray-500">{form.email}</p>
            {user?.metadata?.creationTime && (
              <p className="text-xs text-gray-400 mt-0.5">
                Joined {new Date(user.metadata.creationTime).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Edit profile */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Edit profile</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                <input
                  type="text"
                  required
                  value={form.first_name}
                  onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input
                  type="text"
                  required
                  value={form.last_name}
                  onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Change password</h2>
          <form onSubmit={handlePwUpdate} className="space-y-4">
            {[
              { key: 'current_password', label: 'Current password' },
              { key: 'new_password',     label: 'New password' },
              { key: 'confirm',          label: 'Confirm new password' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type="password"
                  required
                  value={pwForm[key]}
                  onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            ))}
            {pwError && <p className="text-red-600 text-sm">{pwError}</p>}
            <button
              type="submit"
              disabled={pwLoading}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:opacity-90 disabled:opacity-60"
            >
              {pwLoading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
