import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Settings, 
  Bot, 
  Building2, 
  Menu,
  X,
  LogOut,
  DollarSign
} from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { clearSession, readSession, type FounderSession } from '@/lib/localStore';
import BrandLogo from './BrandLogo';
import DarkModeToggle from './DarkModeToggle';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [session, setSession] = useState<FounderSession | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Building2, label: 'Companies', path: '/dashboard/companies' },
    { icon: Briefcase, label: 'Projects', path: '/dashboard/projects' },
    { icon: Users, label: 'CRM', path: '/dashboard/crm' },
    { icon: DollarSign, label: 'Finance', path: '/dashboard/finance' },
    { icon: Bot, label: 'AI Advisor', path: '/dashboard/ai' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  useEffect(() => {
    const syncSession = () => {
      const storedSession = readSession();
      if (!storedSession) {
        navigate('/auth', { replace: true });
        return;
      }
      setSession(storedSession);
    };

    syncSession();
    window.addEventListener('founderos:session-updated', syncSession);
    return () => window.removeEventListener('founderos:session-updated', syncSession);
  }, [navigate]);

  const handleLogout = () => {
    clearSession();
    navigate('/auth', { replace: true });
  };

  const initials = (session?.name || session?.email || 'DF')
    .split(/\s|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <div className="flex h-dvh bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        className="relative z-20 hidden flex-shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-white md:flex"
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <BrandLogo className="h-8 w-8 flex-shrink-0" />
            {isSidebarOpen && (
              <span className="font-bold text-lg whitespace-nowrap">FounderOS</span>
            )}
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                  isActive 
                    ? "bg-indigo-600 text-white" 
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                {isSidebarOpen && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
          <h1 className="text-lg font-semibold text-slate-800 md:text-xl">
            {navItems.find(i => i.path === location.pathname)?.label || 'Overview'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">{session?.name || 'Demo Founder'}</p>
              <p className="text-xs text-slate-500">{session?.email || 'founder@founderos.local'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium text-sm flex-shrink-0">
              {initials || 'DF'}
            </div>
            <DarkModeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-rose-600"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 pb-24 md:p-8">
          <Outlet />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-7 border-t border-slate-200 bg-white px-1 py-2 shadow-lg md:hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-0.5 text-[9px] font-semibold transition-colors",
                isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-500"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="max-w-full truncate">{item.label.replace('Dashboard', 'Home').replace('Companies', 'Co.')}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
