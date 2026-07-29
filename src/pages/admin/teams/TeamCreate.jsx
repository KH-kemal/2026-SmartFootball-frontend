import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    document.title = 'Tambah Tim | KickRank';
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/admin/teams" className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
          ← Kembali ke Manajemen Tim
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Tambah Tim Baru</h1>
        <p className="text-sm text-slate-400 mb-8">Lengkapi data klub yang akan ditambahkan ke sistem.</p>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nama tim" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" required />
          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Logo Tim (Upload / URL)</label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full cursor-pointer rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-400 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-slate-700"
            />
            {uploading && <span className="text-xs text-amber-400">Mengunggah ke server...</span>}
            <input name="logo" type="url" value={form.logo} onChange={handleChange} placeholder="Atau tempel link URL gambar di sini..." className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          </div>
          {form.logo && (
            <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <img src={form.logo} alt="Preview Logo" className="h-16 w-16 rounded-xl border border-slate-700 bg-slate-800 object-cover" />
              <div className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-wider text-emerald-400">Preview Gambar</span>
                <span className="block break-all text-xs text-slate-500">{form.logo}</span>
              </div>
            </div>
          )}
          <input name="founded_year" type="number" value={form.founded_year} onChange={handleChange} placeholder="Tahun berdiri" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi tim" rows="5" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving || uploading} className="px-5 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/20">
              {saving ? 'Menyimpan...' : 'Simpan Tim'}
            </button>
            <Link to="/admin/teams" className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}