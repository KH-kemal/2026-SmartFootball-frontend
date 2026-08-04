import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, X } from 'lucide-react';
import api from '../../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [googleError, setGoogleError] = useState(null);

  const googleMockAccounts = [
    { name: 'Budi Santoso', email: 'budi.santoso@gmail.com' },
    { name: 'Andi Pratama', email: 'andi.pratama@gmail.com' },
    { name: 'Rizky Ramadhan', email: 'rizky.ramadhan@gmail.com' },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.email.toLowerCase().endsWith('@gmail.com')) {
      setError('Pendaftaran hanya diperbolehkan menggunakan email Gmail (@gmail.com).');
      setLoading(false);
      return;
    }

    if (form.password !== form.password_confirmation) {
      setError('Konfirmasi kata sandi tidak cocok.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/register', form);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (name, email) => {
    setLoading(true);
    setGoogleError(null);

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setGoogleError('Akun Google harus berupa alamat Gmail (@gmail.com).');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/google-auth', { name, email });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setShowGoogleModal(false);
      navigate('/');
    } catch (err) {
      setGoogleError(err.response?.data?.message || 'Gagal autentikasi Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 dark:bg-violet-600/5 rounded-full blur-3xl -z-10"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <Link to="/" className="hover:scale-105 transition-all">
            <img 
              src="/logo.png" 
              alt="SmartFootball Logo" 
              className="w-16 h-16 object-contain drop-shadow-lg" 
            />
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black text-slate-800 dark:text-white tracking-tight">
          Buat Akun Baru
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
          Daftar SmartFootball menggunakan akun Gmail Anda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 transition-colors duration-300">
          
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-4 text-rose-600 dark:text-rose-400 text-sm mb-6 font-semibold flex items-center space-x-2">
              <ShieldAlert size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Budi Santoso"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-450 dark:placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Email Gmail
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="nama@gmail.com"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-450 dark:placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Kata Sandi
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-450 dark:placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Konfirmasi Kata Sandi
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-450 dark:placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 font-medium"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 duration-300 cursor-pointer"
              >
                {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
              </button>
            </div>
          </form>

          {/* Social Sign In Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-500 dark:text-slate-400">
                Atau daftar dengan
              </span>
            </div>
          </div>

          {/* Google Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowGoogleModal(true)}
              className="w-full flex items-center justify-center space-x-2.5 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-55/50 dark:hover:bg-slate-900 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-bold text-sm text-slate-700 dark:text-slate-200 shadow-sm cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.57 15.02 1 12 1 7.24 1 3.2 3.73 1.24 7.72l3.82 2.96C6 7.42 8.76 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.58v2.96h3.9c2.28-2.1 3.55-5.19 3.55-8.69z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.06 14.68A7.22 7.22 0 0 1 4.6 12c0-.94.16-1.85.46-2.68L1.24 6.36A11.933 11.933 0 0 0 0 12c0 2.06.52 4.01 1.44 5.73l3.62-3.05z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.9-2.96c-1.08.72-2.47 1.16-4.06 1.16-3.24 0-6-2.38-6.94-5.64L1.24 15.6C3.2 19.58 7.24 23 12 23z"
                />
              </svg>
              <span>Daftar menggunakan Google</span>
            </button>
          </div>

          <div className="mt-8 border-t border-slate-100 dark:border-slate-800/80 pt-6 flex items-center justify-between">
            <Link to="/" className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center space-x-1">
              <ArrowLeft size={12} />
              <span>Kembali</span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary hover:text-primary-hover hover:underline transition-all">
                Masuk
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Simulated Google OAuth Dialog Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 relative animate-in scale-in duration-300">
            {/* Close button */}
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 dark:hover:text-white p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none"
            >
              <X size={16} />
            </button>

            {/* Google Logo */}
            <div className="flex justify-center mb-4">
              <svg className="w-10 h-10" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.57 15.02 1 12 1 7.24 1 3.2 3.73 1.24 7.72l3.82 2.96C6 7.42 8.76 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.58v2.96h3.9c2.28-2.1 3.55-5.19 3.55-8.69z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.06 14.68A7.22 7.22 0 0 1 4.6 12c0-.94.16-1.85.46-2.68L1.24 6.36A11.933 11.933 0 0 0 0 12c0 2.06.52 4.01 1.44 5.73l3.62-3.05z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.9-2.96c-1.08.72-2.47 1.16-4.06 1.16-3.24 0-6-2.38-6.94-5.64L1.24 15.6C3.2 19.58 7.24 23 12 23z"
                />
              </svg>
            </div>

            <h3 className="text-lg font-black text-center text-slate-800 dark:text-white">
              Pilih Akun Google Anda
            </h3>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-1 font-medium">
              untuk melanjutkan ke SmartFootball
            </p>

            {googleError && (
              <div className="mt-4 bg-rose-500/10 border border-rose-500/25 rounded-xl p-3 text-rose-600 dark:text-rose-400 text-xs font-semibold text-center">
                {googleError}
              </div>
            )}

            {/* List of Mock Accounts */}
            <div className="mt-6 space-y-2">
              {googleMockAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => handleGoogleAuth(account.name, account.email)}
                  className="w-full flex items-center space-x-3 p-3 rounded-2xl border border-slate-100 hover:border-primary/30 dark:border-slate-800 bg-slate-50/50 hover:bg-primary/5 dark:bg-slate-950 dark:hover:bg-primary/5 transition-all text-left group focus:outline-none cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 text-slate-650 dark:text-slate-350 font-bold text-xs flex items-center justify-center group-hover:from-primary group-hover:to-violet-600 group-hover:text-white transition-all">
                    {account.name[0]}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                      {account.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {account.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Google Account Form */}
            <div className="mt-5 border-t border-slate-150 dark:border-slate-800 pt-5">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Gunakan Akun Google Lain
              </h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-primary transition-all font-medium"
                />
                <input
                  type="email"
                  placeholder="alamat@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-primary transition-all font-medium"
                />
                <button
                  onClick={() => handleGoogleAuth(customGoogleName, customGoogleEmail)}
                  disabled={!customGoogleName || !customGoogleEmail}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 transition-all disabled:opacity-50 cursor-pointer"
                >
                  Lanjutkan dengan Akun Baru
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
