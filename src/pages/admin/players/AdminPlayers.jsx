import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Edit3, Trash2 } from 'lucide-react';
import api from '../../../services/api';

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/players');
      setPlayers(response.data);
    } catch (err) {
      console.error('Gagal memuat pemain:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus pemain "${name}"?`)) {
      try {
        await api.delete(`/players/${id}`);
        setPlayers(players.filter((player) => player.id !== id));
      } catch (err) {
        alert('Gagal menghapus pemain.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <Users className="text-primary" /> Manajemen Pemain
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Kelola biodata, posisi, nomor punggung, dan klub pemain</p>
        </div>
        <Link
          to="/admin/players/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-primary/10"
        >
          <Plus size={16} /> Tambah Pemain Baru
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Memuat data pemain...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xs transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase text-xs font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-850">
                <tr>
                  <th className="py-4 px-6">Pemain</th>
                  <th className="py-4 px-6">Klub</th>
                  <th className="py-4 px-6">Posisi</th>
                  <th className="py-4 px-6 text-center">No. Punggung</th>
                  <th className="py-4 px-6 text-right">Rating</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                {players.map((player) => (
                  <tr key={player.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-white truncate max-w-[180px]">{player.name}</td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-450">{player.team?.name || 'Tanpa Klub'}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold uppercase">
                        {player.position}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-black text-amber-500">#{player.jersey_number}</td>
                    <td className="py-4 px-6 text-right font-black text-primary">{Number(player.overall_rating).toFixed(2)}</td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/admin/players/${player.id}/edit`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-bold transition-all"
                      >
                        <Edit3 size={12} /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(player.id, player.name)}
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