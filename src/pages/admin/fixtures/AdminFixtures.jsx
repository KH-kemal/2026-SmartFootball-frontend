import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Manajemen Jadwal & Skor</h1>
          <p className="text-sm text-slate-400 mt-1">Buat laga baru dan masukkan skor pertandingan</p>
        </div>
        <Link
          to="/admin/fixtures/create"
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-red-600/20"
        >
          + Buat Jadwal Baru
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Memuat data jadwal...</div>
      ) : fixtures.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          Belum ada pertandingan yang dijadwalkan.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-xs font-extrabold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Tanggal & Venue</th>
                <th className="py-4 px-6 text-center">Pertandingan</th>
                <th className="py-4 px-6 text-center">Skor</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {fixtures.map((f) => (
                <tr key={f.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-white">{formatDate(f.match_date)}</p>
                    <p className="text-xs text-slate-500">{f.venue || 'Stadion Utama'}</p>
                  </td>
                  <td className="py-4 px-6 font-bold text-white text-center">
                    {f.home_team?.name} <span className="text-red-400 font-normal px-1">vs</span> {f.away_team?.name}
                  </td>
                  <td className="py-4 px-6 text-center font-black text-amber-400 text-base">
                    {f.status === 'completed' ? `${f.home_score} : ${f.away_score}` : '- : -'}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase ${
                      f.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link
                      to={`/admin/fixtures/${f.id}/edit`}
                      className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-semibold transition-all inline-block"
                    >
                      Update Skor
                    </Link>
                    <button
                      onClick={() => handleDelete(f.id)}
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