# SQLAlchemy database setup
# Reads DATABASE_URL from .env (defaults to sqlite:///./predicthealth.db)
# Creates engine with check_same_thread=False for SQLite compatibility
# Exports: engine, SessionLocal, Base, get_db (FastAPI dependency yielding a DB session)
