import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../services/api';

export default function FixtureEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fixture, setFixture] = useState(null);
  const [form, setForm] = useState({
    home_score: 0,
    away_score: 0,
    status: 'completed',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  async function fetchFixture() {
    try {
      setLoading(true);
      const response = await api.get(`/fixtures/${id}`);
      setFixture(response.data);
      setForm({
        home_score: response.data.home_score || 0,
        away_score: response.data.away_score || 0,
        status: 'completed',
      });
    } catch (err) {
      setError('Gagal memuat data laga.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFixture();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/fixtures/${id}`, form);
      navigate('/admin/fixtures');
    } catch (err) {
      setError('Gagal memperbarui skor.');
      setLoading(false);
    }
  };

  if (loading && !fixture) return <div className="text-center py-12 text-slate-400">Memuat pertandingan...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/admin/fixtures" className="inline-flex items-center text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">
          ← Kembali ke Kelola Jadwal
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Input Hasil Pertandingan</h1>
        <p className="text-sm text-slate-400 mb-8">{fixture?.venue}</p>

        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <span className="block font-extrabold text-lg text-slate-800 dark:text-white mb-3">{fixture?.home_team?.name}</span>
              <input
                type="number"
                min="0"
                name="home_score"
                value={form.home_score}
                onChange={handleChange}
                className="w-24 h-20 text-center bg-slate-50 dark:bg-slate-950 border border-slate-800 rounded-2xl text-4xl font-black text-amber-400 focus:outline-none focus:border-primary mx-auto block"
              />
              <span className="text-xs text-slate-500 font-bold mt-2 block">HOME</span>
            </div>

            <div className="text-2xl font-black text-slate-600 pb-6">:</div>

            <div className="flex-1 text-center">
              <span className="block font-extrabold text-lg text-slate-800 dark:text-white mb-3">{fixture?.away_team?.name}</span>
              <input
                type="number"
                min="0"
                name="away_score"
                value={form.away_score}
                onChange={handleChange}
                className="w-24 h-20 text-center bg-slate-50 dark:bg-slate-950 border border-slate-800 rounded-2xl text-4xl font-black text-amber-400 focus:outline-none focus:border-primary mx-auto block"
              />
              <span className="text-xs text-slate-500 font-bold mt-2 block">AWAY</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status Laga</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:border-primary transition-all text-center font-bold"
            >
              <option value="completed">Completed (Selesai - Full Time)</option>
              <option value="scheduled">Scheduled (Belum Selesai)</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-800">
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
              Simpan Hasil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}