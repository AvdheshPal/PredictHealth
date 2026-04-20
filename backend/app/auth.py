# JWT and password utilities
# pwd_context: bcrypt CryptContext for hashing and verifying passwords
# oauth2_scheme: OAuth2PasswordBearer pointing to /api/login
# hash_password(password) → bcrypt hash string
# verify_password(plain, hashed) → bool
# create_access_token(data) → signed JWT string (expires in ACCESS_TOKEN_EXPIRE_MINUTES)
# get_current_user(token, db) → FastAPI dependency; decodes JWT, fetches User from DB, raises 401 on failure
