import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Manajemen Pemain</h1>
          <p className="text-sm text-slate-400 mt-1">Kelola biodata, posisi, nomor punggung, dan klub pemain</p>
        </div>
        <Link
          to="/admin/players/create"
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-red-600/20"
        >
          + Tambah Pemain Baru
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Memuat data pemain...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-xs font-extrabold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Pemain</th>
                <th className="py-4 px-6">Klub</th>
                <th className="py-4 px-6">Posisi</th>
                <th className="py-4 px-6 text-center">No. Punggung</th>
                <th className="py-4 px-6 text-right">Rating</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {players.map((player) => (
                <tr key={player.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">{player.name}</td>
                  <td className="py-4 px-6 text-slate-400 font-medium">{player.team?.name || 'Tanpa Klub'}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-xs font-semibold">
                      {player.position}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center font-bold text-amber-400">#{player.jersey_number}</td>
                  <td className="py-4 px-6 text-right font-black text-emerald-400">{Number(player.overall_rating).toFixed(2)}</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link
                      to={`/admin/players/${player.id}/edit`}
                      className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-semibold transition-all inline-block"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(player.id, player.name)}
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