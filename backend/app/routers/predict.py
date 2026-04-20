# Predict router — prefix /api, tag "Predict"
# POST /api/predict (auth required): accepts PredictRequest
#   - calls ml/predict.py run_prediction(disease_type, features)
#   - generates recommendations via get_recommendations(disease_type, risk_label)
#   - saves Prediction record to DB (user_id from current_user)
#   - returns PredictResponse including prediction_id for linking to results
