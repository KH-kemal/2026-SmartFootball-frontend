import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';

export default function PlayerCreate() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    team_id: '',
    name: '',
    photo: '',
    position: 'Forward',
    jersey_number: '',
    birth_date: '',
    height: '',
    weight: '',
    overall_rating: '6.00',
    is_active: true,
  });

  useEffect(() => {
    document.title = 'Tambah Pemain | KickRank';
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams');
      setTeams(response.data);
    } catch (err) {
      console.error('Gagal memuat tim:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await api.post('/players', {
        ...form,
        team_id: Number(form.team_id),
        jersey_number: Number(form.jersey_number),
        height: form.height ? Number(form.height) : null,
        weight: form.weight ? Number(form.weight) : null,
        overall_rating: form.overall_rating ? Number(form.overall_rating) : null,
        birth_date: form.birth_date || null,
      });
      navigate('/admin/players');
    } catch (err) {
      alert('Gagal menyimpan pemain.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/admin/players" className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
          ← Kembali ke Manajemen Pemain
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Tambah Pemain Baru</h1>
        <p className="text-sm text-slate-400 mb-8">Isi data pemain untuk ditambahkan ke dalam database.</p>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <select name="team_id" value={form.team_id} onChange={handleChange} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" required>
            <option value="">Pilih klub</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nama pemain" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" required />
          <input name="photo" value={form.photo} onChange={handleChange} placeholder="URL foto" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select name="position" value={form.position} onChange={handleChange} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500">
              <option value="Forward">Forward</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Defender">Defender</option>
              <option value="Goalkeeper">Goalkeeper</option>
            </select>
            <input name="jersey_number" type="number" value={form.jersey_number} onChange={handleChange} placeholder="Nomor punggung" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input name="birth_date" type="date" value={form.birth_date} onChange={handleChange} className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            <input name="height" type="number" value={form.height} onChange={handleChange} placeholder="Tinggi (cm)" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            <input name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="Berat (kg)" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <input name="overall_rating" type="number" step="0.01" min="0" max="10" value={form.overall_rating} onChange={handleChange} placeholder="Overall rating" className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" />
            <label className="flex items-center gap-3 text-slate-300 text-sm font-medium bg-slate-950 border border-slate-800 rounded-xl px-4 py-3">
              <input name="is_active" type="checkbox" checked={form.is_active} onChange={handleChange} className="w-4 h-4 accent-red-600" />
              Pemain aktif
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="px-5 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/20">
              {saving ? 'Menyimpan...' : 'Simpan Pemain'}
            </button>
            <Link to="/admin/players" className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}