import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users } from 'lucide-react';
import api from '../../services/api';

export default function TeamList() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await api.get('/teams');
      setTeams(response.data);
      setError(null);
    } catch (err) {
      setError('Gagal mengambil data tim dari server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <Trophy className="text-primary" /> Daftar Tim & Klub
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Kompetisi liga sepak bola SmartFootball</p>
        </div>
        <span className="self-start sm:self-center px-4 py-2 bg-primary/10 border border-primary/20 text-primary font-bold rounded-xl text-sm transition-colors">
          Total: {teams.length} Tim
        </span>
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Memuat data tim...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-500 dark:text-red-400 font-semibold max-w-lg mx-auto">
          {error}
        </div>
      )}

      {!loading && !error && teams.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-md transition-colors duration-300">
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Belum ada data tim yang terdaftar.</p>
        </div>
      )}

      {!loading && !error && teams.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between block group"
            >
              <div className="flex items-center space-x-4">
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 p-2 border border-slate-200/60 dark:border-slate-700/60 object-cover shadow-sm group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-xl group-hover:scale-105 transition-transform">
                    {team.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-wide transition-colors group-hover:text-primary">{team.name}</h2>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mt-0.5">Est. {team.founded_year || '-'}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-sm transition-colors duration-300">
                <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
                  <Users size={16} className="text-slate-400" /> Jumlah Pemain
                </span>
                <span className="font-extrabold text-primary">{team.players_count || 0} Pemain</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}