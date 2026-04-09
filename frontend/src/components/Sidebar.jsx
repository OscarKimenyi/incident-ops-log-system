import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  List,
  PlusCircle,
  Users,
  LogOut,
  AlertTriangle,
  Shield,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard',        label: 'Dashboard',       icon: LayoutDashboard, roles: ['admin', 'operator', 'reporter'] },
  { to: '/incidents',        label: 'Incidents',        icon: List,            roles: ['admin', 'operator', 'reporter'] },
  { to: '/incidents/create', label: 'Report Incident',  icon: PlusCircle,      roles: ['admin', 'operator', 'reporter'] },
  { to: '/users',            label: 'User Management',  icon: Users,           roles: ['admin'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleColors = {
    admin:    'text-red-400 bg-red-500/10 border-red-500/30',
    operator: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    reporter: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-700/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <AlertTriangle size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              IncidentLog
            </h1>
            <p className="text-xs text-slate-500">Ops System</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-300">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <span className={`text-xs px-2 py-0.5 rounded border ${roleColors[user?.role]} font-medium capitalize`}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems
          .filter(item => item.roles.includes(user?.role))
          .map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-all duration-150"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}