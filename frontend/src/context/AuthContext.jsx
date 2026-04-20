import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  sendEmailVerification,
  applyActionCode,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email, password) {
    const { user: u } = await signInWithEmailAndPassword(auth, email, password);
    return u;
  }

  async function register(email, password, firstName, lastName) {
    const { user: u } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(u, { displayName: `${firstName} ${lastName}` });
    await sendEmailVerification(u);
    setUser({ ...u, displayName: `${firstName} ${lastName}` });
    return u;
  }

  async function logout() {
    await signOut(auth);
  }

  async function forgotPassword(email) {
    await sendPasswordResetEmail(auth, email);
  }

  async function resetPassword(oobCode, newPassword) {
    await verifyPasswordResetCode(auth, oobCode);
    await confirmPasswordReset(auth, oobCode, newPassword);
  }

  async function resendVerification() {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  }

  async function verifyEmail(oobCode) {
    await applyActionCode(auth, oobCode);
    await auth.currentUser?.reload();
    setUser({ ...auth.currentUser });
  }

  const firstName = user?.displayName?.split(' ')[0] ?? '';
  const lastName  = user?.displayName?.split(' ').slice(1).join(' ') ?? '';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      firstName,
      lastName,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      resendVerification,
      verifyEmail,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
