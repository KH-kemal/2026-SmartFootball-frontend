import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Plus, Trash2 } from 'lucide-react';
import api from '../../../services/api';

export default function AdminPlayerStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/player-stats');
      setStats(response.data);
    } catch (err) {
      console.error('Gagal memuat statistik:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, playerName) => {
    if (window.confirm(`Yakin ingin menghapus statistik pertandingan untuk pemain "${playerName}"? Rating keseluruhan pemain akan dihitung ulang.`)) {
      try {
        await api.delete(`/player-stats/${id}`);
        setStats(stats.filter((s) => s.id !== id));
      } catch (err) {
        alert('Gagal menghapus statistik.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <BarChart3 className="text-primary" /> Manajemen Statistik & Rating Pemain
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Catat performa laga pemain untuk memicu perhitungan rating otomatis</p>
        </div>
        <Link
          to="/admin/player-stats/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-primary/10"
        >
          <Plus size={16} /> Input Statistik Baru
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Memuat data statistik...</p>
        </div>
      ) : stats.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 dark:text-slate-400 shadow-md transition-colors duration-300">
          Belum ada catatan statistik pertandingan pemain.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xs transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase text-xs font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-850">
                <tr>
                  <th className="py-4 px-6">Pemain & Klub</th>
                  <th className="py-4 px-6 text-center">Laga (Fixture ID)</th>
                  <th className="py-4 px-4 text-center">Gol</th>
                  <th className="py-4 px-4 text-center">Assist</th>
                  <th className="py-4 px-4 text-center">Menit</th>
                  <th className="py-4 px-6 text-right">Rating Match</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                {stats.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">
                      <div>{row.player?.name || 'Pemain Terhapus'}</div>
                      <div className="text-xs font-semibold text-slate-400 dark:text-slate-500">{row.team?.name || '-'}</div>
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-xs text-slate-400 dark:text-slate-500">
                      #{row.fixture_id}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-primary">{row.goals}</td>
                    <td className="py-4 px-4 text-center font-bold text-sky-600 dark:text-sky-400">{row.assists}</td>
                    <td className="py-4 px-4 text-center text-slate-500 dark:text-slate-400">{row.minutes_played}&apos;</td>
                    <td className="py-4 px-6 text-right font-black text-amber-500 dark:text-amber-400 text-base">
                      {Number(row.rating).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(row.id, row.player?.name || 'Pemain')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}