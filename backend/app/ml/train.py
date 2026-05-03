"""
One-time training script.
Run from the backend/ directory:
    python3.11 app/ml/train.py

Requires diabetes.csv and heart.csv to be present in backend/.
Saves diabetes_model.pkl and heart_model.pkl to app/ml/.
"""
import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

BASE     = os.path.dirname(__file__)          # app/ml/
DATA_DIR = os.path.join(BASE, "..", "..")     # backend/

DIABETES_FEATURES = [
    "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
    "Insulin", "BMI", "DiabetesPedigreeFunction", "Age",
]

HEART_FEATURES = [
    "age", "sex", "cp", "trestbps", "chol",
    "fbs", "restecg", "thalach", "exang", "oldpeak",
]


def train_diabetes():
    path = os.path.join(DATA_DIR, "diabetes.csv")
    df   = pd.read_csv(path)

    X = df[DIABETES_FEATURES]
    y = df["Outcome"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"  Diabetes accuracy : {acc:.2%}")

    out = os.path.join(BASE, "diabetes_model.pkl")
    joblib.dump(model, out)
    print(f"  Saved → {out}")


def train_heart():
    path = os.path.join(DATA_DIR, "heart.csv")
    df   = pd.read_csv(path)

    # ── Rename to match expected feature names ────────────────────────────────
    df = df.rename(columns={"thalch": "thalach", "num": "target"})

    # ── Encode categorical columns ────────────────────────────────────────────
    df["sex"] = df["sex"].map({"Male": 1, "Female": 0})

    df["cp"] = df["cp"].map({
        "typical angina":    0,
        "atypical angina":   1,
        "non-anginal":       2,
        "asymptomatic":      3,
    })

    df["restecg"] = df["restecg"].map({
        "normal":            0,
        "st-t abnormality":  1,
        "lv hypertrophy":    2,
    })

    # Boolean columns — cast to float (handles True/False/NaN)
    df["fbs"]   = df["fbs"].astype(float)
    df["exang"] = df["exang"].astype(float)

    # ── Binary target: 0 = no disease, 1 = disease (values 1-4) ──────────────
    df["target"] = (df["target"] > 0).astype(int)

    # ── Select the 10 features, fill nulls with column median ─────────────────
    X = df[HEART_FEATURES].copy()
    X = X.fillna(X.median(numeric_only=True))
    y = df["target"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    acc = accuracy_score(y_test, model.predict(X_test))
    print(f"  Heart accuracy    : {acc:.2%}")

    out = os.path.join(BASE, "heart_model.pkl")
    joblib.dump(model, out)
    print(f"  Saved → {out}")


if __name__ == "__main__":
    print("Training diabetes model…")
    train_diabetes()
    print()
    print("Training heart disease model…")
    train_heart()
    print()
    print("Done. Both models saved to app/ml/")
