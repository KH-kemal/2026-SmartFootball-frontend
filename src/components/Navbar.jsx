import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import api from '../services/api';

export default function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Sync user state on navigation/mount
    const savedUser = localStorage.getItem('user');
    setUser(savedUser ? JSON.parse(savedUser) : null);
  }, [location]);

  useEffect(() => {
    // Handle click outside dropdown to close it
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigation = [
    { name: 'Daftar Tim', href: '/teams' },
    { name: 'Daftar Pemain', href: '/players' },
    { name: 'Jadwal & Skor', href: '/fixtures' },
    { name: 'Klasemen', href: '/league-table' },
    { name: 'Leaderboard', href: '/leaderboard' },
  ];

  const visibleNavigation = user ? navigation : [];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    if (href === '/teams') {
      return location.pathname === '/teams' || location.pathname.startsWith('/teams/');
    }
    return location.pathname === href;
  };

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setProfileMenuOpen(false);
      navigate('/');
      window.location.reload();
    }
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src="/logo.png" 
                alt="SmartFootball Logo" 
                className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-md" 
              />
              <span className="font-black text-xl tracking-tight text-slate-800 dark:text-white transition-colors duration-300">
                Smart<span className="text-primary">Football</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1.5">
              {visibleNavigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                      active
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right section: User Profile / Login & Theme Switcher */}
          <div className="flex items-center space-x-4">
            {/* Theme switcher */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-770 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-400 stroke-[2.5]" />
              ) : (
                <Moon size={18} className="text-slate-700 stroke-[2.5]" />
              )}
            </button>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                /* Profile Dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 p-1.5 pr-3 rounded-full bg-slate-50 hover:bg-slate-105 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-300 hover:scale-102 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-violet-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                      {getUserInitials(user.name)}
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>

                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl py-2.5 z-50 transition-all transform origin-top-right">
                      {/* User details header */}
                      <div className="px-4 py-2">
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                          Masuk sebagai
                        </p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      
                      <div className="border-t border-slate-100 dark:border-slate-800/80 my-2"></div>

                      {/* Admin panel option */}
                      {user.email === 'admin@smartfootball.com' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileMenuOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary dark:hover:text-white transition-all"
                        >
                          <LayoutDashboard size={16} />
                          <span>Panel Admin</span>
                        </Link>
                      )}

                      {/* Logout button */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 transition-all text-left"
                      >
                        <LogOut size={16} />
                        <span>Keluar</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Login / Register Buttons */
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50 transition-all duration-300"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 transition-all duration-300"
            >
              {mobileMenuOpen ? <X size={18} className="stroke-[2.5]" /> : <Menu size={18} className="stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 transition-all duration-300">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {visibleNavigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-base font-bold transition-all duration-300 ${
                    active
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile Auth Links */}
            <div className="border-t border-slate-200 dark:border-slate-800/80 my-3 pt-3 px-2">
              {user ? (
                <div className="space-y-2">
                  <div className="px-4 py-1.5">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      Masuk sebagai
                    </p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  {user.email === 'admin@smartfootball.com' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-2.5 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <LayoutDashboard size={16} />
                      <span>Panel Admin</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center space-x-2.5 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-left"
                  >
                    <LogOut size={16} />
                    <span>Keluar</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 px-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-md"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}