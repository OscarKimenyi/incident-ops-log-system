import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function CreateIncident() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', severity: 'medium' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/incidents', form);
      navigate(`/incidents/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create incident.');
    } finally {
      setLoading(false);
    }
  };

  const severities = [
    { value: 'low',      label: 'Low',      desc: 'Minor issue, minimal impact',          color: 'border-slate-500 text-slate-300' },
    { value: 'medium',   label: 'Medium',   desc: 'Moderate impact, needs attention',       color: 'border-blue-500 text-blue-300' },
    { value: 'high',     label: 'High',     desc: 'Significant impact on operations',       color: 'border-orange-500 text-orange-400' },
    { value: 'critical', label: 'Critical', desc: 'Severe impact, immediate action required',color: 'border-red-500 text-red-400' },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <Link to="/incidents" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
        <ArrowLeft size={16} /> Back to Incidents
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          Report New Incident
        </h1>
        <p className="text-slate-400 text-sm mt-1">Provide details about the operational incident you've observed.</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300" style={{ fontFamily: 'Syne, sans-serif' }}>Incident Information</h2>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Brief description of what's happening..."
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Provide detailed information: what happened, when it started, who is affected, any error messages..."
              rows={5}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
              required
            />
          </div>
        </div>

        {/* Severity */}
        <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Severity Level</h2>
          <div className="grid grid-cols-2 gap-3">
            {severities.map(sev => (
              <label
                key={sev.value}
                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                  form.severity === sev.value
                    ? `${sev.color} bg-slate-800/80`
                    : 'border-slate-700 text-slate-500 hover:border-slate-500 hover:bg-slate-800/30'
                }`}
              >
                <input
                  type="radio"
                  name="severity"
                  value={sev.value}
                  checked={form.severity === sev.value}
                  onChange={e => setForm({ ...form, severity: e.target.value })}
                  className="sr-only"
                />
                <p className="text-sm font-semibold mb-0.5">{sev.label}</p>
                <p className="text-xs opacity-70">{sev.desc}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <AlertTriangle size={15} />
            {loading ? 'Reporting...' : 'Report Incident'}
          </button>
          <Link
            to="/incidents"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}