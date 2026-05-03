# PredictHealth — Work Status Tracker

> Last updated: 2026-04-22

---

## Legend
| Symbol | Meaning |
|--------|---------|
| ✅ | Complete |
| 🔧 | Partial / needs work |
| ❌ | Not started |
| ⚠️ | Needs attention |

---

## Frontend

### Setup & Config
| File | Status | Notes |
|------|--------|-------|
| `package.json` | ✅ | React 18, React Router v6, Axios, Tailwind, Vite, Firebase 10 |
| `vite.config.js` | ✅ | `@vitejs/plugin-react`, dev server on port 5173 |
| `tailwind.config.js` | ✅ | Scans `src/**`, custom `primary: #1D9E75` |
| `postcss.config.js` | ✅ | Tailwind + Autoprefixer |
| `index.html` | ✅ | Mounts `#root`, loads `/src/main.jsx` |
| `src/index.css` | ✅ | `@tailwind` base / components / utilities |
| `src/main.jsx` | ✅ | `ReactDOM.createRoot` with `StrictMode` |
| `.env.example` | ✅ | Lists `VITE_FIREBASE_*` keys + `VITE_BASE_URL` |
| `.env` | ✅ | Firebase credentials added by user; `VITE_BASE_URL` set |

---

### Core Infrastructure
| File | Status | Notes |
|------|--------|-------|
| `src/firebase.js` | ✅ | Initialises Firebase app from `VITE_FIREBASE_*` env vars; exports `auth` |
| `src/api/axios.js` | ✅ | Base URL from `VITE_BASE_URL`; interceptor calls `getIdToken()` for fresh Firebase ID token per request |
| `src/context/AuthContext.jsx` | ✅ | `onAuthStateChanged`; exposes `login`, `register`, `logout`, `forgotPassword`, `resetPassword`, `resendVerification`, `verifyEmail` |
| `src/App.jsx` | ✅ | All public + protected routes defined; protected pages wrapped in `<PrivateRoute>` |
| `src/components/PrivateRoute.jsx` | ✅ | Checks `loading` → `user` → `user.emailVerified`; redirects appropriately |
| `src/components/Navbar.jsx` | ✅ | Public + authenticated variants; logout via Firebase `signOut` |
| `src/components/RiskBadge.jsx` | ✅ | Low / Medium / High pill badge with correct colours |
| `src/components/LoadingSpinner.jsx` | ✅ | Animated SVG spinner; `size` + `color` props |

---

### Pages
| Page | Route | Protected | Status | Notes |
|------|-------|-----------|--------|-------|
| `Landing.jsx` | `/` | No | ✅ | Hero, 3-card features, nav links to Features/About/Contact |
| `Login.jsx` | `/login` | No | ✅ | `signInWithEmailAndPassword`; show/hide password; checks `emailVerified`; links to `/forgot-password` |
| `Register.jsx` | `/register` | No | ✅ | `createUserWithEmailAndPassword` + `updateProfile`; password strength meter; sends verification email; → `/verify-email` |
| `ForgotPassword.jsx` | `/forgot-password` | No | ✅ | `sendPasswordResetEmail`; success screen with resend; error states |
| `ResetPassword.jsx` | `/reset-password` | No | ✅ | `verifyPasswordResetCode` + `confirmPasswordReset`; strength meter; expired/invalid link handling |
| `VerifyEmail.jsx` | `/verify-email` | No | ✅ | Step guide; "I've verified" reloads Firebase user; resend; sign out option |
| `AuthAction.jsx` | `/auth/action` | No | ✅ | Central Firebase email link handler — routes by `?mode=` to verifyEmail / resetPassword / recoverEmail |
| `Features.jsx` | `/features` | No | ✅ | 6-card feature grid |
| `About.jsx` | `/about` | No | ✅ | Project info, tech stack, datasets, medical disclaimer |
| `Contact.jsx` | `/contact` | No | ✅ | Contact form + FAQ panel; success state |
| `Error.jsx` | `*` | No | ✅ | 404 with "Go back" + "Home" |
| `Dashboard.jsx` | `/dashboard` | Yes | ✅ | Greeting (from `user.displayName`), 3 stat cards, recent predictions; GET `/api/history?limit=3` |
| `Predict.jsx` | `/predict` | Yes | ✅ | Disease selector; dynamic fields; POST `/api/predict` with Firebase token |
| `Results.jsx` | `/results` | Yes | ✅ | Risk circle, feature bars, recommendations; `?id=` param + router state |
| `History.jsx` | `/history` | Yes | ✅ | Full table; GET `/api/history`; empty state |
| `Profile.jsx` | `/profile` | Yes | ✅ | `updateProfile`, `updateEmail`, `reauthenticateWithCredential` + `updatePassword` |

