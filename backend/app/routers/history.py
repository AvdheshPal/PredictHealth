# History router — prefix /api, tag "History"
# GET /api/history (auth required): returns all Prediction records for current_user, sorted by created_at desc
#   - optional ?limit=N query param to cap results (used by dashboard for last 3)
# GET /api/history/{id} (auth required): returns single Prediction by ID, 404 if not found or not owned by user
