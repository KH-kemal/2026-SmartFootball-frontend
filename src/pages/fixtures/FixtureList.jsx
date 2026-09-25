import { useState, useEffect } from 'react';
import { Calendar, Shield, Trophy } from 'lucide-react';
import api from '../../services/api';

export default function FixtureList() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');


  async function fetchFixtures() {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const response = await api.get('/fixtures', { params });
      setFixtures(response.data);
    } catch (err) {
      console.error('Gagal memuat jadwal:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFixtures();
  }, [statusFilter]);

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <Calendar className="text-primary" /> Jadwal & Hasil Pertandingan
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Kompetisi turnamen sepak bola SmartFootball</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer shadow-xs"
          >
            <option value="">Semua Status</option>
            <option value="scheduled">Terjadwal</option>
            <option value="completed">Selesai</option>
          </select>
          <span className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary font-bold rounded-xl text-sm whitespace-nowrap">
            Total: {fixtures.length} Laga
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Memuat pertandingan...</p>
        </div>
      ) : fixtures.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 dark:text-slate-400 shadow-md transition-colors duration-300">
          Belum ada jadwal pertandingan yang tersedia.
        </div>
      ) : (
        <div className="space-y-4">
          {fixtures.map((fixture) => (
            <div key={fixture.id} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md hover:border-primary/30">
              <div className="text-center md:text-left min-w-[200px]">
                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-3 border ${
                  fixture.status === 'completed' 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                }`}>
                  {fixture.status === 'completed' ? 'Full Time' : 'Scheduled'}
                </span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{formatDate(fixture.match_date)}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{fixture.venue || 'Stadion Utama'}</p>
              </div>

              <div className="flex items-center justify-center space-x-6 flex-1 w-full md:w-auto">
                <div className="text-right flex-1 font-bold text-base sm:text-lg text-slate-800 dark:text-white truncate">
                  {fixture.home_team?.name || 'Home Team'}
                </div>
                <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl font-black text-2xl tracking-wider text-amber-500 dark:text-amber-400 min-w-[110px] text-center shadow-xs transition-colors">
                  {fixture.status === 'completed' ? `${fixture.home_score} : ${fixture.away_score}` : 'VS'}
                </div>
                <div className="text-left flex-1 font-bold text-base sm:text-lg text-slate-800 dark:text-white truncate">
                  {fixture.away_team?.name || 'Away Team'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}