import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/login', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/admin/teams');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal login. Periksa email dan kata sandi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-600/30">
            KR
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Login Panel Admin
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          KickRank Management Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="admin@kickrank.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none transition-all disabled:opacity-50"
              >
                {loading ? 'Memverifikasi...' : 'Masuk ke Portal Admin'}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-6 text-center">
            <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              ← Kembali ke Web Publik
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}