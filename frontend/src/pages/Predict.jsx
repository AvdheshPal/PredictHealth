import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const DIABETES_FIELDS = [
  { key: 'Pregnancies', label: 'Pregnancies', min: 0, max: 17, step: 1, defaultVal: 1 },
  { key: 'Glucose', label: 'Glucose (mg/dL)', min: 50, max: 250, step: 1, defaultVal: 120 },
  { key: 'BloodPressure', label: 'Blood Pressure (mmHg)', min: 40, max: 140, step: 1, defaultVal: 80 },
  { key: 'SkinThickness', label: 'Skin Thickness (mm)', min: 0, max: 100, step: 1, defaultVal: 20 },
  { key: 'Insulin', label: 'Insulin (µU/mL)', min: 0, max: 400, step: 1, defaultVal: 80 },
  { key: 'BMI', label: 'BMI', min: 10, max: 60, step: 0.1, defaultVal: 25 },
  { key: 'DiabetesPedigreeFunction', label: 'Diabetes Pedigree Function', min: 0.0, max: 2.5, step: 0.01, defaultVal: 0.5 },
  { key: 'Age', label: 'Age', min: 10, max: 90, step: 1, defaultVal: 30 },
];

const HEART_FIELDS = [
  { key: 'age', label: 'Age', type: 'slider', min: 20, max: 80, step: 1, defaultVal: 50 },
  { key: 'sex', label: 'Sex', type: 'select', options: [{ label: 'Male', value: 1 }, { label: 'Female', value: 0 }], defaultVal: 1 },
  { key: 'cp', label: 'Chest Pain Type', type: 'select', options: [0, 1, 2, 3].map((v) => ({ label: String(v), value: v })), defaultVal: 0 },
  { key: 'trestbps', label: 'Resting BP (mmHg)', type: 'slider', min: 80, max: 200, step: 1, defaultVal: 120 },
  { key: 'chol', label: 'Cholesterol (mg/dL)', type: 'slider', min: 100, max: 400, step: 1, defaultVal: 200 },
  { key: 'fbs', label: 'Fasting BS > 120 mg/dL', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }], defaultVal: 0 },
  { key: 'restecg', label: 'Resting ECG', type: 'select', options: [0, 1, 2].map((v) => ({ label: String(v), value: v })), defaultVal: 0 },
  { key: 'thalach', label: 'Max Heart Rate', type: 'slider', min: 60, max: 220, step: 1, defaultVal: 150 },
  { key: 'exang', label: 'Exercise Angina', type: 'select', options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }], defaultVal: 0 },
  { key: 'oldpeak', label: 'ST Depression', type: 'slider', min: 0.0, max: 6.0, step: 0.1, defaultVal: 1.0 },
];

function buildDefaults(fields) {
  return Object.fromEntries(fields.map((f) => [f.key, f.defaultVal]));
}

export default function Predict() {
  const navigate = useNavigate();
  const [disease, setDisease] = useState('diabetes');
  const [values, setValues] = useState(buildDefaults(DIABETES_FIELDS));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleDiseaseChange(d) {
    setDisease(d);
    setValues(buildDefaults(d === 'diabetes' ? DIABETES_FIELDS : HEART_FIELDS));
  }

  const fields = disease === 'diabetes' ? DIABETES_FIELDS : HEART_FIELDS;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/predict', { disease_type: disease, features: values });
      navigate('/results', { state: { result: data } });
    } catch {
      setError('Prediction failed. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900">New prediction</h1>
        <p className="text-gray-500 text-sm mt-1 mb-6">Enter your health parameters below</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Disease type</label>
            <select
              value={disease}
              onChange={(e) => handleDiseaseChange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="diabetes">Diabetes</option>
              <option value="heart">Heart Disease</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>{field.label}</span>
                  {field.type !== 'select' && (
                    <span className="text-primary font-semibold">{values[field.key]}</span>
                  )}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={values[field.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {field.options.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="range"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={values[field.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [field.key]: Number(e.target.value) }))}
                    className="w-full accent-primary"
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {loading ? 'Running prediction…' : 'Run prediction'}
          </button>
        </form>
      </div>
    </div>
  );
}
