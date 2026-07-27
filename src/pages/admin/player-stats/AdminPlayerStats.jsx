import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Manajemen Statistik & Rating Pemain</h1>
          <p className="text-sm text-slate-400 mt-1">Catat performa laga pemain untuk memicu perhitungan rating otomatis</p>
        </div>
        <Link
          to="/admin/player-stats/create"
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-red-600/20"
        >
          + Input Statistik Baru
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Memuat data statistik...</div>
      ) : stats.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          Belum ada catatan statistik pertandingan pemain.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-xs font-extrabold tracking-wider border-b border-slate-800">
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
            <tbody className="divide-y divide-slate-800/60">
              {stats.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">
                    <div>{row.player?.name || 'Pemain Terhapus'}</div>
                    <div className="text-xs font-normal text-slate-400">{row.team?.name || '-'}</div>
                  </td>
                  <td className="py-4 px-6 text-center font-mono text-xs text-slate-400">
                    #{row.fixture_id}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-emerald-400">{row.goals}</td>
                  <td className="py-4 px-4 text-center font-bold text-blue-400">{row.assists}</td>
                  <td className="py-4 px-4 text-center text-slate-400">{row.minutes_played}&apos;</td>
                  <td className="py-4 px-6 text-right font-black text-amber-400 text-base">
                    {Number(row.rating).toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleDelete(row.id, row.player?.name || 'Pemain')}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold transition-all"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}