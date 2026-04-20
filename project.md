# AI Disease Prediction System — Full Project Specification

## Project Overview

**Name:** PredictHealth  
**Type:** Full-stack web application  
**Purpose:** Predict disease risk (Diabetes / Heart Disease) using Machine Learning based on user-entered health parameters  
**Academic Context:** MCA 4th Semester Major Project — Chandigarh University (23ONMCR-753)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite) + Tailwind CSS |
| Backend | FastAPI (Python 3.11+) |
| ML Model | Scikit-learn (Random Forest) |
| Database | SQLite (via SQLAlchemy ORM) |
| Auth (Frontend) | Firebase Authentication (Email/Password) |
| Auth (Backend) | firebase-admin SDK — verifies Firebase ID tokens on protected routes |
| HTTP Client | Axios (with Firebase ID token interceptor) |
| Routing | React Router v6 |
| Session Storage | Firebase IndexedDB (managed by SDK — no manual token storage) |

---

## Project Structure

```
predicthealth/
├── frontend/                        # React app (Vite)
│   ├── public/
│   ├── src/
│   │   ├── firebase.js              # Firebase app init + exports auth
│   │   ├── api/
│   │   │   └── axios.js             # Axios instance; intercepts requests to attach Firebase ID token
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Public + authenticated variants; logout via Firebase signOut
│   │   │   ├── PrivateRoute.jsx     # Checks Firebase user + emailVerified; redirects if needed
│   │   │   ├── RiskBadge.jsx        # Low / Medium / High pill badge
│   │   │   └── LoadingSpinner.jsx   # Animated SVG spinner
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # /               [public]
│   │   │   ├── Login.jsx            # /login          [public]
│   │   │   ├── Register.jsx         # /register       [public]
│   │   │   ├── ForgotPassword.jsx   # /forgot-password [public]
│   │   │   ├── ResetPassword.jsx    # /reset-password  [public] — handles ?oobCode from Firebase email
│   │   │   ├── VerifyEmail.jsx      # /verify-email    [public] — shown after register
│   │   │   ├── AuthAction.jsx       # /auth/action     [public] — central Firebase email link handler
│   │   │   ├── Features.jsx         # /features        [public]
│   │   │   ├── About.jsx            # /about           [public]
│   │   │   ├── Contact.jsx          # /contact         [public]
│   │   │   ├── Error.jsx            # *                [public] — 404
│   │   │   ├── Dashboard.jsx        # /dashboard       [protected]
│   │   │   ├── Predict.jsx          # /predict         [protected]
│   │   │   ├── Results.jsx          # /results         [protected]
│   │   │   ├── History.jsx          # /history         [protected]
│   │   │   └── Profile.jsx          # /profile         [protected]
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Firebase auth state via onAuthStateChanged
│   │   ├── App.jsx                  # All route definitions
│   │   ├── main.jsx
│   │   └── index.css                # Tailwind directives
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env                         # VITE_FIREBASE_* keys + VITE_BASE_URL
│   ├── .env.example                 # Template listing all required env vars
│   └── package.json
│
├── backend/                         # FastAPI app
│   ├── app/
│   │   ├── main.py                  # FastAPI app entry, CORS, router includes
│   │   ├── database.py              # SQLAlchemy engine + session
│   │   ├── models.py                # DB models: User, Prediction
│   │   ├── schemas.py               # Pydantic schemas for request/response
│   │   ├── auth.py                  # Firebase ID token verification via firebase-admin
│   │   ├── routers/
│   │   │   ├── predict.py           # POST /predict
│   │   │   ├── history.py           # GET /history
│   │   │   └── user.py              # GET /me, PUT /me
│   │   └── ml/
│   │       ├── train.py             # One-time script to train + save models
│   │       ├── predict.py           # Load .pkl and run prediction
│   │       ├── diabetes_model.pkl   # Saved trained model
│   │       └── heart_model.pkl      # Saved trained model
│   ├── requirements.txt
│   └── .env                         # DATABASE_URL, FIREBASE_PROJECT_ID
│
└── project.md                       # This file
```

