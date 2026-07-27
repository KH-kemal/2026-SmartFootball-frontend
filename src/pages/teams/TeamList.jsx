import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Daftar Tim & Klub</h1>
          <p className="text-sm text-slate-400 mt-1">Kompetisi liga sepak bola KickRank</p>
        </div>
        <span className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 font-semibold rounded-xl text-sm">
          Total: {teams.length} Tim
        </span>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg animate-pulse">Memuat data tim...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && teams.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400 text-lg">Belum ada data tim yang terdaftar.</p>
        </div>
      )}

      {!loading && !error && teams.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between block group"
            >
              <div className="flex items-center space-x-4">
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-16 h-16 rounded-2xl bg-slate-800 p-2 border border-slate-700 object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-xl">
                    {team.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">{team.name}</h2>
                  <span className="text-xs text-slate-500">Est. {team.founded_year || '-'}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-sm">
                <span className="text-slate-400 font-medium">Jumlah Pemain</span>
                <span className="font-bold text-emerald-400">{team.players_count || 0} Pemain</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}