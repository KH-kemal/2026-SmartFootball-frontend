import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../../services/api';

export default function TeamCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    logo: '',
    founded_year: '',
    description: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Tambah Tim | KBMLeague';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
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

      setForm((current) => ({ ...current, logo: response.data.url }));
    } catch (err) {
      setError('Gagal mengunggah gambar. Pastikan format png/jpg/webp dan maksimal 2MB.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      await api.post('/teams', {
        ...form,
        founded_year: form.founded_year ? Number(form.founded_year) : null,
      });
      navigate('/admin/teams');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan tim.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 transition-colors duration-300">
      <div className="mb-6">
        <Link to="/admin/teams" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline transition-colors">
          <ArrowLeft size={16} /> Kembali ke Manajemen Tim
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-xs transition-colors duration-300">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Tambah Tim Baru</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Lengkapi data klub yang akan ditambahkan ke sistem.</p>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500 dark:text-red-400 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nama Tim</label>
            <input 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              placeholder="Nama tim..." 
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              required 
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Logo Tim (Upload / URL)</label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary hover:file:bg-primary/20 file:cursor-pointer transition-colors"
            />
            {uploading && <span className="text-xs text-amber-500">Mengunggah ke server...</span>}
            <input 
              name="logo" 
              type="url" 
              value={form.logo} 
              onChange={handleChange} 
              placeholder="Atau tempel link URL logo di sini..." 
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
            />
          </div>

          {form.logo && (
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
              <img src={form.logo} alt="Preview Logo" className="h-16 w-16 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 object-cover shadow-sm" />
              <div className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-wider text-primary">Preview Logo</span>
                <span className="block break-all text-xs text-slate-400 dark:text-slate-500">{form.logo}</span>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tahun Berdiri</label>
            <input 
              name="founded_year" 
              type="number" 
              value={form.founded_year} 
              onChange={handleChange} 
              placeholder="Tahun berdiri (misal: 1999)..." 
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Deskripsi Tim</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Deskripsi singkat klub..." 
              rows="5" 
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-slate-850 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y" 
            />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button 
              type="submit" 
              disabled={saving || uploading} 
              className="px-6 py-3 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-md shadow-primary/10 cursor-pointer"
            >
              {saving ? 'Menyimpan...' : 'Simpan Tim'}
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