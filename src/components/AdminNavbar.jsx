import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <nav className="bg-slate-900 border-b border-red-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/admin/dashboard" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center font-black text-white shadow-lg shadow-red-600/30">
                ADM
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                KickRank <span className="text-red-500">Admin</span>
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <Link
                to="/admin/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === '/admin/dashboard' || location.pathname === '/admin'
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/teams"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname.startsWith('/admin/teams')
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Kelola Tim
              </Link>
              <Link
                to="/admin/players"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname.startsWith('/admin/players')
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Kelola Pemain
              </Link>
              <Link
                to="/admin/fixtures"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname.startsWith('/admin/fixtures')
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Kelola Jadwal
              </Link>
              <Link
                to="/admin/player-stats"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname.startsWith('/admin/player-stats')
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Kelola Statistik
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-sm transition-all"
            >
              ← Lihat Web
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold rounded-xl text-sm transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}