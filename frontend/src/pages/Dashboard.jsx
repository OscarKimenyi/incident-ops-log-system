import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { AlertCircle, CheckCircle, Search, XCircle, Activity, TrendingUp } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    blue:   'border-blue-500/30 bg-blue-500/5',
    yellow: 'border-yellow-500/30 bg-yellow-500/5',
    green:  'border-green-500/30 bg-green-500/5',
    slate:  'border-slate-500/30 bg-slate-500/5',
    red:    'border-red-500/30 bg-red-500/5',
  };
  const iconColors = {
    blue:   'text-blue-400',
    yellow: 'text-yellow-400',
    green:  'text-green-400',
    slate:  'text-slate-400',
    red:    'text-red-400',
  };

  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-400">{label}</p>
        <Icon size={18} className={iconColors[color]} />
      </div>
      <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const { status_counts, severity_counts, recent_incidents } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Welcome back, <span className="text-slate-200 font-medium">{user?.name}</span>. Here's the current operations overview.
        </p>
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total"         value={status_counts.total}         icon={Activity}     color="blue"   />
        <StatCard label="Open"          value={status_counts.open}          icon={AlertCircle}  color="blue"   />
        <StatCard label="Investigating" value={status_counts.investigating}  icon={Search}       color="yellow" />
        <StatCard label="Resolved"      value={status_counts.resolved}      icon={CheckCircle}  color="green"  />
        <StatCard label="Closed"        value={status_counts.closed}        icon={XCircle}      color="slate"  />
      </div>

      {/* Severity Stats */}
      <div>
        <h2 className="text-base font-semibold text-slate-300 mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
          By Severity
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
            <p className="text-xs text-slate-500 mb-1">Critical</p>
            <p className="text-2xl font-bold text-red-400">{severity_counts.critical}</p>
          </div>
          <div className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
            <p className="text-xs text-slate-500 mb-1">High</p>
            <p className="text-2xl font-bold text-orange-400">{severity_counts.high}</p>
          </div>
          <div className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
            <p className="text-xs text-slate-500 mb-1">Medium</p>
            <p className="text-2xl font-bold text-blue-400">{severity_counts.medium}</p>
          </div>
          <div className="rounded-xl border border-slate-700/30 bg-slate-800/30 p-4">
            <p className="text-xs text-slate-500 mb-1">Low</p>
            <p className="text-2xl font-bold text-slate-400">{severity_counts.low}</p>
          </div>
        </div>
      </div>

      {/* Recent Incidents */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-300" style={{ fontFamily: 'Syne, sans-serif' }}>
            Recent Incidents
          </h2>
          <Link to="/incidents" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            View all →
          </Link>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
          {recent_incidents.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No incidents yet.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Title</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Severity</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Reporter</th>
                </tr>
              </thead>
              <tbody>
                {recent_incidents.map((incident, i) => (
                  <tr key={incident.id} className={`border-b border-slate-800 last:border-0 hover:bg-slate-800/40 transition-colors`}>
                    <td className="px-5 py-3.5">
                      <Link to={`/incidents/${incident.id}`} className="text-sm text-slate-200 hover:text-blue-400 transition-colors font-medium">
                        {incident.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <SeverityBadge severity={incident.severity} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={incident.status} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-400">
                      {incident.reporter?.name}
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