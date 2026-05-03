import Navbar from '../components/Navbar';

const features = [
  {
    title: 'ML-Powered Analysis',
    desc: 'Our Random Forest classifier is trained on clinically validated datasets — the Pima Indians Diabetes Database and the UCI Heart Disease Dataset — achieving up to 87% accuracy on held-out test data.',
    detail: 'The model evaluates up to 10 health parameters simultaneously and outputs a calibrated probability score rather than a simple yes/no, giving you a nuanced picture of your risk level.',
  },
  {
    title: 'Two Disease Models',
    desc: 'PredictHealth currently supports risk assessment for two of the world\'s most prevalent chronic diseases.',
    detail: 'Diabetes model: 8 input features including glucose, BMI, and insulin. Heart Disease model: 10 input features including cholesterol, chest pain type, and resting ECG readings.',
  },
  {
    title: 'Instant Results',
    desc: 'Get your risk score, feature influence breakdown, and personalised recommendations within seconds of submitting your parameters.',
    detail: 'Results are categorised as Low (<30%), Medium (30–60%), or High (>60%) risk, each paired with three actionable recommendations covering diet, exercise, and medical follow-up.',
  },
  {
    title: 'Full Prediction History',
    desc: 'Every prediction you run is saved to your account, giving you a longitudinal view of how your health parameters change over time.',
    detail: 'Browse your complete prediction log, revisit any past result in detail, and track whether lifestyle changes are moving your risk score in the right direction.',
  },
  {
    title: 'Secure & Private',
    desc: 'Your health data is protected with Firebase Authentication — every API request carries a short-lived ID token verified by the backend.',
    detail: 'Sessions are managed by the Firebase SDK in browser IndexedDB. Tokens are refreshed automatically and never stored in localStorage or sessionStorage. No health data is shared with third parties.',
  },
  {
    title: 'PDF Export',
    desc: 'Download any result as a print-ready PDF to share with your doctor or keep for your personal records.',
    detail: 'The exported document includes the risk summary, feature influence bars, and all three recommendations — formatted cleanly for A4 and letter paper sizes.',
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gray-50 py-16 px-6 text-center border-b border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Everything you need to understand your <span className="text-primary">health risk</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          PredictHealth combines clinical datasets with machine learning to give you accurate, actionable insights — no lab visit required.
        </p>
      </section>

      {/* Feature grid */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
              <div className="h-2 w-10 bg-primary rounded-full mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{f.desc}</p>
              <p className="text-xs text-gray-400">{f.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
