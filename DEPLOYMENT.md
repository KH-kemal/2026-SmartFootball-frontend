# Publikasi KBMLeague ke GitHub Pages

Domain: **https://league.karyabintangmandiri.com**.

## 1. Apa yang sudah disiapkan

- `main` menyimpan source React/Vite.
- Workflow `Build frontend to gh-pages` membangun website dan menerbitkan hasilnya ke branch `gh-pages` pada setiap push `main`, atau saat dijalankan manual.
- `public/CNAME` dibawa ke hasil build agar domain tidak hilang pada deployment berikutnya.
- Asset memakai path root `/` karena website menggunakan custom domain.
- `404.html` berisi entry point React supaya URL seperti `/teams/1` atau `/admin/dashboard` bisa dibuka langsung.
- `.nojekyll` membuat file build dilayani sebagai website statis.
- Produksi tanpa URL API tidak menghubungi localhost pengunjung.

GitHub Pages hanya menyajikan frontend. Laravel, database, dan gambar upload harus berada pada hosting backend terpisah. Saat backend belum tersedia, tampilan frontend dapat dipublikasikan, tetapi login, registrasi, screening, dan data kompetisi belum berfungsi.

## 2. Aktifkan build dan pilih branch

1. Buka repository `KH-kemal/2026-kbmleague-frontend`.
2. Buka **Actions** dan pastikan workflow **Build frontend to gh-pages** berhasil. Jika belum berjalan, pilih **Run workflow** pada branch `main`.
3. Jika publish ditolak karena izin token, buka **Settings → Actions → General → Workflow permissions**, pilih **Read and write permissions**, lalu jalankan ulang workflow. Kebijakan organisasi juga dapat membatasi izin ini.
4. Setelah branch `gh-pages` terbentuk, buka **Settings → Pages**.
5. Pilih **Source: Deploy from a branch**.
6. Pilih **Branch: gh-pages**, **Folder: /(root)**, lalu **Save**.
7. Masukkan **Custom domain: league.karyabintangmandiri.com**, lalu **Save**.

Jangan memilih `main` sebagai branch website: branch tersebut berisi source yang membutuhkan build. File CNAME saja tidak menggantikan pengaturan Custom domain pada Pages.

## 3. Atur DNS domain

Pada panel penyedia DNS untuk `karyabintangmandiri.com`, gunakan:

| Field | Nilai |
| --- | --- |
| Type | CNAME |
| Name / Host | league |
| Target / Value | KH-kemal.github.io |
| TTL | Default penyedia |

Target tidak memakai `https://`, nama repository, atau path. Jika ada record lain pada host `league` yang bertentangan, sesuaikan record host tersebut. Record domain utama dan subdomain lain tidak perlu diubah.

Jika DNS menggunakan proxy, gunakan mode DNS-only saat verifikasi awal GitHub Pages. Periksa hasil DNS setelah penyimpanan:

```powershell
Resolve-DnsName league.karyabintangmandiri.com -Type CNAME
```

Hasil yang diharapkan mengarah ke `KH-kemal.github.io`. Propagasi DNS dan tersedianya opsi HTTPS dapat memerlukan hingga 24 jam.

## 4. Aktifkan HTTPS

1. Tunggu pemeriksaan DNS pada **Settings → Pages** berhasil.
2. Tunggu sertifikat tersedia, kemudian aktifkan **Enforce HTTPS**.
3. Buka `https://league.karyabintangmandiri.com`.

Jika gagal, periksa deployment di Actions, record CNAME, record host yang bertentangan, dan status sertifikat. Menyimpan Custom domain tidak otomatis mengubah DNS pada penyedia domain.

## 5. Hubungkan backend saat sudah di-hosting

1. Deploy Laravel dan database ke layanan yang mendukung PHP/Laravel.
2. Pastikan API memiliki URL HTTPS publik dan route `/api` dapat diakses.
3. Atur `APP_URL` backend ke alamat backend sebenarnya. Jalankan migrasi secara aman dan `php artisan storage:link`; pastikan URL logo/foto memakai HTTPS.
4. Atur CORS backend untuk mengizinkan origin `https://league.karyabintangmandiri.com`, metode API, serta header `Authorization` dan `Content-Type`.
5. Di repository frontend, buka **Settings → Secrets and variables → Actions → Variables**.
6. Tambah repository variable **VITE_API_BASE_URL** dengan URL API sebenarnya, termasuk `/api`. Contoh ilustratif: `https://api.karyabintangmandiri.com/api`; alamat tersebut belum diasumsikan tersedia.
7. Jalankan ulang workflow **Build frontend to gh-pages**. Variabel Vite masuk saat build, sehingga perubahan nilai memerlukan build baru.
8. Uji data publik, registrasi/login, akses admin, upload gambar, dan QR melalui HTTPS.

Jangan memasukkan password database, `APP_KEY`, atau token rahasia ke variabel `VITE_*`: nilainya masuk JavaScript publik.

## 6. Pemeriksaan deployment

- Beranda menampilkan KBMLeague dan asset CSS/JS berhasil dimuat.
- Custom domain tetap tersimpan sesudah deployment baru.
- Buka `/teams` secara langsung dan refresh halaman.
- Uji navigasi mobile dan mode gelap.
- Setelah backend tersedia, pastikan tidak ada request menuju `127.0.0.1` atau `localhost`.
- Uji login admin dan data dari backend produksi, bukan database Laragon lokal.

Fallback GitHub Pages tetap menggunakan status HTTP 404 untuk URL langsung yang bukan file fisik, walaupun React merender halaman. Untuk respons HTTP 200 pada semua route dan kebutuhan SEO yang lebih kuat, gunakan hosting yang mendukung rewrite SPA.

## Referensi

- [Publishing source GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Custom domain GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages publishing action](https://github.com/peaceiris/actions-gh-pages)
