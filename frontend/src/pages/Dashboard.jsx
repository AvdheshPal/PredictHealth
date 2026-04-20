import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import RiskBadge from '../components/RiskBadge';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/history?limit=3')
      .then(({ data }) => setPredictions(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const total = predictions.length;
  const last = predictions[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting}, {user?.displayName?.split(' ')[0]}
          </h1>
          {last && <RiskBadge label={last.risk_label} />}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total predictions</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{total}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Last risk score</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {last ? `${Math.round(last.risk_score * 100)}% — ${last.disease_type}` : '—'}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Last checked</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {last ? new Date(last.created_at).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>

        {/* Recent table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent predictions</h2>
            <button
              onClick={() => navigate('/predict')}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:opacity-90"
            >
              + New prediction
            </button>
          </div>
          {loading ? (
            <p className="p-5 text-gray-500 text-sm">Loading…</p>
          ) : predictions.length === 0 ? (
            <p className="p-5 text-gray-500 text-sm">No predictions yet. Start your first prediction.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  {['Date', 'Disease', 'Risk %', 'Status'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {predictions.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/results?id=${p.id}`)}
                    className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-5 py-3">{new Date(p.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-3 capitalize">{p.disease_type}</td>
                    <td className="px-5 py-3">{Math.round(p.risk_score * 100)}%</td>
                    <td className="px-5 py-3"><RiskBadge label={p.risk_label} /></td>
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
