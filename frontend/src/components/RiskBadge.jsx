const styles = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-amber-100 text-amber-800',
  High: 'bg-red-100 text-red-800',
};

export default function RiskBadge({ label }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles[label] ?? 'bg-gray-100 text-gray-800'}`}>
      {label ?? '—'} risk
    </span>
  );
}
