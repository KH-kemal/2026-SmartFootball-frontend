import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import api from '../../services/api';

export default function LeagueTable() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  async function fetchLeagueTable() {
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
  }

  useEffect(() => {
    fetchLeagueTable();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="public-page-intro mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
          <Trophy className="text-primary" /> Klasemen Liga Sementara
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Peringkat klub berdasarkan poin, selisih gol, dan agresivitas gol</p>
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Memuat klasemen...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-500 dark:text-red-400 font-semibold max-w-lg mx-auto">
          {error}
        </div>
      )}

      {!loading && !error && standings.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-md transition-colors duration-300">
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Belum ada data klasemen.</p>
        </div>
      )}

      {!loading && !error && standings.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xs transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase text-xs font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-850">
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
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                {standings.map((row, index) => {
                  const isTop3 = index < 3;
                  return (
                    <tr key={row.team.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className={`py-4 px-4 text-center font-black ${isTop3 ? 'text-primary' : 'text-slate-400'}`}>{index + 1}</td>
                      <td className="py-4 px-6 font-bold text-slate-800 dark:text-white">
                        <Link to={`/teams/${row.team.id}`} className="flex items-center space-x-3 hover:text-primary transition-colors group">
                          {row.team.logo ? (
                            <img src={row.team.logo} alt={row.team.name} className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 object-cover border border-slate-200/60 dark:border-slate-700/60 group-hover:scale-105 transition-transform shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                              {row.team.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <span className="truncate">{row.team.name}</span>
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-center text-slate-500 dark:text-slate-400">{row.played}</td>
                      <td className="py-4 px-4 text-center text-emerald-600 dark:text-emerald-400 font-bold">{row.win}</td>
                      <td className="py-4 px-4 text-center text-slate-500 dark:text-slate-400">{row.draw}</td>
                      <td className="py-4 px-4 text-center text-red-600 dark:text-red-400 font-bold">{row.lose}</td>
                      <td className="py-4 px-4 text-center text-slate-500 dark:text-slate-400">{row.gf}</td>
                      <td className="py-4 px-4 text-center text-slate-500 dark:text-slate-400">{row.ga}</td>
                      <td className="py-4 px-4 text-center font-bold text-slate-600 dark:text-slate-300">
                        {row.gd > 0 ? `+${row.gd}` : row.gd}
                      </td>
                      <td className="py-4 px-6 text-right font-black text-primary text-lg">{row.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}