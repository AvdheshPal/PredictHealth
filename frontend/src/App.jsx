import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Public pages
import Landing      from './pages/Landing';
import Login        from './pages/Login';
import Register     from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';
import VerifyEmail    from './pages/VerifyEmail';
import AuthAction     from './pages/AuthAction';
import Features     from './pages/Features';
import About        from './pages/About';
import Contact      from './pages/Contact';
import Error        from './pages/Error';

// Protected pages
import Dashboard    from './pages/Dashboard';
import Predict      from './pages/Predict';
import Results      from './pages/Results';
import History      from './pages/History';
import Profile      from './pages/Profile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public ─────────────────────────────────────────── */}
          <Route path="/"               element={<Landing />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/register"       element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email"   element={<VerifyEmail />} />
          <Route path="/auth/action"    element={<AuthAction />} />
          <Route path="/features"       element={<Features />} />
          <Route path="/about"          element={<About />} />
          <Route path="/contact"        element={<Contact />} />

          {/* ── Protected ──────────────────────────────────────── */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/predict"   element={<PrivateRoute><Predict /></PrivateRoute>} />
          <Route path="/results"   element={<PrivateRoute><Results /></PrivateRoute>} />
          <Route path="/history"   element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/profile"   element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* ── 404 ────────────────────────────────────────────── */}
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
