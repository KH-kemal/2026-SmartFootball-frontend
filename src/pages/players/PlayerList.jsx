import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Daftar Pemain</h1>
          <p className="text-sm text-slate-400 mt-1">Statistik dan rating keseluruhan pemain liga</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2">
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            >
              <option value="">Semua Posisi</option>
              <option value="Forward">Forward</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Defender">Defender</option>
              <option value="Goalkeeper">Goalkeeper</option>
            </select>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari pemain atau tim..."
              className="w-56 sm:w-72 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20"
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
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-all"
              >
                Reset
              </button>
            )}
          </form>
          <span className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 font-semibold rounded-xl text-sm whitespace-nowrap">
            Total: {players.length} Pemain
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg animate-pulse">Memuat data pemain...</p>
        </div>
      ) : players.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400 text-lg">Pemain tidak ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <Link
              key={player.id}
              to={`/players/${player.id}`}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {player.team?.logo ? (
                      <img
                        src={player.team.logo}
                        alt={player.team?.name}
                        className="w-11 h-11 rounded-full bg-slate-800 p-1 border border-slate-700 object-cover"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm">
                        {player.team?.name?.substring(0, 2).toUpperCase() || 'TM'}
                      </div>
                    )}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {player.team?.name || 'Tanpa Klub'}
                      </h3>
                      <span className="text-xs text-slate-500">Est. {player.team?.founded_year || '-'}</span>
                    </div>
                  </div>
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-lg font-black text-amber-400">
                    #{player.jersey_number}
                  </span>
                </div>

                <div className="mt-5">
                  <span className="inline-block px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-xs font-semibold mb-2.5">
                    {player.position}
                  </span>
                  <h2 className="text-xl font-bold text-white tracking-wide">{player.name}</h2>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Overall Rating</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-emerald-400">
                    {Number(player.overall_rating).toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">/ 100</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}