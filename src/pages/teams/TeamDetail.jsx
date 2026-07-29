import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

export default function TeamDetail() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [squad, setSquad] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeamData();
  }, [id]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const [resTeam, resPlayers, resFixtures] = await Promise.all([
        api.get(`/teams/${id}`),
        api.get('/players'),
        api.get('/fixtures')
      ]);
      
      setTeam(resTeam.data);
      setSquad(resPlayers.data.filter((p) => p.team_id === Number(id)));
      setFixtures(
        resFixtures.data.filter(
          (f) => f.home_team_id === Number(id) || f.away_team_id === Number(id)
        )
      );
      setError(null);
    } catch (err) {
      setError('Gagal memuat detail klub.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getMatchBadge = (fixture) => {
    if (fixture.status !== 'completed') {
      return { label: 'SCHEDULED', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
    }
    const isHome = fixture.home_team_id === Number(id);
    const myScore = isHome ? fixture.home_score : fixture.away_score;
    const oppScore = isHome ? fixture.away_score : fixture.home_score;

    if (myScore > oppScore) {
      return { label: 'WIN', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
    }
    if (myScore < oppScore) {
      return { label: 'LOSE', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
    }
    return { label: 'DRAW', color: 'bg-slate-500/10 text-slate-300 border-slate-500/20' };
  };

  const groupedSquad = {
    Forward: squad.filter((p) => p.position === 'Forward'),
    Midfielder: squad.filter((p) => p.position === 'Midfielder'),
    Defender: squad.filter((p) => p.position === 'Defender'),
    Goalkeeper: squad.filter((p) => p.position === 'Goalkeeper'),
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 text-lg animate-pulse">Memuat portal klub...</p>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400 mb-4">
          {error || 'Klub tidak ditemukan.'}
        </div>
        <Link to="/teams" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold">
          Kembali ke Daftar Tim
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/teams" className="inline-flex items-center text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
          ← Kembali ke Daftar Tim
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl mb-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-6">
            {team.logo ? (
              <img src={team.logo} alt={team.name} className="w-24 h-24 rounded-2xl bg-slate-800 p-2 border border-slate-700 object-cover shadow-xl" />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-3xl shadow-xl">
                {team.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold rounded-lg text-xs uppercase tracking-wider">
                Est. {team.founded_year || 'N/A'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-2">{team.name}</h1>
              <p className="text-slate-400 text-sm mt-1 max-w-2xl">{team.description || 'Tidak ada deskripsi klub.'}</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl px-6 py-4 flex flex-col items-end min-w-[160px]">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Skuad</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-black text-blue-400">{squad.length}</span>
              <span className="text-sm font-bold text-slate-500">Pemain</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-extrabold text-white mb-6">Skuad Pemain (Roster)</h2>
        {squad.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            Belum ada pemain yang terdaftar di klub ini.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedSquad).map(([position, players]) => (
              players.length > 0 && (
                <div key={position}>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4 border-l-4 border-blue-500 pl-3">
                    {position}s ({players.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {players.map((player) => (
                      <Link
                        key={player.id}
                        to={`/players/${player.id}`}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex items-center space-x-4 transition-all hover:shadow-lg group"
                      >
                        {player.photo ? (
                          <img src={player.photo} alt={player.name} className="w-14 h-14 rounded-xl bg-slate-800 object-cover" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center font-black text-lg group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                            #{player.jersey_number}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-amber-400">#{player.jersey_number}</span>
                          <h4 className="font-bold text-white text-base truncate group-hover:text-blue-400 transition-colors">
                            {player.name}
                          </h4>
                          <span className="text-xs text-slate-400 font-medium block mt-0.5">
                            Rating: <strong className="text-emerald-400">{Number(player.overall_rating).toFixed(2)}</strong>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-white mb-6">Riwayat & Jadwal Pertandingan Klub</h2>
        {fixtures.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            Belum ada jadwal pertandingan untuk klub ini.
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-xs font-extrabold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Waktu & Venue</th>
                  <th className="py-4 px-6 text-center">Pertandingan</th>
                  <th className="py-4 px-6 text-center">Skor</th>
                  <th className="py-4 px-6 text-right">Hasil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {fixtures.map((fixture) => {
                  const badge = getMatchBadge(fixture);
                  return (
                    <tr key={fixture.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-bold text-white">{formatDate(fixture.match_date)}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{fixture.venue || 'Stadion Utama'}</p>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-white">
                        <span className={fixture.home_team_id === Number(id) ? 'text-blue-400 font-extrabold' : ''}>
                          {fixture.home_team?.name}
                        </span>
                        <span className="text-red-400 font-normal px-2">vs</span>
                        <span className={fixture.away_team_id === Number(id) ? 'text-blue-400 font-extrabold' : ''}>
                          {fixture.away_team?.name}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center font-black text-amber-400 text-lg">
                        {fixture.status === 'completed' ? `${fixture.home_score} : ${fixture.away_score}` : '- : -'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`px-3 py-1 rounded-lg text-xs font-black border uppercase tracking-wider inline-block ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}