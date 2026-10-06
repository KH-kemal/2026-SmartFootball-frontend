import AdminListTools from '../../../components/AdminListTools';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Edit3, Trash2, QrCode, X, Printer, Shield } from 'lucide-react';
import api from '../../../services/api';

export default function AdminPlayers() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const filtered = players.filter(player => ([player.name, player.team?.name, player.position].join(' ') || '').toLowerCase().includes(search.trim().toLowerCase()));
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);


  async function fetchPlayers() {
    try {
      setLoading(true);
      const response = await api.get('/players');
      setPlayers(response.data);
    } catch (err) {
      console.error('Gagal memuat pemain:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Yakin ingin menghapus pemain "${name}"?`)) {
      try {
        await api.delete(`/players/${id}`);
        setPlayers(players.filter((player) => player.id !== id));
      } catch (err) {
        alert('Gagal menghapus pemain.');
      }
    }
  };

  const handleGenerateQr = async (id) => {
    try {
      const response = await api.post(`/players/${id}/generate-qr`);
      setPlayers(players.map((player) => (player.id === id ? response.data : player)));
      alert('QR Code berhasil dibuat!');
    } catch (err) {
      console.error(err);
      alert('Gagal membuat QR Code.');
    }
  };

  const handlePrint = () => {
    if (!selectedPlayer) return;
    const printWindow = window.open('', '_blank');

    // Gunakan Google Charts API untuk QR Code di printout agar tidak memerlukan library canvas local
    const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=${encodeURIComponent(selectedPlayer.qr_code)}`;
    const photoUrl = selectedPlayer.photo || '/logo.png';

    printWindow.document.write(`
      <html>
        <head>
          <title>Print ID Card - ${selectedPlayer.name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: 85.6mm 54mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="w-[85.6mm] h-[54mm] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-3.5 border border-amber-500/40 rounded-xl flex flex-row justify-between items-center relative overflow-hidden select-none">
            {/* Background Accent */}
            <div class="absolute -right-10 -bottom-10 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
            <div class="absolute -left-10 -top-10 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>

            {/* Left Side: Photo & Team */}
            <div class="flex flex-col items-center w-[30%] shrink-0">
              <div class="w-16 h-16 rounded-xl border border-slate-700/50 bg-slate-950 overflow-hidden relative mb-1.5">
                <img src="${photoUrl}" alt="Photo" class="w-full h-full object-cover" />
              </div>
              <span class="text-[7px] font-black text-amber-500 tracking-wider text-center truncate w-full uppercase">
                ${selectedPlayer.team?.name || 'Tanpa Klub'}
              </span>
            </div>

            {/* Middle: Details */}
            <div class="flex flex-col justify-center flex-1 px-3 min-w-0">
              <span class="text-[6px] font-bold text-primary tracking-widest uppercase mb-0.5">
                KickRank Athlete
              </span>
              <h2 class="text-[12px] font-black tracking-tight text-white leading-tight uppercase truncate">
                ${selectedPlayer.name}
              </h2>

              <div class="flex items-center gap-1.5 mt-1">
                <span class="px-1.5 py-0.5 bg-primary/20 border border-primary/30 rounded text-[6px] font-bold uppercase tracking-wider text-primary">
                  ${selectedPlayer.position}
                </span>
                <span class="text-[7px] font-bold text-slate-400">
                  #${selectedPlayer.jersey_number}
                </span>
              </div>

              <div class="flex items-baseline gap-1 mt-2">
                <span class="text-[6px] font-bold text-slate-400 uppercase">Rating:</span>
                <span class="text-[10px] font-black text-amber-400">${Number(selectedPlayer.overall_rating).toFixed(2)}</span>
              </div>
            </div>

            {/* Right Side: QR Code */}
            <div class="flex flex-col items-center justify-center w-[25%] shrink-0 pl-1 border-l border-slate-800/60">
              <div class="bg-white p-1 rounded-lg shadow-sm">
                <img src="${qrCodeUrl}" alt="QR" class="w-[38px] h-[38px]" />
              </div>
              <span class="text-[5px] font-mono text-slate-500 mt-1 uppercase tracking-tight">
                ${selectedPlayer.qr_code}
              </span>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <Users className="text-primary" /> Manajemen Pemain
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">Kelola biodata, posisi, nomor punggung, dan klub pemain</p>
        </div>
        <Link
          to="/admin/players/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-primary/10"
        >
          <Plus size={16} /> Tambah Pemain Baru
        </Link>
      </div>

      <AdminListTools value={search} onChange={setSearch} count={filtered.length} total={players.length} placeholder="Cari pemain, klub, posisi..." />
      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Memuat data pemain...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xs transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 uppercase text-xs font-extrabold tracking-wider border-b border-slate-200 dark:border-slate-850">
                <tr>
                  <th className="py-4 px-6">Pemain</th>
                  <th className="py-4 px-6">Klub</th>
                  <th className="py-4 px-6">Posisi</th>
                  <th className="py-4 px-6 text-center">No. Punggung</th>
                  <th className="py-4 px-6 text-right">Rating</th>
                  <th className="py-4 px-6 text-center">QR Code</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                {filtered.length === 0 && <tr><td colSpan={12}><div className="admin-empty">Tidak ada data yang sesuai. Tambahkan data baru atau ubah pencarian.</div></td></tr>}
                {filtered.map((player) => (
                  <tr key={player.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-white truncate max-w-[180px]">{player.name}</td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-450">{player.team?.name || 'Tanpa Klub'}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-bold uppercase">
                        {player.position}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-black text-amber-500">#{player.jersey_number}</td>
                    <td className="py-4 px-6 text-right font-black text-primary">{Number(player.overall_rating).toFixed(2)}</td>

                    {/* QR Code Column */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      {player.qr_code ? (
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700/50">
                            {player.qr_code}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedPlayer(player);
                              setShowCardModal(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          >
                            <QrCode size={10} /> ID Card & QR
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleGenerateQr(player.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          <Plus size={12} /> Generate QR
                        </button>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/admin/players/${player.id}/edit`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-bold transition-all"
                      >
                        <Edit3 size={12} /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(player.id, player.name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ID Card & QR Code Preview Modal */}
      {showCardModal && selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setShowCardModal(false)}></div>

          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl z-10 transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-850 mb-6">
              <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2">
                <QrCode className="text-primary" /> Preview ID Card & QR Code
              </h3>
              <button
                onClick={() => setShowCardModal(false)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex flex-col items-center">
              {/* ID Card Preview (Formatted like CR80 Card in UI) */}
              <div
                id="id-card-print"
                className="w-full aspect-[85.6/54] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-4 border border-slate-800 rounded-2xl flex flex-row justify-between items-center relative overflow-hidden shadow-2xl select-none"
              >
                {/* Accent glows */}
                <div className="absolute -right-20 -bottom-20 w-44 h-44 bg-primary/5 rounded-full blur-2xl"></div>
                <div className="absolute -left-20 -top-20 w-44 h-44 bg-amber-500/5 rounded-full blur-2xl"></div>

                {/* Left Side: Photo & Team */}
                <div className="flex flex-col items-center w-[30%] shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden relative mb-2 shadow-inner">
                    <img
                      src={selectedPlayer.photo || '/logo.png'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[9px] font-black text-amber-500 tracking-wider text-center truncate w-full uppercase flex items-center justify-center gap-1">
                    <Shield size={8} /> {selectedPlayer.team?.name || 'Tanpa Klub'}
                  </span>
                </div>

                {/* Middle: Details */}
                <div className="flex flex-col justify-center flex-1 px-4 min-w-0">
                  <span className="text-[8px] font-extrabold text-primary tracking-widest uppercase mb-1">
                    KickRank Athlete
                  </span>
                  <h2 className="text-[16px] sm:text-[18px] font-black tracking-tight text-white leading-tight uppercase truncate">
                    {selectedPlayer.name}
                  </h2>

                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 bg-primary/20 border border-primary/30 rounded-lg text-[8px] font-bold uppercase tracking-wider text-primary">
                      {selectedPlayer.position}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      #{selectedPlayer.jersey_number}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 mt-3.5">
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Overall Rating:</span>
                    <span className="text-[14px] font-black text-amber-400">{Number(selectedPlayer.overall_rating).toFixed(2)}</span>
                  </div>
                </div>

                {/* Right Side: QR Code */}
                <div className="flex flex-col items-center justify-center w-[25%] shrink-0 pl-2 border-l border-slate-800/60">
                  <div className="bg-white p-1 rounded-xl shadow-sm">
                    <img
                      src={`https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=${encodeURIComponent(selectedPlayer.qr_code)}`}
                      alt="QR Code"
                      className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px]"
                    />
                  </div>
                  <span className="text-[7px] font-mono text-slate-500 mt-2 uppercase tracking-wider">
                    {selectedPlayer.qr_code}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-450 dark:text-slate-400 mt-4 text-center">
                Kartu didesain dengan format standar CR80 (85.6mm x 54mm) yang ideal untuk dicetak pada kartu identitas.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
              <button
                onClick={() => setShowCardModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer size={14} /> Cetak ID Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
