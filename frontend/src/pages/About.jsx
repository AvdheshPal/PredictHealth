import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gray-50 py-16 px-6 text-center border-b border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          About <span className="text-primary">PredictHealth</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          An academic project built to demonstrate the practical application of machine learning in preventive healthcare.
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        {/* Project */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">The project</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            PredictHealth is a full-stack web application developed as an MCA 4th Semester Major Project at Chandigarh University (23ONMCR-753). The goal is to show how a clean, production-style architecture can bridge the gap between a trained ML model and an end user with no technical background.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            Users enter their health parameters through an intuitive form, the request is forwarded to a FastAPI backend, a pre-trained Random Forest model scores the input, and the result — along with personalised recommendations — is returned within seconds.
          </p>
        </section>

        {/* Tech stack */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tech stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              ['Frontend', 'React 18 + Vite'],
              ['Styling', 'Tailwind CSS'],
              ['Routing', 'React Router v6'],
              ['HTTP client', 'Axios'],
              ['Backend', 'FastAPI (Python)'],
              ['Database', 'SQLite + SQLAlchemy'],
              ['Auth', 'JWT + bcrypt'],
              ['ML', 'Scikit-learn'],
              ['Model type', 'Random Forest'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-gray-200 px-4 py-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Datasets */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Datasets used</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
              <span><strong>Pima Indians Diabetes Database</strong> — 768 female patients, 8 clinical features. Source: UCI Machine Learning Repository.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
              <span><strong>UCI Heart Disease Dataset</strong> — 303 patients, 10 features including ECG readings and exercise stress test results.</span>
            </li>
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-800 mb-1">Medical disclaimer</h3>
          <p className="text-sm text-amber-700">
            PredictHealth is an academic demonstration tool. Results are based on statistical patterns in historical datasets and are <strong>not</strong> a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider with any questions about your health.
          </p>
        </section>

        <div className="text-center">
          <Link to="/register" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90">
            Try it for free
          </Link>
        </div>
      </div>
    </div>
  );
}
