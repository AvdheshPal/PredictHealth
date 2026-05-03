import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

_log = logging.getLogger("predicthealth.database")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    _log.critical("DATABASE_URL is not set in .env — cannot start")
    raise RuntimeError("DATABASE_URL is not set in .env")

# check_same_thread is SQLite-only — omit for PostgreSQL
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        _log.error(f"Database session error: {e}")
        raise
    finally:
        db.close()
