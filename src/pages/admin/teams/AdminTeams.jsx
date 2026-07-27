import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';

export default function AdminTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await api.get('/teams');
      setTeams(response.data);
    } catch (err) {
      console.error('Gagal memuat tim:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus klub "${name}"? Semua data pemain di dalamnya akan ikut terhapus.`)) {
      try {
        await api.delete(`/teams/${id}`);
        setTeams(teams.filter((team) => team.id !== id));
      } catch (err) {
        alert('Gagal menghapus tim.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Manajemen Tim</h1>
          <p className="text-sm text-slate-400 mt-1">Kelola data klub, logo, dan sejarah berdiri</p>
        </div>
        <Link
          to="/admin/teams/create"
          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-red-600/20"
        >
          + Tambah Tim Baru
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Memuat data tim...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-xs font-extrabold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Klub</th>
                <th className="py-4 px-6">Tahun Berdiri</th>
                <th className="py-4 px-6">Jumlah Skuad</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {teams.map((team) => (
                <tr key={team.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-bold text-white flex items-center space-x-3">
                    {team.logo ? (
                      <img src={team.logo} alt={team.name} className="w-8 h-8 rounded-lg bg-slate-800 object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center font-bold text-xs">
                        {team.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span>{team.name}</span>
                  </td>
                  <td className="py-4 px-6">{team.founded_year || '-'}</td>
                  <td className="py-4 px-6 font-semibold text-emerald-400">{team.players_count || 0} Pemain</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link
                      to={`/admin/teams/${team.id}/edit`}
                      className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-semibold transition-all inline-block"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(team.id, team.name)}
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