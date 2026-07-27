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

  useEffect(() => {
    document.title = 'Tambah Tim | KickRank';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await api.post('/teams', {
        ...form,
        founded_year: form.founded_year ? Number(form.founded_year) : null,
      });
      navigate('/admin/teams');
    } catch (err) {
      alert('Gagal menyimpan tim.');
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

        <form onSubmit={handleSubmit} className="grid gap-5">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nama tim" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" required />
          <input name="logo" value={form.logo} onChange={handleChange} placeholder="URL logo" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          <input name="founded_year" type="number" value={form.founded_year} onChange={handleChange} placeholder="Tahun berdiri" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi tim" rows="5" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="px-5 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/20">
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