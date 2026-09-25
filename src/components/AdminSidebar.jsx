import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Shield, User, Calendar, BarChart3,
  LogOut, Globe, Sun, Moon, Menu, X, ChevronLeft, ChevronRight, QrCode
} from 'lucide-react';
import api from '../services/api';

export default function AdminSidebar({ theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Kelola Tim', path: '/admin/teams', icon: Shield },
    { name: 'Kelola Pemain', path: '/admin/players', icon: User },
    { name: 'Screening Pemain', path: '/admin/screening', icon: QrCode },
    { name: 'Kelola Jadwal', path: '/admin/fixtures', icon: Calendar },
    { name: 'Kelola Statistik', path: '/admin/player-stats', icon: BarChart3 },
  ];

  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard' || location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      {/* Collapse Toggle Button (Desktop Only) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex absolute -right-3 top-[30px] w-6 h-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shadow-xs hover:shadow-sm hover:scale-110 active:scale-95 transition-all z-50 cursor-pointer"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Upper Section */}
      <div>
        {/* Brand */}
        <div className={`p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 ${isCollapsed ? 'justify-center' : ''}`}>
          <Link to="/admin/dashboard" className="flex items-center space-x-3 group">
            <img
              src="/logo.png"
              alt="SmartFootball Logo"
              className="w-9 h-9 object-contain shrink-0 transition-transform duration-300 group-hover:scale-105"
            />
            {!isCollapsed && (
              <span className="font-extrabold text-base tracking-tight text-slate-800 dark:text-white">
                Smart<span className="text-primary">Admin</span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation Menu */}
        <div className="px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  active
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={item.name}
              >
                <Icon size={18} className="shrink-0 stroke-[2.2]" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Lower Section (Theme, Public Web, Profile, Logout) */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-200/40 dark:hover:border-slate-700/40 ${isCollapsed ? 'justify-center' : ''}`}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={16} className="text-amber-400 stroke-[2.5] shrink-0" />
              {!isCollapsed && <span>Mode Terang</span>}
            </>
          ) : (
            <>
              <Moon size={16} className="text-slate-600 dark:text-slate-400 stroke-[2.5] shrink-0" />
              {!isCollapsed && <span>Mode Gelap</span>}
            </>
          )}
        </button>

        {/* Public Website */}
        <Link
          to="/"
          className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all ${isCollapsed ? 'justify-center' : ''}`}
        >
          <Globe size={16} className="shrink-0 stroke-[2.2]" />
          {!isCollapsed && <span>Lihat Web</span>}
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-all ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={16} className="shrink-0 stroke-[2.2]" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:block shrink-0 h-screen sticky top-0 transition-all duration-300 z-40 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-40 transition-colors duration-300">
        <Link to="/admin/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-white shadow-md shadow-primary/30">
            SF
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-800 dark:text-white">
            Smart<span className="text-primary">Admin</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          {/* Sidebar Drawer */}
          <div className="relative w-64 h-full flex flex-col z-55">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
