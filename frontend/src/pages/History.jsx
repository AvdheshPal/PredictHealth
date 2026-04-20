import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import RiskBadge from '../components/RiskBadge';

export default function History() {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/history')
      .then(({ data }) => setPredictions(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Prediction history</h1>
          <span className="text-sm text-gray-500">{predictions.length} record{predictions.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {loading ? (
            <p className="p-6 text-gray-500 text-sm">Loading…</p>
          ) : predictions.length === 0 ? (
            <p className="p-6 text-gray-500 text-sm">
              No predictions yet.{' '}
              <button onClick={() => navigate('/predict')} className="text-primary hover:underline">
                Start your first prediction.
              </button>
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  {['Date', 'Disease', 'Risk %', 'Result', 'Action'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {predictions.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-3">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3 capitalize">{p.disease_type}</td>
                    <td className="px-5 py-3">{Math.round(p.risk_score * 100)}%</td>
                    <td className="px-5 py-3"><RiskBadge label={p.risk_label} /></td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => navigate(`/results?id=${p.id}`)}
                        className="text-primary hover:underline text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
