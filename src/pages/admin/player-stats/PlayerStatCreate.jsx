import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../services/api';

export default function PlayerStatCreate() {
  const navigate = useNavigate();
  const [fixtures, setFixtures] = useState([]);
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState({
    fixture_id: '',
    player_id: '',
    team_id: '',
    goals: 0,
    assists: 0,
    minutes_played: 90,
    shots: 0,
    shots_on_target: 0,
    passes_accuracy: 80,
    tackles: 0,
    interceptions: 0,
    dribble_success: 0,
    saves: 0,
    clean_sheet: false,
    yellow_cards: 0,
    red_cards: 0,
    own_goals: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  async function fetchInitialData() {
    try {
      const [resFixtures, resPlayers] = await Promise.all([
        api.get('/fixtures'),
        api.get('/players')
      ]);
      setFixtures(resFixtures.data);
      setPlayers(resPlayers.data);
      if (resFixtures.data.length > 0 && resPlayers.data.length > 0) {
        setForm((prev) => ({
          ...prev,
          fixture_id: resFixtures.data[0].id,
          player_id: resPlayers.data[0].id,
          team_id: resPlayers.data[0].team_id || '',
        }));
      }
    } catch (err) {
      console.error('Gagal memuat data awal');
    }
  }

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handlePlayerChange = (e) => {
    const selectedPlayerId = e.target.value;
    const playerObj = players.find((p) => p.id === Number(selectedPlayerId));
    setForm({
      ...form,
      player_id: selectedPlayerId,
      team_id: playerObj ? playerObj.team_id : '',
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/player-stats', form);
      navigate('/admin/player-stats');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan statistik pemain.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/admin/player-stats" className="inline-flex items-center text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">
          ← Kembali ke Kelola Statistik
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-black text-white mb-2">Input Statistik Performa Pemain</h1>
        <p className="text-sm text-slate-400 mb-6">Sistem akan otomatis menghitung rating laga (0-10) dan memperbarui Overall Rating pemain di database.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pilih Pertandingan (Fixture)</label>
              <select
                name="fixture_id"
                value={form.fixture_id}
                onChange={handleChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
              >
                {fixtures.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.home_team?.name} vs {f.away_team?.name} ({f.match_date ? f.match_date.substring(0, 10) : ''})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pilih Pemain</label>
              <select
                name="player_id"
                value={form.player_id}
                onChange={handlePlayerChange}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all"
              >
                {players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.team?.name || 'Tanpa Klub'}) - {p.position}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider mb-4 text-emerald-400">Kontribusi & Serangan (+ Poin)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Gol (+1.0)</label>
                <input type="number" min="0" name="goals" value={form.goals} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Assist (+0.5)</label>
                <input type="number" min="0" name="assists" value={form.assists} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Menit Bermain</label>
                <input type="number" min="0" max="120" name="minutes_played" value={form.minutes_played} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Pass Akurasi (%)</label>
                <input type="number" min="0" max="100" name="passes_accuracy" value={form.passes_accuracy} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider mb-4 text-blue-400">Pertahanan & Kiper (+ Poin)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Saves Kiper (+0.1)</label>
                <input type="number" min="0" name="saves" value={form.saves} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Tackles</label>
                <input type="number" min="0" name="tackles" value={form.tackles} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Interceptions</label>
                <input type="number" min="0" name="interceptions" value={form.interceptions} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center space-x-3">
                <input type="checkbox" id="clean_sheet" name="clean_sheet" checked={form.clean_sheet} onChange={handleChange} className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                <label htmlFor="clean_sheet" className="text-xs font-bold text-white cursor-pointer select-none">Clean Sheet (+0.5)</label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider mb-4 text-red-400">Pelanggaran & Blunder (- Poin)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Kartu Kuning (-0.3)</label>
                <input type="number" min="0" name="yellow_cards" value={form.yellow_cards} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-red-400 font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Kartu Merah (-1.0)</label>
                <input type="number" min="0" name="red_cards" value={form.red_cards} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-red-400 font-bold" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Gol Bunuh Diri (-1.0)</label>
                <input type="number" min="0" name="own_goals" value={form.own_goals} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-red-400 font-bold" />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-800">
            <Link
              to="/admin/player-stats"
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-all"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
            >
              {loading ? 'Mengkalkulasi Rating...' : 'Simpan Statistik'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}