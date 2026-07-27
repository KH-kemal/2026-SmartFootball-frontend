import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function FixtureList() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchFixtures();
  }, [statusFilter]);

  const fetchFixtures = async () => {
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
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Jadwal & Hasil Pertandingan</h1>
          <p className="text-sm text-slate-400 mt-1">Kompetisi turnamen sepak bola KickRank</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
          >
            <option value="">Semua Status</option>
            <option value="scheduled">Terjadwal</option>
            <option value="completed">Selesai</option>
          </select>
          <span className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 font-semibold rounded-xl text-sm whitespace-nowrap">
            Total: {fixtures.length} Laga
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Memuat pertandingan...</div>
      ) : fixtures.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          Belum ada jadwal pertandingan yang tersedia.
        </div>
      ) : (
        <div className="space-y-4">
          {fixtures.map((fixture) => (
            <div key={fixture.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left min-w-[200px]">
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider mb-2 ${
                  fixture.status === 'completed' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {fixture.status === 'completed' ? 'Full Time' : 'Scheduled'}
                </span>
                <p className="text-sm font-bold text-white">{formatDate(fixture.match_date)}</p>
                <p className="text-xs text-slate-500 mt-0.5">{fixture.venue || 'Stadion Utama'}</p>
              </div>

              <div className="flex items-center justify-center space-x-6 flex-1">
                <div className="text-right flex-1 font-extrabold text-lg sm:text-xl text-white">
                  {fixture.home_team?.name || 'Home Team'}
                </div>
                <div className="px-6 py-3 bg-slate-950 border border-slate-800 rounded-2xl font-black text-2xl tracking-wider text-amber-400 min-w-[100px] text-center">
                  {fixture.status === 'completed' ? `${fixture.home_score} : ${fixture.away_score}` : 'VS'}
                </div>
                <div className="text-left flex-1 font-extrabold text-lg sm:text-xl text-white">
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