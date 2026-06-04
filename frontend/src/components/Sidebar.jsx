import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  List,
  PlusCircle,
  Users,
  LogOut,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'operator', 'reporter'] },
  { to: '/incidents', label: 'Incidents', icon: List, roles: ['admin', 'operator', 'reporter'] },
  { to: '/incidents/create', label: 'Report Incident', icon: PlusCircle, roles: ['admin', 'operator', 'reporter'] },
  { to: '/users', label: 'User Management', icon: Users, roles: ['admin'] },
];

const roleColors = {
  admin: 'text-red-400 bg-red-500/10 border-red-500/30',
  operator: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  reporter: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
};

export default function Sidebar({ isOpen, isCollapsed, toggleCollapse, closeMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    // Close mobile sidebar when a nav item is clicked
    closeMobile();
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-30 flex flex-col
          bg-slate-900 border-r border-slate-700/50
          transition-all duration-300 ease-in-out
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-slate-700/50 h-16 shrink-0 ${isCollapsed ? 'lg:justify-center px-0' : 'px-5'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <AlertTriangle size={18} className="text-white" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-base font-bold text-white truncate" style={{ fontFamily: 'Syne, sans-serif' }}>
                  IncidentLog
                </h1>
                <p className="text-xs text-slate-500">Ops System</p>
              </div>
            )}
          </div>

          {/* Collapse toggle — desktop only */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex ml-auto p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors shrink-0"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-slate-700/50 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-300 shrink-0">
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
        )}

        {/* Collapsed avatar */}
        {isCollapsed && (
          <div className="flex justify-center py-3 border-b border-slate-700/50 shrink-0">
            <div
              className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-slate-300"
              title={user?.name}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems
            .filter(item => item.roles.includes(user?.role))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg text-sm transition-all duration-150
                  ${isCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5' : 'px-3 py-2.5'}
                  ${isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                  }`
                }
              >
                <item.icon size={16} className="shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-slate-700/50 shrink-0">
          <button
            onClick={handleLogout}
            title={isCollapsed ? 'Sign Out' : undefined}
            className={`flex items-center gap-3 rounded-lg text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 w-full transition-all duration-150
              ${isCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5' : 'px-3 py-2.5'}
            `}
          >
            <LogOut size={16} className="shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}