import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

export default function TeamDetail() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeamDetail();
  }, [id]);

  const fetchTeamDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/teams/${id}`);
      setTeam(response.data);
      setError(null);
    } catch (err) {
      setError('Gagal mengambil detail tim.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg animate-pulse">Memuat detail tim...</p>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400 mb-4">
          {error || 'Tim tidak ditemukan.'}
        </div>
        <Link to="/teams" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold">
          Kembali ke Daftar Tim
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/teams" className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
          ← Kembali ke Daftar Tim
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          {team.logo ? (
            <img src={team.logo} alt={team.name} className="w-20 h-20 rounded-2xl bg-slate-800 p-2 border border-slate-700 object-cover shadow-lg" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-2xl shadow-lg">
              {team.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{team.name}</h1>
            <p className="text-slate-400 font-medium mt-1">Didirikan tahun <span className="text-white font-bold">{team.founded_year || '-'}</span></p>
            <p className="text-slate-500 text-sm mt-2 max-w-xl">{team.description || 'Tidak ada deskripsi.'}</p>
          </div>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl px-6 py-4 flex flex-col items-end min-w-[160px]">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Skuad</span>
          <span className="text-3xl font-black text-emerald-400 mt-1">{team.players ? team.players.length : 0} <span className="text-sm font-bold text-slate-500">Pemain</span></span>
        </div>
      </div>

      <h2 className="text-2xl font-extrabold text-white mb-6">Daftar Pemain Skuad</h2>

      {!team.players || team.players.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400 text-lg">Belum ada pemain yang terdaftar di tim ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.players.map((player) => (
            <Link key={player.id} to={`/players/${player.id}`} className="block group h-full">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl group-hover:border-blue-500/50 group-hover:shadow-2xl group-hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-xs font-semibold">
                      {player.position}
                    </span>
                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-lg font-black text-amber-400">
                      #{player.jersey_number}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-blue-400 transition-colors">{player.name}</h3>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Overall Rating</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-black text-emerald-400">{Number(player.overall_rating).toFixed(2)}</span>
                    <span className="text-xs text-slate-500 font-bold">/ 100</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}