from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id                  = Column(Integer, primary_key=True, index=True)
    firebase_uid        = Column(String, index=True)   # Firebase UID from decoded ID token
    disease_type        = Column(String)               # "diabetes" or "heart"
    risk_score          = Column(Float)                # 0.0 – 1.0
    risk_label          = Column(String)               # "Low" | "Medium" | "High"
    input_data          = Column(String)               # JSON string of input features
    feature_importances = Column(String, nullable=True) # JSON string of top-3 importances
    created_at          = Column(DateTime, default=datetime.utcnow)
