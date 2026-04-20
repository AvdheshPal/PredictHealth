import { useNavigate, Link } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
        <span className="text-xl font-bold text-primary">PredictHealth</span>
        <div className="flex items-center gap-6">
          <Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
          <Link to="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          <Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-green-50"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center py-24 px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Predict your health risk with{' '}
          <span className="text-primary">AI precision</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Enter your health parameters and get an instant ML-powered risk assessment for diabetes and heart disease.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90"
          >
            Start free prediction
          </button>
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            Learn more
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'ML-powered analysis',
              desc: 'Random Forest model trained on clinical datasets with 87% accuracy.',
            },
            {
              title: 'Instant results',
              desc: 'Risk scores and personalised recommendations delivered in seconds.',
            },
            {
              title: 'Full history',
              desc: 'Track your health metrics and risk trends over time.',
            },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
