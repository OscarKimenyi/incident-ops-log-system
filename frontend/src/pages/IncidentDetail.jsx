import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import SeverityBadge from '../components/SeverityBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, MessageSquare, GitMerge, UserCheck, Clock } from 'lucide-react';

const STATUS_FLOW = {
  open: 'investigating',
  investigating: 'resolved',
  resolved: 'closed',
};

const STATUS_LABELS = {
  investigating: 'Move to Investigating',
  resolved:      'Mark as Resolved',
  closed:        'Close Incident',
};

function TimelineItem({ update }) {
  const actionConfig = {
    created:       { icon: '🟢', label: 'Incident Created' },
    status_changed:{ icon: '🔄', label: 'Status Updated' },
    comment_added: { icon: '💬', label: 'Comment Added' },
    assigned:      { icon: '👤', label: 'Incident Assigned' },
  };

  const config = actionConfig[update.action] || { icon: '📝', label: update.action };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm flex-shrink-0">
          {config.icon}
        </div>
        <div className="w-px bg-slate-700/50 flex-1 mt-2" />
      </div>
      <div className="pb-5 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-medium text-slate-200">{update.user?.name}</span>
          <span className="text-xs text-slate-500">{config.label}</span>
          {update.old_status && update.new_status && (
            <span className="text-xs text-slate-500">
              <StatusBadge status={update.old_status} /> → <StatusBadge status={update.new_status} />
            </span>
          )}
        </div>
        {update.comment && (
          <p className="text-sm text-slate-400 bg-slate-800/50 rounded-lg px-3 py-2 mt-1.5 border border-slate-700/30">
            {update.comment}
          </p>
        )}
        <p className="text-xs text-slate-600 mt-1.5">
          {new Date(update.created_at).toLocaleString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}

export default function IncidentDetail() {
  const { id } = useParams();
  const { isAdmin, isOperator, user } = useAuth();
  const [incident, setIncident] = useState(null);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchIncident = async () => {
    const res = await api.get(`/incidents/${id}`);
    setIncident(res.data);
  };

  useEffect(() => {
    const load = async () => {
      await fetchIncident();
      if (isAdmin()) {
        const opRes = await api.get('/operators');
        setOperators(opRes.data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleStatusUpdate = async () => {
    const nextStatus = STATUS_FLOW[incident.status];
    if (!nextStatus) return;
    setSubmitting(true);
    setError('');
    try {
      await api.patch(`/incidents/${id}/status`, { status: nextStatus, comment: statusComment });
      await fetchIncident();
      setStatusComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssign = async () => {
    if (!assignTo) return;
    setSubmitting(true);
    try {
      await api.patch(`/incidents/${id}/assign`, { assigned_to: assignTo });
      await fetchIncident();
      setAssignTo('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign incident.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/incidents/${id}/comment`, { comment });
      await fetchIncident();
      setComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center pt-20"><LoadingSpinner size="lg" /></div>;
  if (!incident) return <div className="text-slate-400 p-8">Incident not found.</div>;

  const nextStatus = STATUS_FLOW[incident.status];
  const canUpdateStatus = isOperator() && nextStatus;

  return (
    <div className="max-w-5xl space-y-6">
      {/* Back */}
      <Link to="/incidents" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
        <ArrowLeft size={16} /> Back to Incidents
      </Link>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Incident Info */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-xl font-bold text-white leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                {incident.title}
              </h1>
              <span className="text-xs text-slate-600 flex-shrink-0">#{incident.id}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <StatusBadge status={incident.status} />
              <SeverityBadge severity={incident.severity} />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{incident.description}</p>
          </div>

          {/* Status Update — Operators/Admins only */}
          {canUpdateStatus && (
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5">
              <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                <GitMerge size={15} /> Update Status
              </h2>
              <textarea
                value={statusComment}
                onChange={e => setStatusComment(e.target.value)}
                placeholder="Add a note about this status change (optional)..."
                rows={2}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none mb-3"
              />
              <button
                onClick={handleStatusUpdate}
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {STATUS_LABELS[nextStatus]}
              </button>
            </div>
          )}

          {/* Assign — Admin only */}
          {isAdmin() && (
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5">
              <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                <UserCheck size={15} /> Assign Incident
              </h2>
              <div className="flex gap-3">
                <select
                  value={assignTo}
                  onChange={e => setAssignTo(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select an operator...</option>
                  {operators.map(op => (
                    <option key={op.id} value={op.id}>{op.name} ({op.role})</option>
                  ))}
                </select>
                <button
                  onClick={handleAssign}
                  disabled={submitting || !assignTo}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Assign
                </button>
              </div>
            </div>
          )}

          {/* Comment */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5">
            <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              <MessageSquare size={15} /> Add Comment
            </h2>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Type your comment..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none mb-3"
            />
            <button
              onClick={handleComment}
              disabled={submitting || !comment.trim()}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Post Comment
            </button>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5">
            <h2 className="text-sm font-semibold text-slate-300 mb-5 flex items-center gap-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              <Clock size={15} /> Activity Timeline
            </h2>
            {incident.updates?.length === 0 ? (
              <p className="text-slate-500 text-sm">No activity yet.</p>
            ) : (
              <div>
                {incident.updates?.map(update => (
                  <TimelineItem key={update.id} update={update} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-5">
            <h2 className="text-sm font-semibold text-slate-300 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Status</p>
                <StatusBadge status={incident.status} />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Severity</p>
                <SeverityBadge severity={incident.severity} />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Reported by</p>
                <p className="text-sm text-slate-300">{incident.reporter?.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Assigned to</p>
                <p className="text-sm text-slate-300">
                  {incident.assignee?.name || <span className="text-slate-600 italic">Unassigned</span>}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Created</p>
                <p className="text-sm text-slate-300">
                  {new Date(incident.created_at).toLocaleString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Last updated</p>
                <p className="text-sm text-slate-300">
                  {new Date(incident.updated_at).toLocaleString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Status Workflow Guide */}
          <div className="rounded-xl border border-slate-700/30 bg-slate-900/30 p-5">
            <h2 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wide">Status Flow</h2>
            <div className="space-y-2">
              {['open', 'investigating', 'resolved', 'closed'].map((s, i) => (
                <div key={s} className={`flex items-center gap-2 ${incident.status === s ? 'opacity-100' : 'opacity-40'}`}>
                  <StatusBadge status={s} />
                  {i < 3 && <span className="text-xs text-slate-600">↓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}