import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Star, Sparkles, Goal, ShieldAlert } from 'lucide-react';
import api from '../../services/api';

export default function Leaderboard() {
  const [data, setData] = useState({
    top_scorers: [],
    top_assists: [],
    top_rated: [],
    top_clean_sheets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  async function fetchLeaderboard() {
    try {
      setLoading(true);
      const response = await api.get('/leaderboard');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Gagal mengambil data leaderboard dari server.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="public-page-intro mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
          <Sparkles className="text-primary" /> Leaderboard & Top Performers
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Peringkat pencapaian individual terbaik pemain liga musim ini</p>
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Memuat data leaderboard...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-500 dark:text-red-400 font-semibold max-w-lg mx-auto">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Scorers */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs transition-colors duration-300">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-black text-primary uppercase tracking-wider flex items-center gap-2">
                <Goal size={20} /> Top Scorers
              </h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Gol</span>
            </div>
            {data.top_scorers.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">Belum ada statistik gol.</p>
            ) : (
              <div className="space-y-3">
                {data.top_scorers.map((row, idx) => (
                  <div key={row.player?.id || idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center space-x-4">
                      <span className="w-6 font-black text-slate-400 text-center">{idx + 1}</span>
                      <div>
                        <Link to={`/players/${row.player?.id}`} className="font-bold text-slate-800 dark:text-white hover:text-primary transition-colors block">
                          {row.player?.name || 'Pemain Terhapus'}
                        </Link>
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{row.team?.name || '-'}</span>
                      </div>
                    </div>
                    <span className="font-black text-xl text-primary px-3 py-1 bg-primary/10 rounded-xl border border-primary/20">
                      {row.total_goals}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Assists */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs transition-colors duration-300">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-black text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={20} /> Top Assists
              </h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Assist</span>
            </div>
            {data.top_assists.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">Belum ada statistik assist.</p>
            ) : (
              <div className="space-y-3">
                {data.top_assists.map((row, idx) => (
                  <div key={row.player?.id || idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center space-x-4">
                      <span className="w-6 font-black text-slate-400 text-center">{idx + 1}</span>
                      <div>
                        <Link to={`/players/${row.player?.id}`} className="font-bold text-slate-800 dark:text-white hover:text-sky-500 transition-colors block">
                          {row.player?.name || 'Pemain Terhapus'}
                        </Link>
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{row.team?.name || '-'}</span>
                      </div>
                    </div>
                    <span className="font-black text-xl text-sky-600 dark:text-sky-400 px-3 py-1 bg-sky-500/10 rounded-xl border border-sky-500/20">
                      {row.total_assists}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Highest Rated */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs transition-colors duration-300">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-black text-amber-500 uppercase tracking-wider flex items-center gap-2">
                <Star size={20} /> Highest Rated
              </h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Overall Rating</span>
            </div>
            {data.top_rated.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">Belum ada rating pemain.</p>
            ) : (
              <div className="space-y-3">
                {data.top_rated.map((player, idx) => (
                  <div key={player.id || idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center space-x-4">
                      <span className="w-6 font-black text-slate-400 text-center">{idx + 1}</span>
                      <div>
                        <Link to={`/players/${player.id}`} className="font-bold text-slate-800 dark:text-white hover:text-amber-500 transition-colors block">
                          {player.name}
                        </Link>
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{player.team?.name || '-'}</span>
                      </div>
                    </div>
                    <span className="font-black text-xl text-amber-500 px-3 py-1 bg-amber-500/10 rounded-xl border border-amber-500/20">
                      {Number(player.overall_rating).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Clean Sheets */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs transition-colors duration-300">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Trophy size={20} /> Top Clean Sheets
              </h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Clean Sheet</span>
            </div>
            {data.top_clean_sheets.length === 0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">Belum ada statistik clean sheet kiper.</p>
            ) : (
              <div className="space-y-3">
                {data.top_clean_sheets.map((row, idx) => (
                  <div key={row.player?.id || idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center space-x-4">
                      <span className="w-6 font-black text-slate-400 text-center">{idx + 1}</span>
                      <div>
                        <Link to={`/players/${row.player?.id}`} className="font-bold text-slate-800 dark:text-white hover:text-purple-500 transition-colors block">
                          {row.player?.name || 'Pemain Terhapus'}
                        </Link>
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{row.team?.name || '-'}</span>
                      </div>
                    </div>
                    <span className="font-black text-xl text-purple-600 dark:text-purple-400 px-3 py-1 bg-purple-500/10 rounded-xl border border-purple-500/20">
                      {row.total_clean_sheets}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}