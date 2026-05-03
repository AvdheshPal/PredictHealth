"""
ML inference module.
Called by app/routers/predict.py after Phase 4 wiring.
"""
import os
import pandas as pd
import joblib

BASE = os.path.dirname(__file__)

DIABETES_FEATURES = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age",
]

HEART_FEATURES = [
    "age", "sex", "cp", "trestbps", "chol",
    "fbs", "restecg", "thalach", "exang", "oldpeak",
]

_FEATURES = {
    "diabetes": DIABETES_FEATURES,
    "heart":    HEART_FEATURES,
}

# Cache loaded models so they are read from disk only once per process
_cache: dict = {}


def _load(disease_type: str):
    if disease_type not in _cache:
        path = os.path.join(BASE, f"{disease_type}_model.pkl")
        _cache[disease_type] = joblib.load(path)
    return _cache[disease_type]


def run_prediction(disease_type: str, features: dict) -> dict:
    """
    Returns:
        risk_score          float  0.0 – 1.0
        risk_percent        int    0 – 100
        risk_label          str    Low | Medium | High
        feature_importances dict   top-3 feature names → normalised importance (max = 1.0)
    """
    if disease_type not in _FEATURES:
        raise ValueError(f"Unknown disease_type: {disease_type!r}")

    feature_names = _FEATURES[disease_type]
    model = _load(disease_type)

    X = pd.DataFrame([{k: float(features[k]) for k in feature_names}])

    risk_score   = float(model.predict_proba(X)[0][1])
    risk_percent = round(risk_score * 100)

    if risk_percent < 30:
        risk_label = "Low"
    elif risk_percent <= 60:
        risk_label = "Medium"
    else:
        risk_label = "High"

    # Top-3 feature importances, normalised so the highest = 1.0
    importances = model.feature_importances_
    top3_idx    = sorted(range(len(importances)), key=lambda i: importances[i], reverse=True)[:3]
    max_imp     = importances[top3_idx[0]]
    feature_importances = {
        feature_names[i]: round(float(importances[i] / max_imp), 4)
        for i in top3_idx
    }

    return {
        "risk_score":          risk_score,
        "risk_percent":        risk_percent,
        "risk_label":          risk_label,
        "feature_importances": feature_importances,
    }
