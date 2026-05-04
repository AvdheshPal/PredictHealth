import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import predict, history, user
from app.database import Base, engine

load_dotenv()

# ── Logging setup ─────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("predicthealth")

# ── App ───────────────────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app = FastAPI(title="PredictHealth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/api", tags=["Predict"])
app.include_router(history.router, prefix="/api", tags=["History"])
app.include_router(user.router,    prefix="/api", tags=["User"])


# ── Startup checks ────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup_checks():
    log.info("=" * 55)
    log.info("PredictHealth API — startup checks")
    log.info("=" * 55)
    all_ok = True

    # 1. Database
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            # Add feature_importances column if it doesn't exist (safe migration)
            conn.execute(text(
                "ALTER TABLE predictions ADD COLUMN IF NOT EXISTS feature_importances TEXT"
            ))
            conn.commit()
        db_url = os.getenv("DATABASE_URL", "sqlite")
        db_type = "PostgreSQL (Neon)" if "postgresql" in db_url else "SQLite"
        log.info(f"✅  Database       : connected ({db_type})")
    except Exception as e:
        log.error(f"❌  Database       : FAILED — {e}")
        all_ok = False

    # 2. Firebase Admin SDK
    try:
        import firebase_admin
        firebase_admin.get_app()
        log.info("✅  Firebase Admin : initialized")
    except Exception as e:
        log.error(f"❌  Firebase Admin : FAILED — {e}")
        all_ok = False

    # 3. ML models
    import os as _os
    base = _os.path.join(_os.path.dirname(__file__), "ml")
    for name in ("diabetes_model.pkl", "heart_model.pkl"):
        path = _os.path.join(base, name)
        if _os.path.exists(path):
            size_mb = _os.path.getsize(path) / 1_048_576
            log.info(f"✅  {name:<28}: found ({size_mb:.1f} MB)")
        else:
            log.error(f"❌  {name:<28}: NOT FOUND — run app/ml/train.py")
            all_ok = False

    # 4. Environment variables
    required_env = ["DATABASE_URL", "FIREBASE_PROJECT_ID"]
    for var in required_env:
        if os.getenv(var):
            log.info(f"✅  ENV {var:<22}: set")
        else:
            log.warning(f"⚠️   ENV {var:<22}: missing from .env")
            all_ok = False

    log.info("=" * 55)
    if all_ok:
        log.info("✅  All checks passed — server is ready")
    else:
        log.error("❌  Some checks FAILED — see errors above")
    log.info("=" * 55)


# ── Root + Health endpoints ───────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "PredictHealth API is running"}



@app.get("/health", tags=["Health"])
def health():
    """Runtime health check — call anytime to verify all components."""
    status = {}

    # Database
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        status["database"] = "ok"
    except Exception as e:
        status["database"] = f"error: {e}"

    # Firebase
    try:
        import firebase_admin
        firebase_admin.get_app()
        status["firebase"] = "ok"
    except Exception as e:
        status["firebase"] = f"error: {e}"

    # ML models
    import os as _os
    base = _os.path.join(_os.path.dirname(__file__), "ml")
    status["diabetes_model"] = "ok" if _os.path.exists(_os.path.join(base, "diabetes_model.pkl")) else "missing"
    status["heart_model"]    = "ok" if _os.path.exists(_os.path.join(base, "heart_model.pkl"))    else "missing"

    overall = "ok" if all(v == "ok" for v in status.values()) else "degraded"
    return {"status": overall, "checks": status}
