# SmartFootball Frontend

React 19 + Vite untuk halaman publik dan portal admin SmartFootball. Seluruh data kompetisi diambil dari Laravel API; tidak ada akun Google simulasi atau data kompetisi bawaan.

## Menjalankan

```bash
npm install
npm run dev
```

Buat `.env` jika alamat API berbeda dari `http://127.0.0.1:8000/api`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Halaman

Pengunjung dapat membuka `/`, `/teams`, `/players`, `/fixtures`, `/league-table`, dan `/leaderboard` tanpa login. Detail tim dan pemain juga publik. `/login` dan `/register` menyediakan autentikasi. `/admin/*` memerlukan akun dengan `is_admin=true`; akses diperiksa ulang melalui `/api/me`, dan backend juga melindungi endpoint admin.

## Pemeriksaan

```bash
npm run build
npm run lint
```

Build berhasil pada pemeriksaan terakhir. Lint masih memiliki temuan dari pola `useEffect` dan variabel yang belum dipakai pada sejumlah halaman.
