import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

export default function PlayerDetail() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlayerDetail();
  }, [id]);

  const fetchPlayerDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/players/${id}`);
      setPlayer(response.data);
      setError(null);
    } catch (err) {
      setError('Gagal mengambil detail pemain.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg animate-pulse">Memuat detail pemain...</p>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400 mb-4">
          {error || 'Pemain tidak ditemukan.'}
        </div>
        <Link to="/players" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold">
          Kembali ke Daftar Pemain
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/players" className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
          ← Kembali ke Daftar Pemain
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-6">
            {player.photo ? (
              <img src={player.photo} alt={player.name} className="w-20 h-20 rounded-2xl bg-slate-800 p-2 border border-slate-700 object-cover shadow-lg" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-2xl shadow-lg">
                #{player.jersey_number}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold rounded-lg text-xs uppercase tracking-wider">
                  {player.position}
                </span>
                <span className="text-slate-400 text-sm font-bold">#{player.jersey_number}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{player.name}</h1>
              <p className="text-slate-400 font-medium mt-1">
                Klub:{' '}
                {player.team ? (
                  <Link to={`/teams/${player.team.id}`} className="text-white font-bold hover:text-blue-400 underline decoration-blue-500/50 transition-colors">
                    {player.team.name}
                  </Link>
                ) : (
                  <span className="text-white font-bold">Tanpa Klub</span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl px-6 py-4 flex flex-col items-end min-w-[160px]">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Overall Rating</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-black text-emerald-400">{Number(player.overall_rating).toFixed(2)}</span>
              <span className="text-sm font-bold text-slate-500">/ 100</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Tanggal Lahir</span>
            <span className="text-lg font-bold text-white">{player.birth_date || '-'}</span>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Tinggi Badan</span>
            <span className="text-lg font-bold text-white">{player.height ? `${player.height} cm` : '-'}</span>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Berat Badan</span>
            <span className="text-lg font-bold text-white">{player.weight ? `${player.weight} kg` : '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}