---

## Backend

### Setup & Config
| File | Status | Notes |
|------|--------|-------|
| `requirements.txt` | ⚠️ | Needs update — replace `python-jose`, `passlib`, `bcrypt` with `firebase-admin` |
| `.env` | 🔧 | Update to: `DATABASE_URL` + `FIREBASE_PROJECT_ID` (remove `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`) |

### App Files
| File | Status | Notes |
|------|--------|-------|
| `app/main.py` | ⚠️ | Remove `auth` router import; keep predict, history, user |
| `app/database.py` | ✅ | SQLAlchemy + SQLite; `get_db` dependency |
| `app/models.py` | ⚠️ | Remove `User` model; update `Prediction` to use `firebase_uid` (String) instead of `user_id` FK |
| `app/schemas.py` | ⚠️ | Remove `UserCreate`, `UserLogin`, `UserOut`, `Token`; keep `PredictRequest`, `PredictResponse`, `PredictionHistory` |
| `app/auth.py` | ⚠️ | Replace custom JWT logic with `firebase_admin.auth.verify_id_token()`; needs `serviceAccountKey.json` |

### Routers
| File | Endpoints | Status | Notes |
|------|-----------|--------|-------|
| `app/routers/auth.py` | `POST /register`, `POST /login` | ⚠️ | **No longer needed** — auth is Firebase-only; file can be deleted |
| `app/routers/predict.py` | `POST /api/predict` | ✅ | Needs to use `firebase_uid` from decoded token instead of DB user FK |
| `app/routers/history.py` | `GET /api/history`, `GET /api/history/{id}` | ✅ | Filter by `firebase_uid` from decoded token |
| `app/routers/user.py` | `GET /api/me`, `PUT /api/me` | ⚠️ | `/me` should return data from decoded token; `PUT /me` should call `firebase_admin.auth.update_user()` |

### ML
| File | Status | Notes |
|------|--------|-------|
| `app/ml/train.py` | ✅ | Trains Random Forest; saves `.pkl` files |
| `app/ml/predict.py` | ✅ | Loads model, builds feature array, returns risk score + top-3 importances |
| `app/ml/diabetes_model.pkl` | ✅ | Present |
| `app/ml/heart_model.pkl` | ✅ | Present |

---

## Firebase Auth Flow — Complete Map

```
Register (/register)
  └─► createUserWithEmailAndPassword
  └─► updateProfile (displayName = "First Last")
  └─► sendEmailVerification
  └─► redirect → /verify-email

Verify Email (/verify-email)
  └─► "I've verified" → auth.currentUser.reload() → if emailVerified → /dashboard
  └─► "Resend" → sendEmailVerification
  └─► Firebase email link → /auth/action?mode=verifyEmail&oobCode=xxx
                             └─► applyActionCode → success screen

Login (/login)
  └─► signInWithEmailAndPassword
  └─► if !emailVerified → /verify-email
  └─► if emailVerified  → /dashboard
  └─► "Forgot password?" → /forgot-password

Forgot Password (/forgot-password)
  └─► sendPasswordResetEmail
  └─► Firebase email link → /auth/action?mode=resetPassword&oobCode=xxx
                             └─► verifyPasswordResetCode → password form
                             └─► confirmPasswordReset → success → /login

Reset Password (/reset-password)  [direct URL fallback — same flow as above]

Profile (/profile)
  └─► updateProfile (displayName)
  └─► updateEmail
  └─► reauthenticateWithCredential → updatePassword

Logout (Navbar)
  └─► signOut(auth)

Token Storage
  └─► Firebase session: browser IndexedDB (managed by SDK automatically)
  └─► ID token for API: fetched fresh via auth.currentUser.getIdToken() on each Axios request
  └─► No sessionStorage / localStorage used anywhere
```

