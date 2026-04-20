# User router — prefix /api, tag "User"
# GET /api/me (auth required): returns current user info as UserOut schema
# PUT /api/me (auth required): accepts partial update dict (first_name, last_name, email),
#   updates User record in DB, returns updated UserOut
