import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Star, Calendar, Goal, Users, Shield, TrendingUp, Sparkles, ArrowRight, Zap } from 'lucide-react';
import api from '../../services/api';

export default function Home() {
  const [fixtures, setFixtures] = useState([]);
  const [standings, setStandings] = useState([]);
  const [leaderboard, setLeaderboard] = useState({ top_scorers: [], top_rated: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'SmartFootball | Portal Analisis & Statistik Sepak Bola';
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [fixturesRes, standingsRes, leaderboardRes] = await Promise.all([
        api.get('/fixtures'),
        api.get('/league-table'),
        api.get('/leaderboard')
      ]);

      setFixtures(fixturesRes.data.slice(0, 3));
      setStandings(standingsRes.data.slice(0, 4));
      setLeaderboard({
        top_scorers: leaderboardRes.data.top_scorers.slice(0, 3),
        top_rated: leaderboardRes.data.top_rated.slice(0, 3)
      });
      setError(null);
    } catch (err) {
      setError('Gagal memuat beberapa data statistik untuk beranda.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 transition-colors duration-300 relative">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl z-0 pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl z-0 pointer-events-none"></div>

      {/* Hero Section */}
      <div className="relative z-10 text-center mb-16 max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary font-black rounded-full text-xs uppercase tracking-widest mb-6 animate-pulse">
          <Sparkles size={14} /> SmartFootball Platform
        </span>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-800 dark:text-white leading-[1.1] mb-6">
          Analisis Data, Rating & <span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-violet-500">Statistik Liga</span> Terlengkap
        </h1>
        <p className="text-base sm:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-8">
          Pantau klasemen liga sepak bola terbaru, tren performa klub, rating pemain otomatis, jadwal laga tanding, dan data top performers individual dalam satu portal pintar.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/league-table"
            className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Lihat Klasemen Liga
          </Link>
          <Link
            to="/leaderboard"
            className="px-8 py-3.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-sm transition-all border border-slate-200 dark:border-slate-850 hover:-translate-y-0.5 active:translate-y-0 shadow-xs cursor-pointer"
          >
            Papan Peringkat
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 relative z-10">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Memuat beranda sepak bola...</p>
        </div>
      ) : (
        <div className="relative z-10 space-y-12">
          {/* Quick Stats Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link to="/teams" className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex items-center gap-4 hover:border-primary/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                <Shield size={22} className="stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Klub & Skuad</span>
                <span className="text-lg font-black text-slate-850 dark:text-white flex items-center gap-1">
                  Eksplorasi Tim <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            <Link to="/players" className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex items-center gap-4 hover:border-primary/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-500 shrink-0 group-hover:scale-105 transition-transform">
                <Users size={22} className="stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Bursa Roster</span>
                <span className="text-lg font-black text-slate-850 dark:text-white flex items-center gap-1">
                  Daftar Pemain <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>

            <Link to="/fixtures" className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex items-center gap-4 hover:border-primary/50 transition-all duration-300 group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-105 transition-transform">
                <Calendar size={22} className="stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Jadwal & Hasil</span>
                <span className="text-lg font-black text-slate-850 dark:text-white flex items-center gap-1">
                  Skor Pertandingan <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Match Schedule */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-4">
                <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Calendar size={18} className="text-primary" /> Laga Terbaru & Skor
                </h2>
                <Link to="/fixtures" className="text-xs font-bold text-primary hover:underline">Semua Jadwal &rarr;</Link>
              </div>

              {fixtures.length === 0 ? (
                <p className="text-slate-400 text-sm py-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center">Belum ada pertandingan.</p>
              ) : (
                <div className="space-y-4">
                  {fixtures.map((f) => (
                    <div key={f.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300">
                      <div className="flex-1">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-bold block mb-1.5">{formatDate(f.match_date)} | Stadium: {f.venue || 'Utama'}</span>
                        <div className="flex items-center gap-3">
                          {/* Home Team */}
                          <div className="flex items-center gap-2">
                            {f.home_team?.logo ? (
                              <img src={f.home_team.logo} className="w-6 h-6 object-cover rounded-md" />
                            ) : (
                              <div className="w-6 h-6 rounded-md bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">SF</div>
                            )}
                            <span className="font-extrabold text-sm text-slate-800 dark:text-white">{f.home_team?.name}</span>
                          </div>

                          <span className="text-xs font-bold text-primary dark:text-primary-light">vs</span>

                          {/* Away Team */}
                          <div className="flex items-center gap-2">
                            {f.away_team?.logo ? (
                              <img src={f.away_team.logo} className="w-6 h-6 object-cover rounded-md" />
                            ) : (
                              <div className="w-6 h-6 rounded-md bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">SF</div>
                            )}
                            <span className="font-extrabold text-sm text-slate-800 dark:text-white">{f.away_team?.name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center">
                        <span className={`px-4 py-2 rounded-2xl text-xs font-black border ${
                          f.status === 'completed' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400'
                        }`}>
                          {f.status === 'completed' ? `SKOR: ${f.home_score} - ${f.away_score}` : 'BELUM MULAI'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Standings Snippet */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-4">
                <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Trophy size={18} className="text-primary" /> Top Klasemen
                </h2>
                <Link to="/league-table" className="text-xs font-bold text-primary hover:underline">Detail &rarr;</Link>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-xs space-y-4 transition-colors duration-300">
                {standings.length === 0 ? (
                  <p className="text-slate-400 text-sm py-8 text-center">Belum ada tim terdaftar.</p>
                ) : (
                  <div className="space-y-3.5">
                    {standings.map((row, idx) => (
                      <div key={row.team?.id || idx} className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-850 last:border-0 pb-3 last:pb-0">
                        <div className="flex items-center gap-3">
                          <span className={`w-5 text-center text-xs font-black ${idx === 0 ? 'text-primary' : 'text-slate-400'}`}>{idx + 1}</span>
                          {row.team?.logo ? (
                            <img src={row.team.logo} className="w-6 h-6 object-cover rounded-md bg-slate-50 dark:bg-slate-800 border" />
                          ) : (
                            <div className="w-6 h-6 rounded-md bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">SF</div>
                          )}
                          <Link to={`/teams/${row.team?.id}`} className="font-extrabold text-sm text-slate-850 dark:text-white hover:text-primary transition-colors truncate max-w-[130px]">
                            {row.team?.name}
                          </Link>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-extrabold text-slate-500">
                          <span title="Main">{row.played} M</span>
                          <span className="text-primary" title="Poin">{row.points} PTS</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Leaders Snippets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Top Scorers */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-4">
                <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Goal size={18} className="text-primary" /> Top Skor Individual
                </h2>
                <Link to="/leaderboard" className="text-xs font-bold text-primary hover:underline">Semua &rarr;</Link>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-xs space-y-4 transition-colors duration-300">
                {leaderboard.top_scorers.length === 0 ? (
                  <p className="text-slate-400 text-sm py-6 text-center">Belum ada statistik gol.</p>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.top_scorers.map((row, idx) => (
                      <div key={row.player?.id || idx} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-3">
                          <span className="w-5 text-center text-xs font-black text-slate-400">{idx + 1}</span>
                          <div>
                            <Link to={`/players/${row.player?.id}`} className="font-extrabold text-sm text-slate-850 dark:text-white hover:text-primary transition-colors block">
                              {row.player?.name}
                            </Link>
                            <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-550 block">{row.team?.name || '-'}</span>
                          </div>
                        </div>
                        <span className="font-black text-sm text-primary px-3 py-1 bg-primary/10 border border-primary/20 rounded-xl">
                          {row.total_goals} Gol
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Highest Rated */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-4">
                <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <Star size={18} className="text-primary" /> Rating Tertinggi Pemain
                </h2>
                <Link to="/leaderboard" className="text-xs font-bold text-primary hover:underline">Semua &rarr;</Link>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-xs space-y-4 transition-colors duration-300">
                {leaderboard.top_rated.length === 0 ? (
                  <p className="text-slate-400 text-sm py-6 text-center">Belum ada rating pemain.</p>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.top_rated.map((player, idx) => (
                      <div key={player.id || idx} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-3">
                          <span className="w-5 text-center text-xs font-black text-slate-400">{idx + 1}</span>
                          <div>
                            <Link to={`/players/${player.id}`} className="font-extrabold text-sm text-slate-850 dark:text-white hover:text-primary transition-colors block">
                              {player.name}
                            </Link>
                            <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-550 block">{player.team?.name || '-'}</span>
                          </div>
                        </div>
                        <span className="font-black text-sm text-amber-500 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                          ★ {Number(player.overall_rating).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
