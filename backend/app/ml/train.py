# One-time training script — run before starting the backend for the first time
# Diabetes model:
#   - Reads diabetes.csv (Pima Indians dataset from Kaggle)
#   - Features: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age
#   - Target: Outcome; splits 80/20, trains RandomForestClassifier(n_estimators=100)
#   - Saves to app/ml/diabetes_model.pkl via joblib
# Heart disease model:
#   - Reads heart.csv (UCI Heart Disease dataset from Kaggle)
#   - Features: age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak
#   - Target: target; same train/test split and RF classifier
#   - Saves to app/ml/heart_model.pkl via joblib
