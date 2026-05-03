import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Prediction
from app.schemas import PredictRequest, PredictResponse
from app.ml.predict import run_prediction

router = APIRouter()

_RECOMMENDATIONS = {
    "diabetes": {
        "Low":    [
            "Maintain a balanced diet low in refined sugars.",
            "Exercise at least 150 minutes per week.",
            "Schedule an annual blood glucose check.",
        ],
        "Medium": [
            "Reduce carbohydrate intake and monitor blood sugar regularly.",
            "Increase physical activity to 30 minutes daily.",
            "Consult your doctor about pre-diabetes screening.",
        ],
        "High":   [
            "Seek medical advice promptly for a full diabetes evaluation.",
            "Follow a strict low-glycaemic diet under medical supervision.",
            "Monitor fasting blood glucose levels daily.",
        ],
    },
    "heart": {
        "Low":    [
            "Keep cholesterol in check with a heart-healthy diet.",
            "Aim for 150 minutes of moderate cardio per week.",
            "Avoid smoking and limit alcohol intake.",
        ],
        "Medium": [
            "Reduce saturated fat and sodium in your diet.",
            "Monitor blood pressure at least once a week.",
            "Discuss your cardiovascular risk profile with your doctor.",
        ],
        "High":   [
            "Seek urgent medical evaluation for your cardiovascular risk.",
            "Follow prescribed medication and dietary guidelines strictly.",
            "Avoid strenuous activity until cleared by a cardiologist.",
        ],
    },
}


@router.post("/predict", response_model=PredictResponse)
def run_predict(
    body: PredictRequest,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = run_prediction(body.disease_type, body.features)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Prediction failed: {e}")

    risk_score          = result["risk_score"]
    risk_percent        = result["risk_percent"]
    risk_label          = result["risk_label"]
    feature_importances = result["feature_importances"]
    recommendations     = _RECOMMENDATIONS.get(body.disease_type, {}).get(risk_label, [])

    record = Prediction(
        firebase_uid        = current_user["uid"],
        disease_type        = body.disease_type,
        risk_score          = risk_score,
        risk_label          = risk_label,
        input_data          = json.dumps(body.features),
        feature_importances = json.dumps(feature_importances),
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return PredictResponse(
        disease_type        = body.disease_type,
        risk_score          = risk_score,
        risk_percent        = risk_percent,
        risk_label          = risk_label,
        feature_importances = feature_importances,
        recommendations     = recommendations,
        prediction_id       = record.id,
    )
