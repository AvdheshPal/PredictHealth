# ML inference module loaded by the predict router
# DIABETES_FEATURES and HEART_FEATURES define the ordered feature lists expected by each model
# run_prediction(disease_type, features) → dict:
#   - loads the correct .pkl model via joblib
#   - builds numpy array from features dict using the correct feature order
#   - calls model.predict_proba(X)[0][1] for positive-class probability
#   - computes risk_label: <0.30 → "Low", 0.30–0.60 → "Medium", >0.60 → "High"
#   - extracts top 3 feature importances from model.feature_importances_
#   - returns risk_score, risk_percent, risk_label, feature_importances
