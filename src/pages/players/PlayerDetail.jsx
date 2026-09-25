import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Trophy, BarChart3 } from 'lucide-react';
import api from '../../services/api';

export default function PlayerDetail() {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  async function fetchPlayerAndStats() {
    try {
      setLoading(true);
      const [resPlayer, resStats] = await Promise.all([
        api.get(`/players/${id}`),
        api.get(`/player-stats?player_id=${id}`)
      ]);
      setPlayer(resPlayer.data);
      setStats(resStats.data);
      setError(null);
    } catch (err) {
      setError('Gagal mengambil detail pemain.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlayerAndStats();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Memuat detail pemain...</p>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-500 dark:text-red-400 mb-6 font-semibold">
          {error || 'Pemain tidak ditemukan.'}
        </div>
        <Link to="/players" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors">
          <ArrowLeft size={16} /> Kembali ke Daftar Pemain
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="mb-6">
        <Link to="/players" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline transition-colors">
          <ArrowLeft size={16} /> Kembali ke Daftar Pemain
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-xs mb-8 transition-colors duration-300">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800/80 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {player.photo ? (
              <img src={player.photo} alt={player.name} className="w-24 h-24 rounded-2xl bg-slate-50 dark:bg-slate-800 p-2 border border-slate-200/60 dark:border-slate-700/60 object-cover shadow-sm shrink-0" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-2xl shadow-xs shrink-0">
                #{player.jersey_number}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-2.5">
                <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary font-bold rounded-lg text-xs uppercase tracking-wider">
                  {player.position}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-sm font-bold">#{player.jersey_number}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight">{player.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold mt-2">
                Klub:{' '}
                {player.team ? (
                  <Link to={`/teams/${player.team.id}`} className="text-primary hover:underline font-extrabold transition-colors">
                    {player.team.name}
                  </Link>
                ) : (
                  <span className="text-slate-700 dark:text-slate-300 font-bold">Tanpa Klub</span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl px-6 py-4 flex flex-col items-end min-w-[160px] self-stretch md:self-auto transition-colors duration-300">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Overall Rating</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-black text-primary">{Number(player.overall_rating).toFixed(2)}</span>
              <span className="text-xs font-bold text-slate-500">/ 10.00</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/60 rounded-2xl p-5 transition-colors duration-300">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Tanggal Lahir</span>
            <span className="text-lg font-extrabold text-slate-800 dark:text-white">{formatDate(player.birth_date)}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/60 rounded-2xl p-5 transition-colors duration-300">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Tinggi Badan</span>
            <span className="text-lg font-extrabold text-slate-800 dark:text-white">{player.height ? `${player.height} cm` : '-'}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/60 rounded-2xl p-5 transition-colors duration-300">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Berat Badan</span>
            <span className="text-lg font-extrabold text-slate-800 dark:text-white">{player.weight ? `${player.weight} kg` : '-'}</span>
          </div>
        </div>
      </div>

      {/* Match Stats History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-xs transition-colors duration-300">
        <h2 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="text-primary" /> Riwayat Performa & Statistik Pertandingan
        </h2>

        {stats.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-8 text-center transition-colors duration-300">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Belum ada catatan statistik pertandingan untuk pemain ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase text-xs font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-850">
                <tr>
                  <th className="py-4 px-4">Tanggal</th>
                  <th className="py-4 px-6">Pertandingan</th>
                  <th className="py-4 px-4 text-center">Menit</th>
                  <th className="py-4 px-4 text-center">Gol</th>
                  <th className="py-4 px-4 text-center">Assist</th>
                  <th className="py-4 px-4 text-center">Kartu (K/M)</th>
                  <th className="py-4 px-6 text-right">Rating Match</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                {stats.map((stat) => (
                  <tr key={stat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                      {formatDate(stat.fixture?.match_date)}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">
                      {stat.fixture ? (
                        <span>
                          {stat.fixture.home_team?.name} <span className="text-slate-400 dark:text-slate-500 font-normal px-1.5">vs</span> {stat.fixture.away_team?.name}
                        </span>
                      ) : (
                        <span className="text-slate-500">Laga #{stat.fixture_id}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center text-slate-500 dark:text-slate-400">{stat.minutes_played}&apos;</td>
                    <td className="py-4 px-4 text-center font-bold text-primary">{stat.goals}</td>
                    <td className="py-4 px-4 text-center font-bold text-blue-500">{stat.assists}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-amber-500 font-bold">{stat.yellow_cards}</span>
                      <span className="text-slate-400 dark:text-slate-600 mx-1">/</span>
                      <span className="text-red-500 font-bold">{stat.red_cards}</span>
                    </td>
                    <td className="py-4 px-6 text-right font-black text-amber-500 text-base">
                      {Number(stat.rating).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}