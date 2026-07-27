import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function LeagueTable() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeagueTable();
  }, []);

  const fetchLeagueTable = async () => {
    try {
      setLoading(true);
      const response = await api.get('/league-table');
      setStandings(response.data);
      setError(null);
    } catch (err) {
      setError('Gagal mengambil data klasemen liga.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 pb-4 border-b border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Klasemen Liga Sementara</h1>
        <p className="text-sm text-slate-400 mt-1">Peringkat klub berdasarkan poin, selisih gol, dan agresivitas gol</p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg animate-pulse">Memuat klasemen...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && standings.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400 text-lg">Belum ada data klasemen.</p>
        </div>
      )}

      {!loading && !error && standings.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-xs font-extrabold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-4 text-center w-12">#</th>
                <th className="py-4 px-6">Klub</th>
                <th className="py-4 px-4 text-center">Main</th>
                <th className="py-4 px-4 text-center">Menang</th>
                <th className="py-4 px-4 text-center">Seri</th>
                <th className="py-4 px-4 text-center">Kalah</th>
                <th className="py-4 px-4 text-center">GF</th>
                <th className="py-4 px-4 text-center">GA</th>
                <th className="py-4 px-4 text-center">GD</th>
                <th className="py-4 px-6 text-right">Poin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {standings.map((row, index) => (
                <tr key={row.team.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4 text-center font-black text-slate-500">{index + 1}</td>
                  <td className="py-4 px-6 font-bold text-white">
                    <Link to={`/teams/${row.team.id}`} className="flex items-center space-x-3 hover:text-blue-400 transition-colors">
                      {row.team.logo ? (
                        <img src={row.team.logo} alt={row.team.name} className="w-7 h-7 rounded-lg bg-slate-800 object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xs">
                          {row.team.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span>{row.team.name}</span>
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-center text-slate-400">{row.played}</td>
                  <td className="py-4 px-4 text-center text-emerald-400 font-bold">{row.win}</td>
                  <td className="py-4 px-4 text-center text-slate-400">{row.draw}</td>
                  <td className="py-4 px-4 text-center text-red-400 font-bold">{row.lose}</td>
                  <td className="py-4 px-4 text-center text-slate-300">{row.gf}</td>
                  <td className="py-4 px-4 text-center text-slate-300">{row.ga}</td>
                  <td className="py-4 px-4 text-center font-bold text-slate-300">
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td className="py-4 px-6 text-right font-black text-amber-400 text-lg">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}