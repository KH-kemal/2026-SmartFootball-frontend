import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../services/api';

export default function PlayerEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    team_id: '',
    name: '',
    photo: '',
    position: 'Forward',
    jersey_number: '',
    birth_date: '',
    height: '',
    weight: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);


  async function fetchInitialData() {
    try {
      setLoading(true);
      const [resPlayer, resTeams] = await Promise.all([
        api.get(`/players/${id}`),
        api.get('/teams')
      ]);
      setTeams(resTeams.data);
      setForm({
        team_id: resPlayer.data.team_id || '',
        name: resPlayer.data.name || '',
        photo: resPlayer.data.photo || '',
        position: resPlayer.data.position || 'Forward',
        jersey_number: resPlayer.data.jersey_number || '',
        birth_date: resPlayer.data.birth_date ? resPlayer.data.birth_date.substring(0, 10) : '',
        height: resPlayer.data.height || '',
        weight: resPlayer.data.weight || '',
      });
      setError(null);
    } catch (err) {
      setError('Gagal memuat data pemain.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'players');

    setUploading(true);
    setError(null);
    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, photo: response.data.url }));
    } catch (err) {
      setError('Gagal mengunggah foto. Pastikan format png/jpg dan maksimal 2MB.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.put(`/players/${id}`, form);
      navigate('/admin/players');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui data pemain.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400">Memuat data pemain...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/admin/players" className="inline-flex items-center text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">
          ← Kembali ke Kelola Pemain
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-black text-white mb-6">Edit Data Pemain</h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Klub / Tim</label>
              <select
                name="team_id"
                value={form.team_id}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
              >
                <option value="">Pilih Klub</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Posisi Bermain</label>
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
              >
                <option value="Forward">Forward</option>
                <option value="Midfielder">Midfielder</option>
                <option value="Defender">Defender</option>
                <option value="Goalkeeper">Goalkeeper</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">No. Punggung</label>
              <input
                type="number"
                name="jersey_number"
                value={form.jersey_number}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Foto Pemain (Upload / Link URL)</label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileUpload}
                disabled={uploading}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
              />
              {uploading && <span className="text-xs text-amber-400 animate-pulse block">Mengunggah ke server...</span>}
              <input
                type="url"
                name="photo"
                value={form.photo}
                onChange={handleChange}
                placeholder="Atau tempel link URL foto di sini..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-all"
              />
            </div>
          </div>

          {form.photo && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center space-x-4">
              <img src={form.photo} alt="Preview Foto" className="w-16 h-16 object-cover rounded-xl bg-slate-800 border border-slate-700" />
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Preview Foto</span>
                <span className="text-xs text-slate-500 break-all">{form.photo}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tanggal Lahir</label>
              <input
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tinggi (cm)</label>
              <input
                type="number"
                name="height"
                value={form.height}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Berat (kg)</label>
              <input
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-slate-800">
            <Link
              to="/admin/players"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Perbarui Pemain'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}