> **Firebase Console setup required:**
> Authentication → Templates → (Password reset + Email verification) → Customize action URL →
> set to `http://localhost:5173/auth/action`

---

## Integration Status

| Area | Status | Notes |
|------|--------|-------|
| Frontend ↔ Firebase Auth | ✅ | Full flow complete: register, verify, login, forgot/reset password, profile update, logout |
| Frontend ↔ FastAPI (API calls) | ✅ | Axios sends fresh Firebase ID token as Bearer on every request |
| FastAPI ↔ Firebase token verification | ⚠️ | Needs `firebase-admin` + `serviceAccountKey.json`; `app/auth.py` not yet updated |
| ML models loaded + serving | ✅ | `.pkl` files present; loaded per prediction request |
| SQLite DB auto-creation | ✅ | `Base.metadata.create_all` on startup |

---

## Pending / Known Issues

| # | Area | Issue | Priority |
|---|------|-------|---------|
| 1 | Backend | `app/auth.py` needs rewrite to use `firebase_admin.auth.verify_id_token()` | High |
| 2 | Backend | `app/models.py` — remove `User` model; change `Prediction.user_id` FK → `firebase_uid` String | High |
| 3 | Backend | `app/routers/auth.py` — delete entire file; remove from `main.py` includes | Medium |
| 4 | Backend | `requirements.txt` — swap `python-jose`, `passlib[bcrypt]` → `firebase-admin` | Medium |
| 5 | Backend | Download `serviceAccountKey.json` from Firebase Console → Project Settings → Service Accounts | Blocker for backend |
| 6 | Firebase Console | Action URL not yet configured — email links go to Firebase default handler | High |

---

## How to Run

### Backend
```bash
cd backend
# Place serviceAccountKey.json (Firebase Console → Project Settings → Service Accounts) in backend/
pip install -r requirements.txt
python app/ml/train.py          # run once — needs diabetes.csv + heart.csv in backend/
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
# .env already created with Firebase credentials + VITE_BASE_URL
npm run dev                     # http://localhost:5173
```

---

## Change Log

| Date | Change |
|------|--------|
| 2026-04-20 | Initial frontend scaffold: Vite + React 18 + Tailwind + React Router v6 |
| 2026-04-20 | All core pages created: Landing, Login, Register, Dashboard, Predict, Results, History, Profile |
| 2026-04-20 | Components created: Navbar, PrivateRoute, RiskBadge, LoadingSpinner |
| 2026-04-20 | Added public pages: Features, About, Contact, Error (404) |
| 2026-04-20 | Replaced custom JWT auth with Firebase Authentication (email/password) |
| 2026-04-20 | Profile updated to use Firebase `updateProfile`, `updateEmail`, `updatePassword` |
| 2026-04-20 | Axios interceptor updated to attach fresh Firebase ID token per request |
| 2026-04-20 | `complete.md` tracking file created |
| 2026-04-20 | Complete Firebase auth flow: ForgotPassword, ResetPassword, VerifyEmail, AuthAction pages |
| 2026-04-20 | Login: show/hide password, emailVerified check, clean Firebase error mapping |
| 2026-04-20 | Register: password strength meter, sends verification email, redirects to /verify-email |
| 2026-04-20 | PrivateRoute: blocks unverified users, redirects to /verify-email |
| 2026-04-20 | AuthContext: forgotPassword, resetPassword, resendVerification, verifyEmail methods added |
| 2026-04-20 | axios.js: base URL switched to `VITE_BASE_URL` env var |
| 2026-04-20 | project.md + complete.md updated to reflect Firebase-based architecture |
| 2026-04-22 | Dashboard: fetch full history so "Total predictions" stat shows real count; table still shows last 3 |
| 2026-04-22 | Results: removed broken POST /api/history call — backend auto-saves on predict; "Save result" shows Saved state |
| 2026-04-22 | Profile: added `required` to all edit-profile fields (first_name, last_name, email) and all password fields |
| 2026-04-22 | About: updated tech stack Auth entry from "JWT + bcrypt" to "Firebase Authentication" |
| 2026-04-22 | Features: updated "Secure & Private" card to describe Firebase auth (removed stale JWT/bcrypt/sessionStorage mentions) |
