import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Prediction
from app.schemas import PredictionHistory, PredictionDetail

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


@router.get("/history", response_model=list[PredictionHistory])
def get_history(
    limit: Optional[int] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Prediction)
        .filter(Prediction.firebase_uid == current_user["uid"])
        .order_by(Prediction.created_at.desc())
    )
    if limit:
        query = query.limit(limit)
    return query.all()


@router.get("/history/{prediction_id}", response_model=PredictionDetail)
def get_single(
    prediction_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = (
        db.query(Prediction)
        .filter(
            Prediction.id == prediction_id,
            Prediction.firebase_uid == current_user["uid"],
        )
        .first()
    )
    if not record:
        raise HTTPException(status_code=404, detail="Prediction not found")

    feature_importances = json.loads(record.feature_importances) if record.feature_importances else {}
    recommendations     = _RECOMMENDATIONS.get(record.disease_type, {}).get(record.risk_label, [])

    return PredictionDetail(
        id                  = record.id,
        disease_type        = record.disease_type,
        risk_score          = record.risk_score,
        risk_percent        = round(record.risk_score * 100),
        risk_label          = record.risk_label,
        feature_importances = feature_importances,
        recommendations     = recommendations,
        created_at          = record.created_at,
    )
