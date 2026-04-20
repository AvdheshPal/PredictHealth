import { useEffect, useState } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import RiskBadge from '../components/RiskBadge';

const ringColor = { Low: 'border-green-500', Medium: 'border-amber-500', High: 'border-red-500' };
const dotColor = ['bg-green-500', 'bg-amber-500', 'bg-blue-500'];

export default function Results() {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const [result, setResult] = useState(state?.result ?? null);
  const [loading, setLoading] = useState(!result && !!id);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!result && id) {
      api.get(`/api/history/${id}`)
        .then(({ data }) => setResult(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [id, result]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center mt-20 text-gray-500">Loading…</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="text-center mt-20 text-gray-500">No result found. <Link to="/predict" className="text-primary">Try again</Link></p>
      </div>
    );
  }

  const { risk_percent, risk_label, disease_type, feature_importances = {}, recommendations = [] } = result;

  const maxImportance = Math.max(...Object.values(feature_importances), 0.0001);

  async function handleSave() {
    setSaving(true);
    try {
      await api.post('/api/history', result);
      setSaved(true);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header actions */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            {saved ? 'Saved' : saving ? 'Saving…' : 'Save result'}
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:opacity-90"
          >
            Download PDF
          </button>
        </div>

        {/* Risk summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center gap-6 mb-6">
          <div className={`flex-shrink-0 w-24 h-24 rounded-full border-4 ${ringColor[risk_label] ?? 'border-gray-300'} flex items-center justify-center`}>
            <span className="text-2xl font-bold text-gray-900">{risk_percent}%</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900 capitalize">
                {risk_label} {disease_type} risk
              </h2>
              <RiskBadge label={risk_label} />
            </div>
            <p className="text-gray-600 text-sm">
              {risk_label === 'Low' && 'Your current parameters suggest a low disease risk. Maintain healthy habits and schedule regular check-ups.'}
              {risk_label === 'Medium' && 'Your parameters indicate a moderate risk. Consider lifestyle adjustments and consult your doctor.'}
              {risk_label === 'High' && 'Your parameters indicate a high risk. Please seek medical advice promptly and follow your doctor\'s guidance.'}
            </p>
          </div>
        </div>

        {/* Feature importance bars */}
        {Object.keys(feature_importances).length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Feature influence</h3>
            <div className="space-y-3">
              {Object.entries(feature_importances).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm text-gray-700 mb-1">
                    <span>{key} influence</span>
                    <span>{Math.round((val / maxImportance) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(val / maxImportance) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`mt-1.5 h-2.5 w-2.5 rounded-full flex-shrink-0 ${dotColor[i % dotColor.length]}`} />
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link to="/predict" className="text-sm text-primary hover:underline">
          ← Try another prediction
        </Link>
      </div>
    </div>
  );
}
