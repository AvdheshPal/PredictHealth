# Auth router — prefix /api, tag "Auth"
# POST /api/register: accepts UserCreate, checks email uniqueness (400 if taken),
#   hashes password, creates User in DB, returns Token schema
# POST /api/login: accepts UserLogin, finds user by email (401 if not found),
#   verifies password (401 if wrong), returns Token schema
