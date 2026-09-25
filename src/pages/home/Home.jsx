import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Star, Calendar, Goal, Users, Shield, TrendingUp, Sparkles, ArrowRight, Zap, Activity, Award } from 'lucide-react';
import api from '../../services/api';
import heroBg from '../../assets/hero.png';

export default function Home() {
  const [fixtures, setFixtures] = useState([]);
  const [standings, setStandings] = useState([]);
  const [leaderboard, setLeaderboard] = useState({ top_scorers: [], top_rated: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });


  async function fetchHomeData() {
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
  }

  useEffect(() => {
    document.title = 'SmartFootball | Portal Analisis & Statistik Sepak Bola';
    fetchHomeData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  const platformFeatures = [
    {
      icon: <Shield size={24} className="text-primary stroke-[2.2]" />,
      title: 'Profil Klub & Tim Resmi',
      desc: 'Pantau informasi lengkap tim kesayangan Anda, sejarah, serta jajaran roster pemain yang terdaftar resmi.',
      color: 'bg-primary/10'
    },
    {
      icon: <Activity size={24} className="text-emerald-500 stroke-[2.2]" />,
      title: 'Kalkulasi Rating Otomatis',
      desc: 'Sistem komputasi poin performa pemain yang objektif berdasarkan aksi riil (gol, assist, penampilan) di setiap laga.',
      color: 'bg-emerald-500/10'
    },
    {
      icon: <Calendar size={24} className="text-amber-500 stroke-[2.2]" />,
      title: 'Jadwal & Hasil Laga Akurat',
      desc: 'Dapatkan rincian skor hasil laga tanding secara langsung dan jadwal pertandingan mendatang lengkap dengan stadion venue.',
      color: 'bg-amber-500/10'
    },
    {
      icon: <Award size={24} className="text-sky-500 stroke-[2.2]" />,
      title: 'Papan Peringkat Interaktif',
      desc: 'Papan skor top performers individual (Top Skorer & Rating Tertinggi) yang dinamis untuk melihat siapa bintang liga saat ini.',
      color: 'bg-sky-500/10'
    }
  ];

  return (
    <div className="w-full transition-colors duration-300 relative">
      
      {/* Hero Banner Section (Full Bleed Background - Adobe Style) */}
      <section 
        className="relative bg-slate-950 text-white py-24 md:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Dark radial and linear gradients overlay for excellent readability and atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.1),transparent_50%)] z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-start text-left">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-primary/20 border border-primary/30 text-primary-light font-black rounded-full text-xs uppercase tracking-widest mb-6 shadow-md animate-pulse">
            <Sparkles size={14} /> SmartFootball Platform
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15] mb-6 max-w-2xl drop-shadow-md">
            Analisis Data & <span className="text-primary-light">Statistik Sepak Bola</span> Terlengkap
          </h1>
          <p className="text-base sm:text-lg text-slate-350 font-medium leading-relaxed max-w-xl mb-8 drop-shadow-sm">
            Pantau klasemen liga terbaru, performa skuad, kalkulasi rating performa otomatis pemain, jadwal laga tanding, dan piala pencapaian top skor dalam satu portal pintar.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/league-table"
              className="px-8 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-full text-sm transition-all shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Mulai Eksplorasi Liga
            </Link>
            {!user ? (
              <Link
                to="/register"
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full text-sm transition-all border border-white/20 hover:scale-105 active:scale-95 cursor-pointer"
              >
                Daftar Akun Baru
              </Link>
            ) : (
              <span className="text-slate-400 font-bold text-sm bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-800">
                Masuk sebagai: <span className="text-white font-black">{user.name}</span>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Main Content (Features & Live Previews) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        {/* Subtle background decoration blurs */}
        <div className="absolute top-10 left-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl z-0 pointer-events-none"></div>

        {/* Core Platform Features Section */}
        <section className="relative z-10 mb-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
              Fitur Utama SmartFootball
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Segala informasi sepak bola yang Anda butuhkan dikelola secara profesional dalam sistem kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platformFeatures.map((feat) => (
              <div
                key={feat.title}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-md hover:shadow-xl hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${feat.color} rounded-2xl flex items-center justify-center shrink-0 mb-5 group-hover:scale-105 transition-transform`}>
                  {feat.icon}
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Database Preview Section */}
        <section className="relative z-10 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
              Preview Statistik Terkini
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Data klasemen, laga, dan performa pemain yang langsung ditarik dari database liga kami secara real-time.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">Memuat data preview liga...</p>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Match Schedule */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h3 className="text-lg font-black text-slate-855 dark:text-white flex items-center gap-2">
                      <Calendar size={18} className="text-primary" /> Laga Terbaru & Skor
                    </h3>
                    <Link to="/fixtures" className="text-xs font-bold text-primary hover:underline">Semua Jadwal &rarr;</Link>
                  </div>

                  {fixtures.length === 0 ? (
                    <p className="text-slate-400 text-sm py-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center font-bold">Belum ada pertandingan terdaftar.</p>
                  ) : (
                    <div className="space-y-4">
                      {fixtures.map((f) => (
                        <div key={f.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
                          <div className="flex-1">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block mb-1.5 uppercase tracking-wider">{formatDate(f.match_date)} | Stadium: {f.venue || 'Utama'}</span>
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

                              <span className="text-xs font-black text-primary dark:text-primary-light">vs</span>

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
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h3 className="text-lg font-black text-slate-855 dark:text-white flex items-center gap-2">
                      <Trophy size={18} className="text-primary" /> Top Klasemen
                    </h3>
                    <Link to="/league-table" className="text-xs font-bold text-primary hover:underline">Detail &rarr;</Link>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-xs space-y-4 transition-all duration-300">
                    {standings.length === 0 ? (
                      <p className="text-slate-400 text-sm py-8 text-center font-bold">Belum ada tim terdaftar.</p>
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
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h3 className="text-lg font-black text-slate-855 dark:text-white flex items-center gap-2">
                      <Goal size={18} className="text-primary" /> Top Skor Individual
                    </h3>
                    <Link to="/leaderboard" className="text-xs font-bold text-primary hover:underline">Semua &rarr;</Link>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-xs space-y-4 transition-all duration-300">
                    {leaderboard.top_scorers.length === 0 ? (
                      <p className="text-slate-400 text-sm py-6 text-center font-bold">Belum ada statistik gol.</p>
                    ) : (
                      <div className="space-y-3">
                        {leaderboard.top_scorers.map((row, idx) => (
                          <div key={row.player?.id || idx} className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-3">
                              <span className="w-5 text-center text-xs font-black text-slate-400">{idx + 1}</span>
                              <div>
                                <Link to={`/players/${row.player?.id}`} className="font-extrabold text-sm text-slate-855 dark:text-white hover:text-primary transition-colors block">
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
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h3 className="text-lg font-black text-slate-855 dark:text-white flex items-center gap-2">
                      <Star size={18} className="text-primary" /> Rating Tertinggi Pemain
                    </h3>
                    <Link to="/leaderboard" className="text-xs font-bold text-primary hover:underline">Semua &rarr;</Link>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-5 shadow-xs space-y-4 transition-all duration-300">
                    {leaderboard.top_rated.length === 0 ? (
                      <p className="text-slate-400 text-sm py-6 text-center font-bold">Belum ada rating pemain.</p>
                    ) : (
                      <div className="space-y-3">
                        {leaderboard.top_rated.map((player, idx) => (
                          <div key={player.id || idx} className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-3">
                              <span className="w-5 text-center text-xs font-black text-slate-400">{idx + 1}</span>
                              <div>
                                <Link to={`/players/${player.id}`} className="font-extrabold text-sm text-slate-855 dark:text-white hover:text-primary transition-colors block">
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
        </section>

        {/* Bottom CTA Banner for Landing Page */}
        {!user && (
          <section className="relative z-10 mt-20">
            <div className="bg-gradient-to-br from-primary via-violet-650 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-center text-white shadow-2xl shadow-primary/30 overflow-hidden relative">
              {/* Background design elements */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none"></div>
              
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 font-black rounded-full text-[10px] uppercase tracking-widest">
                  <Zap size={12} className="fill-white" /> Akses Keanggotaan Gratis
                </span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  Mulai Pantau Statistik Sepak Bola Pintar Sekarang!
                </h2>
                <p className="text-sm md:text-base text-white/80 leading-relaxed font-semibold">
                  Daftar sekarang menggunakan alamat Gmail Anda secara cepat untuk memantau performa, riwayat pemain, leaderboard, dan menyukai tim favorit Anda.
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    to="/register"
                    className="px-8 py-3.5 bg-white text-slate-800 hover:bg-slate-50 font-black rounded-2xl text-sm transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Daftar Dengan Gmail
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-3.5 bg-primary-hover border border-white/20 text-white hover:bg-white/10 font-bold rounded-2xl text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Masuk Akun
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

    </div>
  );
}
