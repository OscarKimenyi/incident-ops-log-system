import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, SlidersHorizontal, Plus, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function IncidentList() {
  const { isAdmin, isOperator } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ severity: '', status: '', search: '' });

  const fetchIncidents = async () => {
    setLoading(true);
    const params = {};
    if (filters.severity) params.severity = filters.severity;
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    const res = await api.get('/incidents', { params });
    setIncidents(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchIncidents();
  }, [filters.severity, filters.status]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchIncidents();
  };

  const clearFilters = () => {
    setFilters({ severity: '', status: '', search: '' });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Incidents</h1>
          <p className="text-slate-400 text-sm mt-1">{incidents.length} incident{incidents.length !== 1 ? 's' : ''} found</p>
        </div>
        <Link
          to="/incidents/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          Report Incident
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-48">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search incidents..."
                className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button type="submit" className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors">
              Search
            </button>
          </form>

          {/* Severity Filter */}
          <select
            value={filters.severity}
            onChange={e => setFilters({ ...filters, severity: e.target.value })}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {(filters.severity || filters.status || filters.search) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><LoadingSpinner /></div>
        ) : incidents.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500 text-sm">No incidents match your filters.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Title</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Severity</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Reporter</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Assigned To</th>
                <th className="text-left text-xs font-medium text-slate-500 px-5 py-3">Date</th>
                <th className="text-xs font-medium text-slate-500 px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-4">
                    <Link to={`/incidents/${incident.id}`} className="text-sm font-medium text-slate-200 hover:text-blue-400 transition-colors block max-w-xs truncate">
                      {incident.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <SeverityBadge severity={incident.severity} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={incident.status} />
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-400">{incident.reporter?.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-400">
                    {incident.assignee?.name || <span className="text-slate-600 italic">Unassigned</span>}
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">
                    {new Date(incident.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <Link to={`/incidents/${incident.id}`} className="text-slate-600 hover:text-slate-300 transition-colors">
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}