import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, QrCode, ShieldCheck, ShieldAlert, User, Trophy, Calendar, Minimize2, RotateCcw } from 'lucide-react';
import api from '../../../services/api';

export default function AdminScreening() {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(true);
  const [cameraPermission, setCameraPermission] = useState(true);
  const qrCodeInstance = useRef(null);


  async function startScanner() {
    setError(null);
    setPlayer(null);

    // Memberikan delay kecil agar DOM ter-render terlebih dahulu
    setTimeout(async () => {
      const element = document.getElementById('reader');
      if (!element) return;

      try {
        const html5QrCode = new Html5Qrcode('reader');
        qrCodeInstance.current = html5QrCode;

        const qrCodeSuccessCallback = async (decodedText) => {
          // Menghentikan kamera setelah memindai dengan sukses
          await stopScanner();
          setScanning(false);
          await handleScanSuccess(decodedText);
        };

        const config = {
          fps: 15,
          qrbox: (width, height) => {
            const size = Math.min(width, height) * 0.75;
            return { width: size, height: size };
          }
        };

        await html5QrCode.start(
          { facingMode: 'environment' },
          config,
          qrCodeSuccessCallback
        );
        setCameraPermission(true);
      } catch (err) {
        console.error('Gagal mengakses kamera:', err);
        setError('Gagal mengakses kamera. Pastikan Anda mengizinkan akses kamera di browser Anda.');
        setCameraPermission(false);
        setScanning(false);
      }
    }, 300);
  }

  async function stopScanner() {
    if (qrCodeInstance.current && qrCodeInstance.current.isScanning) {
      try {
        await qrCodeInstance.current.stop();
      } catch (err) {
        console.error('Gagal menghentikan scanner:', err);
      }
      qrCodeInstance.current = null;
    }
  }

  useEffect(() => {
    if (scanning) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [scanning]);

  const handleScanSuccess = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/players/by-qr/${token}`);
      setPlayer(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Kode QR tidak valid atau data pemain tidak ditemukan.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlayer(null);
    setError(null);
    setScanning(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <Camera className="text-primary" /> Screening Pemain
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Pindai QR Code pada ID Card pemain untuk memverifikasi keaslian dan menampilkan data profil
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Scanner Area */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl flex flex-col items-center">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 self-start">
            <QrCode size={18} className="text-primary" /> Kamera Scanner
          </h2>

          <div className="w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
            {scanning && cameraPermission ? (
              <div id="reader" className="w-full h-full object-cover"></div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                <Camera size={48} className="text-slate-700 dark:text-slate-600 mb-3 animate-pulse" />
                {error && !player ? (
                  <p className="text-sm font-semibold text-red-500 dark:text-red-400">{error}</p>
                ) : (
                  <p className="text-sm font-semibold">Scanner dinonaktifkan</p>
                )}
                {!scanning && (
                  <button
                    onClick={handleReset}
                    className="mt-4 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Mulai Scan Baru
                  </button>
                )}
              </div>
            )}

            {scanning && (
              <div className="absolute inset-0 pointer-events-none border-2 border-primary/40 rounded-2xl m-8 flex items-center justify-center">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                <div className="w-full h-0.5 bg-primary/85 absolute top-1/2 left-0 animate-bounce"></div>
              </div>
            )}
          </div>

          <div className="mt-4 w-full flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Status: {scanning ? <span className="text-emerald-500 animate-pulse">Memindai...</span> : <span>Siaga</span>}</span>
            {scanning && (
              <button
                onClick={() => setScanning(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
              >
                Matikan Kamera
              </button>
            )}
          </div>
        </div>

        {/* Screening Result Details */}
        <div className="flex flex-col gap-6">
          {loading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-slate-700 dark:text-slate-300">Mengambil data pemain...</p>
            </div>
          )}

          {!loading && !player && !error && (
            <div className="bg-slate-100 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-850 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] text-slate-550">
              <Camera size={40} className="text-slate-350 dark:text-slate-700 mb-4" />
              <p className="font-bold text-sm">Arahkan kamera ke QR Code pemain untuk memverifikasi data.</p>
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
              <ShieldAlert size={48} className="text-red-500 mb-4 animate-bounce" />
              <h3 className="text-lg font-black text-red-500 mb-2">Screening Gagal</h3>
              <p className="text-sm font-semibold text-red-400 max-w-xs mb-6">{error}</p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={14} /> Scan Ulang
              </button>
            </div>
          )}

          {!loading && player && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-xl animate-fade-in">
              <div className="bg-emerald-500/10 dark:bg-emerald-500/5 px-6 py-4 border-b border-emerald-500/20 dark:border-emerald-500/10 flex items-center justify-between">
                <span className="text-emerald-500 font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={18} /> Cocok (Verifikasi Sukses)
                </span>
                <span className="text-slate-400 text-xs">ID Pemain: #{player.id}</span>
              </div>

              <div className="p-6">
                {/* Main profile row */}
                <div className="flex items-center gap-5 mb-6">
                  {player.photo ? (
                    <img
                      src={player.photo}
                      alt={player.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 p-1"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-black text-2xl">
                      #{player.jersey_number}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="px-2 py-0.5 bg-primary/10 border border-primary/25 text-primary text-[10px] font-extrabold rounded-lg uppercase tracking-wider">
                        {player.position}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">No. {player.jersey_number}</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{player.name}</h3>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      Klub: <span className="text-primary font-bold">{player.team?.name || 'Tanpa Klub'}</span>
                    </p>
                  </div>
                </div>

                {/* Rating box */}
                <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-4 flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Rating Pemain</span>
                    <span className="text-xs text-slate-550 dark:text-slate-450">Kategori performa keseluruhan</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-primary">{Number(player.overall_rating).toFixed(2)}</span>
                    <span className="text-xs font-bold text-slate-400">/10.0</span>
                  </div>
                </div>

                {/* Detailed metadata */}
                <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Tanggal Lahir</span>
                    <span className="text-slate-800 dark:text-white text-sm font-bold flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-405" /> {formatDate(player.birth_date)}
                    </span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block mb-1">Fisik</span>
                    <span className="text-slate-800 dark:text-white text-sm font-bold flex items-center gap-1">
                      <Minimize2 size={14} className="text-slate-405" /> {player.height || '-'} cm / {player.weight || '-'} kg
                    </span>
                  </div>
                </div>

                {/* Reset or Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Scan Pemain Lain
                  </button>
                  <a
                    href={`/admin/players/${player.id}/edit`}
                    className="flex-1 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <User size={14} className="text-slate-400" /> Edit Detail Pemain
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