---

## Frontend — Page by Page

### Design System

- **Primary color:** `#1D9E75` (teal green)
- **Font:** System sans-serif (Segoe UI / Inter fallback)
- **Border radius:** `rounded-lg` (12px cards), `rounded-md` (8px inputs/buttons)
- **Borders:** `border border-gray-200`
- **Risk badge colors:**
  - Low: `bg-green-100 text-green-800`
  - Medium: `bg-amber-100 text-amber-800`
  - High: `bg-red-100 text-red-800`

---

### Page 1 — Landing `/`

**Purpose:** Marketing/intro page for unauthenticated users

**Layout:**
- Navbar: logo `PredictHealth`, nav links (Features, About, Contact), buttons: Login (outline) + Get Started (filled green)
- Hero section (centered): H1 headline with green accent, subtitle, two CTA buttons
- Features section: 3-column card grid (ML-powered analysis, Instant results, Full history)

**Behaviour:**
- "Get Started" / "Start free prediction" → `/register`
- "Login" → `/login`

---

### Page 2 — Login `/login`

**Purpose:** Authenticate existing user via Firebase

**Layout:**
- Navbar: logo + Register button
- Centered card (max-width 380px):
  - Title: "Welcome back"
  - Field: Email address
  - Field: Password (show/hide toggle)
  - Link: "Forgot password?" → `/forgot-password`
  - Button: "Sign in" (full width, green)
  - Divider: "or"
  - Footer: "Don't have an account? Register"

**Behaviour:**
- On submit: `signInWithEmailAndPassword(auth, email, password)`
- If `!user.emailVerified` → navigate to `/verify-email`
- If verified → navigate to `/dashboard`
- On failure: show Firebase error code mapped to human-readable message
- Already-authenticated verified users auto-redirect to `/dashboard` on page load

---

### Page 3 — Register `/register`

**Purpose:** Create new Firebase account

**Layout:**
- Navbar: logo + Login button
- Centered card (max-width 420px):
  - Title: "Create account"
  - Row: First name + Last name
  - Field: Email address
  - Field: Password (show/hide toggle + strength meter)
  - Field: Confirm password (live mismatch indicator)
  - Button: "Create account" (full width, green)
  - Footer: "Already have an account? Sign in"

**Behaviour:**
- Client-side validation: all fields required, passwords match, min 6 chars
- On submit: `createUserWithEmailAndPassword` → `updateProfile` (sets `displayName`) → `sendEmailVerification`
- On success: navigate to `/verify-email`
- On failure: Firebase error codes mapped to messages (email in use, weak password, etc.)

---

### Page 2a — Verify Email `/verify-email`

**Purpose:** Prompt user to click the verification link sent to their email after register

**Layout:**
- Navbar: logo + Sign out button
- Centered card with email icon, step-by-step instructions
- Button: "I've verified my email" (green)
- Button: "Resend verification email" (outline)
- Link: "Wrong email? Sign out"

**Behaviour:**
- "I've verified" → `auth.currentUser.reload()` → if `emailVerified` → `/dashboard`; else show error
- "Resend" → `sendEmailVerification(auth.currentUser)`
- Firebase email link clicks → handled by `/auth/action?mode=verifyEmail`

---

### Page 2b — Forgot Password `/forgot-password`

**Purpose:** Request a password reset email

**Layout:**
- Navbar: logo
- Centered card (max-width 380px):
  - Title: "Forgot password?"
  - Field: Email address
  - Button: "Send reset link" (green)
  - Link: "Remembered it? Sign in"
- Success state: envelope icon + "Check your inbox" message with email shown

**Behaviour:**
- On submit: `sendPasswordResetEmail(auth, email)`
- Firebase sends link to `/auth/action?mode=resetPassword&oobCode=xxx`
- Success/error states shown inline

---

### Page 2c — Reset Password `/reset-password`

**Purpose:** Set a new password using the oobCode from Firebase email link (direct URL fallback)

