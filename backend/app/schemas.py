# Pydantic v2 schemas for request validation and response serialisation
# UserCreate: first_name, last_name, email (EmailStr), password
# UserLogin: email, password
# UserOut: id, first_name, last_name, email, created_at  (from_attributes=True)
# Token: access_token, token_type, user (UserOut)
# PredictRequest: disease_type ("diabetes"|"heart"), features (dict)
# PredictResponse: disease_type, risk_score, risk_percent, risk_label, feature_importances, recommendations, prediction_id
# PredictionHistory: id, disease_type, risk_score, risk_label, created_at  (from_attributes=True)
