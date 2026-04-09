const config = {
  open:          { label: 'Open',          class: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
  investigating: { label: 'Investigating', class: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
  resolved:      { label: 'Resolved',      class: 'bg-green-500/20 text-green-400 border border-green-500/30' },
  closed:        { label: 'Closed',         class: 'bg-slate-500/20 text-slate-400 border border-slate-500/30' },
};

export default function StatusBadge({ status }) {
  const c = config[status] || config.open;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.class}`}>
      {c.label}
    </span>
  );
}