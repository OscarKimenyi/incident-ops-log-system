const config = {
  low:      { label: 'Low',      class: 'bg-slate-500/20 text-slate-300 border border-slate-500/30' },
  medium:   { label: 'Medium',   class: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
  high:     { label: 'High',     class: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
  critical: { label: 'Critical', class: 'bg-red-500/20 text-red-400 border border-red-500/30' },
};

export default function SeverityBadge({ severity }) {
  const c = config[severity] || config.low;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.class}`}>
      {c.label}
    </span>
  );
}