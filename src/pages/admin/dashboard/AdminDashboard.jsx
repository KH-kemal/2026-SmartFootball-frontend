import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, Award, Sparkles, Plus, ArrowRight } from 'lucide-react';
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


  async function fetchDashboardStats() {
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
  }

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Memuat statistik dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 transition-colors duration-300">
      <div className="mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
          <Sparkles className="text-primary" /> Dashboard Overview
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Ringkasan aktivitas data dan statistik kompetisi SmartFootball</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-500 dark:text-red-400 text-sm mb-8 font-semibold">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Card 1: Total Tim */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-6 -mt-6 group-hover:bg-primary/20 transition-all shrink-0"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Trophy size={16} className="text-primary" /> Total Tim / Klub
          </span>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-4xl font-black text-slate-800 dark:text-white">{stats.total_teams}</span>
            <Link to="/admin/teams" className="text-xs font-bold text-primary hover:underline">Kelola &rarr;</Link>
          </div>
        </div>

        {/* Card 2: Total Pemain */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs relative overflow-hidden group hover:border-sky-500/50 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-bl-full -mr-6 -mt-6 group-hover:bg-sky-500/20 transition-all shrink-0"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Users size={16} className="text-sky-500" /> Total Pemain
          </span>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-4xl font-black text-slate-800 dark:text-white">{stats.total_players}</span>
            <Link to="/admin/players" className="text-xs font-bold text-sky-500 hover:underline">Kelola &rarr;</Link>
          </div>
        </div>

        {/* Card 3: Laga Selesai */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs relative overflow-hidden group hover:border-amber-500/50 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full -mr-6 -mt-6 group-hover:bg-amber-500/20 transition-all shrink-0"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Calendar size={16} className="text-amber-500" /> Laga Selesai
          </span>
          <div className="mt-4 flex items-baseline justify-between">
            <div>
              <span className="text-4xl font-black text-slate-800 dark:text-white">{stats.completed_fixtures}</span>
              <span className="text-sm font-bold text-slate-450 dark:text-slate-500 ml-1.5">/ {stats.total_fixtures} Laga</span>
            </div>
            <Link to="/admin/fixtures" className="text-xs font-bold text-amber-500 hover:underline">Jadwal &rarr;</Link>
          </div>
        </div>

        {/* Card 4: Gol & Assist */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full -mr-6 -mt-6 group-hover:bg-emerald-500/20 transition-all shrink-0"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <Award size={16} className="text-emerald-500" /> Gol / Assist
          </span>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-3">
              <div>
                <span className="text-4xl font-black text-slate-800 dark:text-white">{stats.total_goals}</span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1">Gol</span>
              </div>
              <div>
                <span className="text-4xl font-black text-slate-800 dark:text-white">{stats.total_assists}</span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1">Assist</span>
              </div>
            </div>
            <Link to="/admin/player-stats" className="text-xs font-bold text-emerald-500 hover:underline">Statistik &rarr;</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Fixtures Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs transition-colors duration-300">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">Pertandingan Terbaru</h2>
            <Link to="/admin/fixtures" className="text-xs font-bold text-primary hover:underline">Lihat Semua &rarr;</Link>
          </div>
          {stats.recent_fixtures.length === 0 ? (
            <p className="text-slate-400 text-sm py-12 text-center">Belum ada pertandingan yang dicatat.</p>
          ) : (
            <div className="space-y-4">
              {stats.recent_fixtures.map((f) => (
                <div key={f.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-850 shadow-xs transition-colors">
                  <div className="flex-1 min-w-0 pr-4">
                    <span className="text-xs text-slate-400 font-bold block mb-1">{formatDate(f.match_date)}</span>
                    <div className="font-extrabold text-slate-800 dark:text-white text-base truncate">
                      {f.home_team?.name} <span className="text-primary font-normal px-1">vs</span> {f.away_team?.name}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="font-black text-base text-amber-500 dark:text-amber-400 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 inline-block shadow-xs">
                      {f.status === 'completed' ? `${f.home_score} : ${f.away_score}` : 'VS'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between transition-colors duration-300">
          <div>
            <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wider">Aksi Cepat</h2>
            </div>
            <div className="space-y-3">
              <Link
                to="/admin/fixtures/create"
                className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-primary/20 flex items-center justify-between group"
              >
                <span className="flex items-center gap-2"><Plus size={16} /> Buat Jadwal Laga</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/admin/player-stats/create"
                className="w-full py-3.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-sm transition-all flex items-center justify-between group border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <span className="flex items-center gap-2"><Plus size={16} /> Input Statistik Performa</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/admin/players/create"
                className="w-full py-3.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-sm transition-all flex items-center justify-between group border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <span className="flex items-center gap-2"><Plus size={16} /> Registrasi Pemain</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/admin/teams/create"
                className="w-full py-3.5 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-sm transition-all flex items-center justify-between group border border-slate-200 dark:border-slate-800 shadow-xs"
              >
                <span className="flex items-center gap-2"><Plus size={16} /> Tambah Klub Baru</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-850 transition-colors">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Rata-Rata Rating Liga</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-primary">{stats.average_rating}</span>
              <span className="text-xs font-semibold text-slate-400">/ 10.00 (Semua Pemain)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}