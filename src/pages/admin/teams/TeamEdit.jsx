import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../services/api';

export default function TeamEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    logo: '',
    founded_year: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/teams/${id}`);
      setForm({
        name: response.data.name || '',
        logo: response.data.logo || '',
        founded_year: response.data.founded_year || '',
        description: response.data.description || '',
      });
      setError(null);
    } catch (err) {
      setError('Gagal memuat data tim.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put(`/teams/${id}`, form);
      navigate('/admin/teams');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui data tim.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Memuat data tim...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/admin/teams" className="inline-flex items-center text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">
          ← Kembali ke Kelola Tim
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-black text-white mb-6">Edit Data Tim</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Klub / Tim</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tahun Berdiri</label>
              <input
                type="number"
                name="founded_year"
                value={form.founded_year}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">URL Logo (Opsional)</label>
              <input
                type="url"
                name="logo"
                value={form.logo}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deskripsi Klub</label>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-slate-800">
            <Link
              to="/admin/teams"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Perbarui Tim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}