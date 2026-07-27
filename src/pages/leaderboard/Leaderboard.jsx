import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
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
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 pb-4 border-b border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Leaderboard & Top Performers</h1>
        <p className="text-sm text-slate-400 mt-1">Peringkat pencapaian individual terbaik pemain liga musim ini</p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg animate-pulse">Memuat data leaderboard...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h2 className="text-lg font-black text-emerald-400 uppercase tracking-wider">Top Scorers</h2>
              <span className="text-xs text-slate-500 font-bold uppercase">Total Gol</span>
            </div>
            {data.top_scorers.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">Belum ada statistik gol.</p>
            ) : (
              <div className="space-y-4">
                {data.top_scorers.map((row, idx) => (
                  <div key={row.player?.id || idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/50 hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center space-x-4">
                      <span className="w-6 font-black text-slate-500 text-center">{idx + 1}</span>
                      <div>
                        <Link to={`/players/${row.player?.id}`} className="font-bold text-white hover:text-blue-400 transition-colors block">
                          {row.player?.name || 'Pemain Terhapus'}
                        </Link>
                        <span className="text-xs text-slate-400 font-medium">{row.team?.name || '-'}</span>
                      </div>
                    </div>
                    <span className="font-black text-xl text-emerald-400 px-3 py-1 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                      {row.total_goals}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h2 className="text-lg font-black text-blue-400 uppercase tracking-wider">Top Assists</h2>
              <span className="text-xs text-slate-500 font-bold uppercase">Total Assist</span>
            </div>
            {data.top_assists.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">Belum ada statistik assist.</p>
            ) : (
              <div className="space-y-4">
                {data.top_assists.map((row, idx) => (
                  <div key={row.player?.id || idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/50 hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center space-x-4">
                      <span className="w-6 font-black text-slate-500 text-center">{idx + 1}</span>
                      <div>
                        <Link to={`/players/${row.player?.id}`} className="font-bold text-white hover:text-blue-400 transition-colors block">
                          {row.player?.name || 'Pemain Terhapus'}
                        </Link>
                        <span className="text-xs text-slate-400 font-medium">{row.team?.name || '-'}</span>
                      </div>
                    </div>
                    <span className="font-black text-xl text-blue-400 px-3 py-1 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      {row.total_assists}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h2 className="text-lg font-black text-amber-400 uppercase tracking-wider">Highest Rated</h2>
              <span className="text-xs text-slate-500 font-bold uppercase">Overall Rating</span>
            </div>
            {data.top_rated.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">Belum ada rating pemain.</p>
            ) : (
              <div className="space-y-4">
                {data.top_rated.map((player, idx) => (
                  <div key={player.id || idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/50 hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center space-x-4">
                      <span className="w-6 font-black text-slate-500 text-center">{idx + 1}</span>
                      <div>
                        <Link to={`/players/${player.id}`} className="font-bold text-white hover:text-blue-400 transition-colors block">
                          {player.name}
                        </Link>
                        <span className="text-xs text-slate-400 font-medium">{player.team?.name || '-'}</span>
                      </div>
                    </div>
                    <span className="font-black text-xl text-amber-400 px-3 py-1 bg-amber-500/10 rounded-xl border border-amber-500/20">
                      {Number(player.overall_rating).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h2 className="text-lg font-black text-purple-400 uppercase tracking-wider">Top Clean Sheets</h2>
              <span className="text-xs text-slate-500 font-bold uppercase">Total Clean Sheet</span>
            </div>
            {data.top_clean_sheets.length === 0 ? (
              <p className="text-slate-500 text-sm py-4 text-center">Belum ada statistik clean sheet kiper.</p>
            ) : (
              <div className="space-y-4">
                {data.top_clean_sheets.map((row, idx) => (
                  <div key={row.player?.id || idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/50 hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center space-x-4">
                      <span className="w-6 font-black text-slate-500 text-center">{idx + 1}</span>
                      <div>
                        <Link to={`/players/${row.player?.id}`} className="font-bold text-white hover:text-blue-400 transition-colors block">
                          {row.player?.name || 'Pemain Terhapus'}
                        </Link>
                        <span className="text-xs text-slate-400 font-medium">{row.team?.name || '-'}</span>
                      </div>
                    </div>
                    <span className="font-black text-xl text-purple-400 px-3 py-1 bg-purple-500/10 rounded-xl border border-purple-500/20">
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