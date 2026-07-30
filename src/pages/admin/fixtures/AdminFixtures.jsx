import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Edit3, Trash2 } from 'lucide-react';
import api from '../../../services/api';

export default function AdminFixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFixtures();
  }, []);

  const fetchFixtures = async () => {
    try {
      setLoading(true);
      const response = await api.get('/fixtures');
      setFixtures(response.data);
    } catch (err) {
      console.error('Gagal memuat jadwal:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus jadwal pertandingan ini?')) {
      try {
        await api.delete(`/fixtures/${id}`);
        setFixtures(fixtures.filter((f) => f.id !== id));
      } catch (err) {
        alert('Gagal menghapus jadwal.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <Calendar className="text-primary" /> Manajemen Jadwal & Skor
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Buat laga baru dan masukkan skor pertandingan</p>
        </div>
        <Link
          to="/admin/fixtures/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-primary/10"
        >
          <Plus size={16} /> Buat Jadwal Baru
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Memuat data jadwal...</p>
        </div>
      ) : fixtures.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 dark:text-slate-400 shadow-md transition-colors duration-300">
          Belum ada pertandingan yang dijadwalkan.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xs transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase text-xs font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-850">
                <tr>
                  <th className="py-4 px-6">Tanggal & Venue</th>
                  <th className="py-4 px-6 text-center">Pertandingan</th>
                  <th className="py-4 px-6 text-center">Skor</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                {fixtures.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800 dark:text-white">{formatDate(f.match_date)}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{f.venue || 'Stadion Utama'}</p>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-white text-center">
                      {f.home_team?.name} <span className="text-primary font-normal px-1">vs</span> {f.away_team?.name}
                    </td>
                    <td className="py-4 px-6 text-center font-black text-amber-500 dark:text-amber-400 text-base">
                      {f.status === 'completed' ? `${f.home_score} : ${f.away_score}` : '- : -'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase border ${
                        f.status === 'completed' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/admin/fixtures/${f.id}/edit`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-bold transition-all"
                      >
                        <Edit3 size={12} /> Update Skor
                      </Link>
                      <button
                        onClick={() => handleDelete(f.id)}
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