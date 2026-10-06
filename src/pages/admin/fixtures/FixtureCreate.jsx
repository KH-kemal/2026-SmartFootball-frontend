import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../services/api';

export default function FixtureCreate() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    home_team_id: '',
    away_team_id: '',
    match_date: '',
    venue: '',
    status: 'scheduled',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  async function fetchTeams() {
    try {
      const response = await api.get('/teams');
      setTeams(response.data);
      if (response.data.length >= 2) {
        setForm((prev) => ({ ...prev, home_team_id: response.data[0].id, away_team_id: response.data[1].id }));
      }
    } catch (err) {
      console.error('Gagal memuat tim');
    }
  }

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.home_team_id === form.away_team_id) {
      setError('Tim kandang dan tim tandang tidak boleh sama.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post('/fixtures', form);
      navigate('/admin/fixtures');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan jadwal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/admin/fixtures" className="inline-flex items-center text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">
          ← Kembali ke Kelola Jadwal
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-6">Buat Jadwal Pertandingan Baru</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tim Kandang (Home)</label>
              <select
                name="home_team_id"
                value={form.home_team_id}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-all"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tim Tandang (Away)</label>
              <select
                name="away_team_id"
                value={form.away_team_id}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-all"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Waktu Kick-Off</label>
              <input
                type="datetime-local"
                name="match_date"
                value={form.match_date}
                onChange={handleChange}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stadion / Venue</label>
              <input
                type="text"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                placeholder="Contoh: Stadion Gelora Bung Tomo"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-600 focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-slate-800">
            <Link
              to="/admin/fixtures"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-slate-800 dark:text-white text-sm font-semibold transition-all shadow-lg shadow-primary/10 disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Jadwal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}