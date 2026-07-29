import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_teams: 0,
    total_players: 0,
    total_fixtures: 0,
    completed_fixtures: 0,
    scheduled_fixtures: 0,
    total_goals: 0,
    total_assists: 0,
    average_rating: 0,
    recent_fixtures: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard-stats');
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat metrik dashboard admin.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Memuat statistik dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 pb-4 border-b border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-400 mt-1">Ringkasan aktivitas data dan statistik kompetisi KickRank</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm mb-8">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-bl-full -mr-6 -mt-6 group-hover:bg-blue-600/20 transition-all"></div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total Tim / Klub</span>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-4xl font-black text-white">{stats.total_teams}</span>
            <Link to="/admin/teams" className="text-xs font-bold text-blue-400 hover:underline">Kelola &rarr;</Link>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 rounded-bl-full -mr-6 -mt-6 group-hover:bg-emerald-600/20 transition-all"></div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total Pemain Terdaftar</span>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-4xl font-black text-emerald-400">{stats.total_players}</span>
            <Link to="/admin/players" className="text-xs font-bold text-emerald-400 hover:underline">Kelola &rarr;</Link>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-600/10 rounded-bl-full -mr-6 -mt-6 group-hover:bg-amber-600/20 transition-all"></div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">Laga Selesai / Terjadwal</span>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-4xl font-black text-amber-400">{stats.completed_fixtures}</span>
              <span className="text-sm font-bold text-slate-500 ml-1">/ {stats.total_fixtures}</span>
            </div>
            <Link to="/admin/fixtures" className="text-xs font-bold text-amber-400 hover:underline">Jadwal &rarr;</Link>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-600/10 rounded-bl-full -mr-6 -mt-6 group-hover:bg-purple-600/20 transition-all"></div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total Gol / Assist</span>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-4xl font-black text-purple-400">{stats.total_goals}</span>
              <span className="text-sm font-bold text-slate-500 ml-1.5">{stats.total_assists} A</span>
            </div>
            <Link to="/admin/player-stats" className="text-xs font-bold text-purple-400 hover:underline">Statistik &rarr;</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <h2 className="text-lg font-black text-white uppercase tracking-wider">Pertandingan Terbaru</h2>
            <Link to="/admin/fixtures" className="text-xs font-bold text-red-400 hover:text-red-300">Lihat Semua &rarr;</Link>
          </div>
          {stats.recent_fixtures.length === 0 ? (
            <p className="text-slate-500 text-sm py-8 text-center">Belum ada pertandingan yang dicatat.</p>
          ) : (
            <div className="space-y-4">
              {stats.recent_fixtures.map((f) => (
                <div key={f.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex-1">
                    <span className="text-xs text-slate-500 font-bold block mb-1">{formatDate(f.match_date)}</span>
                    <div className="font-bold text-white text-base">
                      {f.home_team?.name} <span className="text-red-400 font-normal px-1.5">vs</span> {f.away_team?.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-lg text-amber-400 bg-slate-900 px-4 py-1.5 rounded-xl border border-slate-800 inline-block">
                      {f.status === 'completed' ? `${f.home_score} : ${f.away_score}` : 'VS'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="pb-4 mb-4 border-b border-slate-800">
              <h2 className="text-lg font-black text-white uppercase tracking-wider">Aksi Cepat (Quick Actions)</h2>
            </div>
            <div className="space-y-3">
              <Link
                to="/admin/fixtures/create"
                className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-red-600/20 flex items-center justify-between group"
              >
                <span>+ Buat Jadwal Pertandingan</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
              <Link
                to="/admin/player-stats/create"
                className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-between group border border-slate-700"
              >
                <span>+ Input Statistik Performa</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
              <Link
                to="/admin/players/create"
                className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-between group border border-slate-700"
              >
                <span>+ Registrasi Pemain Baru</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
              <Link
                to="/admin/teams/create"
                className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-between group border border-slate-700"
              >
                <span>+ Tambah Klub / Tim Baru</span>
                <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 bg-slate-950/40 p-4 rounded-2xl border">
            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Rata-Rata Rating Liga</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">{stats.average_rating}</span>
              <span className="text-xs font-bold text-slate-400">/ 10.00 (Semua Pemain)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}