# KickRank Frontend

Frontend web publik dan admin untuk project KickRank, dibangun dengan React + Vite.

## Fitur Utama

- Halaman publik daftar tim, pemain, jadwal, klasemen liga, dan leaderboard.
- Halaman detail tim dan pemain.
- Area admin untuk kelola tim, pemain, fixture, dan statistik pemain.
- Routing terpisah antara halaman publik dan admin.
- Konsumsi data dari backend Laravel melalui API.

## Teknologi

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS

## Menjalankan Project

```bash
npm install
npm run dev
```

## Struktur Singkat

- `src/pages/teams` untuk halaman publik tim.
- `src/pages/players` untuk halaman publik pemain.
- `src/pages/fixtures` untuk jadwal dan hasil pertandingan.
- `src/pages/league-table` untuk klasemen liga.
- `src/pages/admin` untuk halaman pengelolaan data.

## Catatan

File seperti `node_modules`, hasil build, dan file environment tidak perlu di-push ke GitHub karena sudah diabaikan melalui `.gitignore`.
