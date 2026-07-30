import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, UserCheck } from 'lucide-react';
import api from '../../services/api';

export default function PlayerList() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, [position]);

  const fetchPlayers = async (searchQuery = search) => {
    try {
      setLoading(true);
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (position) params.position = position;

      const response = await api.get('/players', { params });
      setPlayers(response.data);
    } catch (err) {
      console.error('Gagal mengambil data pemain:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPlayers(search);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <UserCheck className="text-primary" /> Daftar Pemain
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Statistik dan rating keseluruhan pemain liga</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2">
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer shadow-xs"
            >
              <option value="">Semua Posisi</option>
              <option value="Forward">Forward</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Defender">Defender</option>
              <option value="Goalkeeper">Goalkeeper</option>
            </select>

            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari pemain atau tim..."
                className="w-56 sm:w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-10 py-2 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-xs"
              />
              <Search className="absolute right-3 top-2.5 text-slate-400" size={16} />
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-primary/10"
            >
              Cari
            </button>
            {(position || search) && (
              <button
                type="button"
                onClick={() => {
                  setPosition('');
                  setSearch('');
                  fetchPlayers('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold transition-all border border-slate-200/60 dark:border-slate-700/60"
              >
                Reset
              </button>
            )}
          </form>
          <span className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary font-bold rounded-xl text-sm whitespace-nowrap">
            Total: {players.length} Pemain
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Memuat data pemain...</p>
        </div>
      ) : players.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-md transition-colors duration-300">
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Pemain tidak ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <Link
              key={player.id}
              to={`/players/${player.id}`}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xs hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100 dark:border-slate-800/50">
                  <div className="flex items-center space-x-3">
                    {player.team?.logo ? (
                      <img
                        src={player.team.logo}
                        alt={player.team?.name}
                        className="w-11 h-11 rounded-full bg-slate-50 dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-slate-700 object-cover"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase">
                        {player.team?.name?.substring(0, 2).toUpperCase() || 'TM'}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider group-hover:text-primary transition-colors">
                        {player.team?.name || 'Tanpa Klub'}
                      </h3>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">Est. {player.team?.founded_year || '-'}</span>
                    </div>
                  </div>
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-lg font-black text-amber-500 shadow-xs">
                    #{player.jersey_number}
                  </span>
                </div>

                <div className="mt-5">
                  <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold mb-2.5">
                    {player.position}
                  </span>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-wide group-hover:text-primary transition-colors">{player.name}</h2>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Overall Rating</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-primary">
                    {Number(player.overall_rating).toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-bold">/ 10.00</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}