**Layout:**
- Centered card: "Set new password"
- Shows email address the reset is for
- Field: New password (show/hide + strength meter)
- Field: Confirm password (live mismatch indicator)
- Button: "Update password" (green)

**Behaviour:**
- On load: reads `?oobCode` from URL → `verifyPasswordResetCode(auth, oobCode)` → gets email
- Invalid/expired oobCode → shows error card with link to `/forgot-password`
- On submit: `confirmPasswordReset(auth, oobCode, newPassword)`
- On success: navigate to `/login`

---

### Page 2d — Auth Action `/auth/action`

**Purpose:** Central handler for all Firebase email action links (set as Action URL in Firebase console)

**Behaviour — routes by `?mode=` param:**
- `mode=verifyEmail` → `applyActionCode(auth, oobCode)` → success/error screen
- `mode=resetPassword` → `verifyPasswordResetCode` → password form → `confirmPasswordReset`
- `mode=recoverEmail` → `applyActionCode(auth, oobCode)` → prompts password reset

> **Firebase Console setup:** Authentication → Templates → each template → Customize action URL → `http://localhost:5173/auth/action`

---

### Page 3 — Features `/features`

**Purpose:** Detailed feature breakdown (public marketing page)

- 6-card grid: ML-Powered Analysis, Two Disease Models, Instant Results, Full History, Secure & Private, PDF Export

---

### Page 4 — About `/about`

**Purpose:** Project information (public)

- Project overview, tech stack grid, datasets used, medical disclaimer

---

### Page 5 — Contact `/contact`

**Purpose:** Contact form (public)

- Name, email, subject, message form + FAQ panel; success state after submission

---

### Page 6 — Dashboard `/dashboard` [PROTECTED]

**Purpose:** Home screen after login

**Layout:**
- Navbar (authenticated variant)
- Header: "Good morning/afternoon/evening, {firstName}" + last risk badge
- 3 stat cards: Total predictions, Last risk score, Last checked date
- Recent predictions table (last 3 records): Date, Disease, Risk %, Status badge

**Behaviour:**
- On mount: GET `/api/history?limit=3`
- Row click → `/results?id={id}`
- "+ New prediction" → `/predict`
- `firstName` sourced from `user.displayName` via Firebase

---

### Page 7 — Predict `/predict` [PROTECTED]

**Purpose:** Health parameter input form

**Layout:**
- Disease type dropdown: Diabetes / Heart Disease
- Dynamic input grid (sliders + selects) based on selected disease
- "Run prediction" button

**Diabetes fields:** Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age

**Heart Disease fields:** age, sex (dropdown), cp (dropdown), trestbps, chol, fbs (dropdown), restecg (dropdown), thalach, exang (dropdown), oldpeak

**Behaviour:**
- Sliders show live value next to label
- On submit: POST `/api/predict` with Firebase ID token
- Navigate to `/results` with result in router state on success

---

### Page 8 — Results `/results` [PROTECTED]

**Purpose:** Display ML prediction result

**Layout:**
- Risk circle (green/amber/red border) showing risk %
- Risk label + 2–3 sentence explanation
- 3 feature importance bars (normalised to %)
- 3 recommendation cards (green/amber/blue dots)
- "Save result" + "Download PDF" buttons

**Behaviour:**
- Reads result from router state OR fetches by `?id=` param
- Risk thresholds: <30% Low, 30–60% Medium, >60% High
- "Download PDF" → `window.print()`

---

### Page 9 — History `/history` [PROTECTED]

**Purpose:** Full prediction history table

**Behaviour:**
- GET `/api/history` on mount
- Table: Date, Disease, Risk %, Result badge, View link
- "View" → `/results?id={id}`

---

### Page 10 — Profile `/profile` [PROTECTED]

**Purpose:** View and edit user account

**Layout:**
- Initials avatar card: full name, email, join date (from `user.metadata.creationTime`)
- Edit form: First name, Last name, Email → "Save changes"
- Change password: Current, New, Confirm → "Update password"

