import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/30">
                KR
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Kick<span className="text-blue-500">Rank</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/teams"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === '/teams' || location.pathname === '/'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Daftar Tim
              </Link>
              <Link
                to="/players"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === '/players'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Daftar Pemain
              </Link>
              <Link
                to="/fixtures"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === '/fixtures'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Jadwal & Skor
              </Link>
              <Link
                to="/league-table"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === '/league-table'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Klasemen
              </Link>
              <Link
                to="/leaderboard"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === '/leaderboard'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}