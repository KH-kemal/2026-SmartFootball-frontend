import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeam();
    document.title = 'Edit Tim | SmartFootball';
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'teams');

    setUploading(true);
    setError(null);
    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, logo: response.data.url }));
    } catch (err) {
      setError('Gagal mengunggah gambar. Pastikan format png/jpg dan maksimal 2MB.');
    } finally {
      setUploading(false);
    }
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
    return (
      <div className="text-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Memuat data tim...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 transition-colors duration-300">
      <div className="mb-6">
        <Link to="/admin/teams" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline transition-colors">
          <ArrowLeft size={16} /> Kembali ke Kelola Tim
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-xs transition-colors duration-300">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Edit Data Tim</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Ubah rincian klub yang ada di dalam sistem.</p>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500 dark:text-red-400 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nama Klub / Tim</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="grid gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tahun Berdiri</label>
              <input
                type="number"
                name="founded_year"
                value={form.founded_year}
                onChange={handleChange}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Logo Klub (Upload / Link URL)</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary hover:file:bg-primary/20 file:cursor-pointer transition-colors"
                />
                {uploading && <span className="text-xs text-amber-500 animate-pulse block">Mengunggah ke server...</span>}
                <input
                  type="url"
                  name="logo"
                  value={form.logo}
                  onChange={handleChange}
                  placeholder="Atau tempel link URL logo di sini..."
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
            </div>
          </div>

          {form.logo && (
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
              <img src={form.logo} alt="Preview Logo" className="h-16 w-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 object-cover shadow-sm shrink-0" />
              <div className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-wider text-primary">Preview Logo</span>
                <span className="block break-all text-xs text-slate-400 dark:text-slate-500">{form.logo}</span>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Deskripsi Klub</label>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
            ></textarea>
          </div>

          <div className="flex items-center gap-3 mt-4 border-t border-slate-100 dark:border-slate-800 pt-6">
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-6 py-3 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-md shadow-primary/10 cursor-pointer"
            >
              {saving ? 'Menyimpan...' : 'Perbarui Tim'}
            </button>
            <Link
              to="/admin/teams"
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 font-bold rounded-xl border border-slate-200/60 dark:border-slate-700/60 transition-all text-center"
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}