**Behaviour:**
- Data sourced from Firebase `auth.currentUser` (no API call needed for display)
- Save name/email: `updateProfile` + `updateEmail`
- Change password: `reauthenticateWithCredential` → `updatePassword`
- Success/error toast shown inline

---

### Auth Context (`AuthContext.jsx`)

```javascript
// State: { user, loading } — user is the Firebase User object
// Methods:
//   login(email, password)            → signInWithEmailAndPassword
//   register(email, pwd, first, last) → createUserWithEmailAndPassword + updateProfile + sendEmailVerification
//   logout()                          → signOut
//   forgotPassword(email)             → sendPasswordResetEmail
//   resetPassword(oobCode, newPwd)    → verifyPasswordResetCode + confirmPasswordReset
//   resendVerification()              → sendEmailVerification(auth.currentUser)
//   verifyEmail(oobCode)              → applyActionCode + reload user
// Token: Firebase manages session in IndexedDB — no manual sessionStorage
// Axios gets fresh ID token per request via auth.currentUser.getIdToken()
```

### Private Route (`PrivateRoute.jsx`)

```javascript
// loading === true  → show full-screen spinner (Firebase is checking IndexedDB)
// !user             → <Navigate to="/login" />
// !user.emailVerified → <Navigate to="/verify-email" />
// otherwise         → render children
```

---

## Backend — FastAPI

### Setup

```bash
# Install
pip install fastapi uvicorn sqlalchemy firebase-admin python-dotenv scikit-learn pandas numpy joblib pydantic[email]

# Run
uvicorn app.main:app --reload --port 8000
```

### Environment Variables (`.env`)

```
DATABASE_URL=sqlite:///./predicthealth.db
FIREBASE_PROJECT_ID=your-firebase-project-id
```

> **Note:** `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`, and `passlib/bcrypt` are no longer needed — authentication is fully handled by Firebase on the frontend. The backend only needs to verify the Firebase ID token sent in the `Authorization: Bearer` header.

---

### `auth.py` — Firebase Token Verification

```python
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Initialize Firebase Admin SDK once
# Place serviceAccountKey.json in backend/
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

bearer_scheme = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    token = credentials.credentials
    try:
        decoded = firebase_auth.verify_id_token(token)
        return decoded   # contains uid, email, email_verified, etc.
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
```

---

### `main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import predict, history, user
from app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PredictHealth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/api", tags=["Predict"])
app.include_router(history.router, prefix="/api", tags=["History"])
app.include_router(user.router,    prefix="/api", tags=["User"])
```

> **Note:** The `/api/register` and `/api/login` routers have been removed — registration and login are handled entirely by Firebase on the frontend.

---

### `database.py`

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./predicthealth.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

### `models.py`

```python
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Prediction(Base):
    __tablename__ = "predictions"
    id           = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, index=True)   # Firebase UID replaces local user_id FK
    disease_type = Column(String)
    risk_score   = Column(Float)
    risk_label   = Column(String)
    input_data   = Column(String)               # JSON string of input params
    created_at   = Column(DateTime, default=datetime.utcnow)
```

> **Note:** The `User` model is no longer needed — user identity comes from Firebase. Predictions are linked by `firebase_uid` (the `uid` from the decoded ID token).

---

### `schemas.py`

```python
from pydantic import BaseModel
from datetime import datetime

class PredictRequest(BaseModel):
    disease_type: str   # "diabetes" or "heart"
    features: dict      # all input params as key-value

class PredictResponse(BaseModel):
    disease_type: str
    risk_score: float
    risk_percent: int
    risk_label: str
    feature_importances: dict
    recommendations: list[str]
    prediction_id: int

class PredictionHistory(BaseModel):
    id: int
    disease_type: str
    risk_score: float
    risk_label: str
    created_at: datetime
    class Config: from_attributes = True
