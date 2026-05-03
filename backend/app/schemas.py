from pydantic import BaseModel
from datetime import datetime
from typing import Any


class PredictRequest(BaseModel):
    disease_type: str        # "diabetes" or "heart"
    features: dict[str, Any] # all input params as key-value pairs


class PredictResponse(BaseModel):
    disease_type: str
    risk_score: float
    risk_percent: int
    risk_label: str
    feature_importances: dict[str, float]
    recommendations: list[str]
    prediction_id: int


class PredictionHistory(BaseModel):
    id: int
    disease_type: str
    risk_score: float
    risk_label: str
    created_at: datetime

    class Config:
        from_attributes = True


class PredictionDetail(BaseModel):
    """Full result — returned by GET /history/{id} and used by Results page."""
    id: int
    disease_type: str
    risk_score: float
    risk_percent: int
    risk_label: str
    feature_importances: dict[str, float]
    recommendations: list[str]
    created_at: datetime

    class Config:
        from_attributes = True
