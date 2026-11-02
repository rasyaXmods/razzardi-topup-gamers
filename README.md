# RAZZARDI STORE

Website top-up game berbasis Next.js untuk dikelola dari Android tanpa root.

## Status integrasi
- Database PostgreSQL + Prisma: implementasi tersedia.
- Midtrans Snap: pembuatan transaksi dan verifikasi signature webhook tersedia; wajib diuji di Sandbox.
- VIP Reseller: belum dapat diaktifkan karena dokumentasi API resmi (base URL, autentikasi, endpoint, payload, dan status response) belum terverifikasi. Adapter sengaja fail-closed agar tidak mengirim pesanan ke endpoint tebakan.
- Produk tidak disediakan secara fiktif. Tambahkan hanya produk dan harga yang sudah dikonfirmasi dari supplier.

## Persiapan dari Android
1. Buat repository GitHub dan unggah seluruh isi folder ZIP ini.
2. Buat database PostgreSQL dari penyedia yang mendukung koneksi Vercel.
3. Buat project Vercel, impor repository GitHub.
4. Tambahkan Environment Variables berdasarkan `.env.example`.
5. Jalankan `npx prisma db push` dari terminal yang terhubung ke project, lalu deploy.
6. Atur Midtrans webhook URL menjadi `https://DOMAIN-ANDA/api/midtrans/webhook`.
7. Uji transaksi menggunakan Midtrans Sandbox sebelum mengaktifkan Production.

## Environment
- `DATABASE_URL`: URL PostgreSQL.
- `MIDTRANS_SERVER_KEY`: Server Key (rahasia).
- `MIDTRANS_CLIENT_KEY`: Client Key (untuk integrasi Snap JS bila diperlukan).
- `MIDTRANS_IS_PRODUCTION`: `false` saat Sandbox, `true` setelah tes dan persetujuan.
- `APP_URL`: URL deployment.
- `ADMIN_API_TOKEN`: token acak panjang untuk endpoint admin.
- `VIP_RESELLER_*`: isi hanya berdasarkan dokumentasi resmi VIP Reseller.

Jangan pernah menaruh Server Key, API Key supplier, atau Admin Token pada variabel `NEXT_PUBLIC_*`, kode frontend, atau repository GitHub.

## Menambahkan produk
Endpoint admin dilindungi bearer token:
`POST /api/admin/products`
Header: `Authorization: Bearer <ADMIN_API_TOKEN>`
Body JSON:
`{"code":"KODE-RESMI","game":"Nama Game","name":"Nama Produk","price":10000,"active":false}`

Produk dibuat nonaktif secara default. Aktifkan hanya setelah kode produk, harga, dan ketersediaan diverifikasi dari supplier. Untuk mengubah status, kirim ulang data dengan `active:true`.

## Alur transaksi
1. Pelanggan memilih produk aktif dan mengisi User ID.
2. Backend membaca harga dari database, bukan dari browser.
3. Backend membuat order dan meminta Snap token ke Midtrans.
4. Midtrans mengirim notifikasi ke webhook; signature diverifikasi.
5. Order menjadi PAID setelah status pembayaran valid.
6. Pemenuhan supplier belum otomatis sampai kontrak API VIP Reseller resmi dipetakan dan diuji.

## Sebelum produksi
- Pasang rate limiting/WAF untuk endpoint checkout.
- Tambahkan halaman kebijakan privasi, syarat layanan, refund, dan kontak support.
- Tambahkan verifikasi User ID sesuai aturan game.
- Tambahkan idempotency/locking dan rekonsiliasi notifikasi pembayaran.
- Lengkapi integrasi supplier resmi, retry aman, pengecekan status, dan rekonsiliasi.
- Lakukan pengujian keamanan dan transaksi end-to-end.