```

---

### `routers/predict.py`

**POST /api/predict** (requires Firebase ID token)
- Accept `PredictRequest`
- Extract `firebase_uid` from decoded token
- Load correct model (.pkl)
- Run prediction → compute risk_label + feature importances + recommendations
- Save `Prediction` to DB with `firebase_uid`
- Return `PredictResponse`

---

### `routers/history.py`

**GET /api/history** — filter by `firebase_uid = decoded_token["uid"]`  
**GET /api/history/{id}** — verify ownership via `firebase_uid` before returning

---

### `routers/user.py`

**GET /api/me** — return info from decoded Firebase token (`email`, `name`, `uid`)  
**PUT /api/me** — update `displayName` or `email` via `firebase_admin.auth.update_user(uid, ...)`

---

### `ml/predict.py`

```python
DIABETES_FEATURES = ["Pregnancies","Glucose","BloodPressure","SkinThickness","Insulin","BMI","DiabetesPedigreeFunction","Age"]
HEART_FEATURES    = ["age","sex","cp","trestbps","chol","fbs","restecg","thalach","exang","oldpeak"]

def run_prediction(disease_type, features):
    # loads .pkl, builds numpy array, calls predict_proba
    # returns risk_score, risk_percent, risk_label, top-3 feature_importances
```

---

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/predict` | Firebase ID token | Run ML prediction, save to DB |
| GET | `/api/history` | Firebase ID token | Get all predictions for current user |
| GET | `/api/history/{id}` | Firebase ID token | Get single prediction |
| GET | `/api/me` | Firebase ID token | Get current user info from Firebase token |
| PUT | `/api/me` | Firebase ID token | Update user profile via Firebase Admin |

> `/api/register` and `/api/login` are **not needed** — Firebase handles all auth on the frontend.

---

## Frontend Environment Variables (`.env`)

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_BASE_URL=http://localhost:8000
```

## Frontend API Client (`src/api/axios.js`)

```javascript
import axios from 'axios';
import { auth } from '../firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken(); // auto-refreshes if expired
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## Running the Project

### Backend
```bash
cd backend
pip install -r requirements.txt
# Place serviceAccountKey.json (from Firebase console) in backend/
python app/ml/train.py          # Run once to generate .pkl models
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
cp .env.example .env            # Fill in Firebase credentials + VITE_BASE_URL
npm install
npm run dev                     # http://localhost:5173
```

---

## Requirements.txt (Backend)

```
fastapi
uvicorn[standard]
sqlalchemy
firebase-admin
python-dotenv
scikit-learn
pandas
numpy
joblib
pydantic[email]
```

---

## Package.json Dependencies (Frontend)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "axios": "^1.6.7",
    "firebase": "^10.12.0"
  },
  "devDependencies": {
    "vite": "^5.1.4",
    "@vitejs/plugin-react": "^4.2.1",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35"
  }
}
```

---

## Notes

1. Create frontend and backend as **completely separate folders** — do not mix them.
2. Run `train.py` before starting the backend — `.pkl` files must exist before any prediction call.
3. All routes except `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`, `/auth/action`, `/features`, `/about`, `/contact` must be wrapped in `<PrivateRoute>`.
4. All form submissions must show a loading state (disable button + spinner) while async calls are in flight.
5. The prediction form fields change dynamically based on selected disease type.
6. Risk percentage: multiply `risk_score` (0.0–1.0) by 100 and round to integer.
7. Feature importance values from the model are normalised to percentages for Results page progress bars.
8. SQLite database is auto-created on first backend run — no manual DB setup needed.
9. CORS is configured for `http://localhost:5173` — update `allow_origins` if deploying to a different port.
10. Firebase manages auth session internally in browser IndexedDB — **do not use sessionStorage or localStorage for tokens**. Axios gets a fresh ID token via `auth.currentUser.getIdToken()` on every request.
11. Set Firebase Console → Authentication → Templates → Action URL to `http://localhost:5173/auth/action` so email verification and password reset links redirect back to the app.
12. Download `serviceAccountKey.json` from Firebase Console → Project Settings → Service Accounts and place it in the `backend/` folder for the `firebase-admin` SDK.
