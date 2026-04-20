# SQLAlchemy ORM models
# User table: id, first_name, last_name, email (unique), hashed_password, created_at
#   - has one-to-many relationship with Prediction
# Prediction table: id, user_id (FK→users.id), disease_type, risk_score, risk_label, input_data (JSON string), created_at
#   - belongs to User via owner relationship
