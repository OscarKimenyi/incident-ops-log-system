import Sidebar from './Sidebar';
import useSidebar from '../hooks/useSidebar';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { isOpen, isCollapsed, toggleMobile, toggleCollapse, closeMobile } = useSidebar();
  const { user } = useAuth();

  const roleColors = {
    admin: 'text-red-400 bg-red-500/10 border-red-500/30',
    operator: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    reporter: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar
        isOpen={isOpen}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        closeMobile={closeMobile}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top navbar */}
        <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-slate-900 border-b border-slate-700/50 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMobile}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="text-base font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              IncidentLog
            </span>
          </div>

          {/* User role badge on mobile */}
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded border ${roleColors[user?.role]} font-medium capitalize`}>
              {user?.role}
            </span>
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-slate-300">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}