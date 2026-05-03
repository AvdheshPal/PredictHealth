import os
import logging
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Resolve path to serviceAccountKey.json sitting next to this package
_KEY_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "serviceAccountKey.json")
)

cred = credentials.Certificate(_KEY_PATH)
firebase_admin.initialize_app(cred)

_bearer = HTTPBearer()


_log = logging.getLogger("predicthealth.auth")


def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(_bearer),
) -> dict:
    """FastAPI dependency — verifies Firebase ID token, returns decoded payload."""
    try:
        decoded = firebase_auth.verify_id_token(creds.credentials)
        return decoded  # keys: uid, email, email_verified, name, ...
    except firebase_auth.ExpiredIdTokenError:
        _log.warning("Token rejected: expired")
        raise HTTPException(status_code=401, detail="Token expired — please sign in again")
    except firebase_auth.InvalidIdTokenError:
        _log.warning("Token rejected: invalid")
        raise HTTPException(status_code=401, detail="Invalid token")
    except firebase_auth.RevokedIdTokenError:
        _log.warning("Token rejected: revoked")
        raise HTTPException(status_code=401, detail="Token revoked — please sign in again")
    except Exception as e:
        _log.error(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")
