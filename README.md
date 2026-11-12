# Zyfay Voucher — Top-Up Game App (Expo)

Front-end React Native (Expo) buat aplikasi top-up game, terpisah dari backend.

## Struktur Project

```
zyfay-topup-app/
├─ App.js                     # entry point
├─ app.json                   # config Expo
├─ package.json
├─ babel.config.js
└─ src/
   ├─ constants/
   │  ├─ config.js            # BASE_URL, API_KEY, interval polling
   │  └─ theme.js              # warna, spacing, radius
   ├─ api/
   │  ├─ client.js             # fetch wrapper + header x-api-key
   │  ├─ catalog.js            # games, products, flash-sales, banners, notifications
   │  ├─ orders.js              # create/check/cancel order, cek id game
   │  └─ chat.js                # live chat (start/send/messages/upload)
   ├─ navigation/
   │  └─ AppNavigator.js        # switch antar screen (tanpa react-navigation)
   ├─ screens/
   │  ├─ HomeScreen.js
   │  ├─ OrderScreen.js
   │  ├─ CheckoutScreen.js
   │  └─ StatusScreen.js
   ├─ components/
   │  ├─ GameCard.js
   │  ├─ ProductOption.js
   │  ├─ PaymentMethodRow.js
   │  ├─ PrimaryButton.js
   │  └─ SectionHeader.js
   └─ utils/
      └─ format.js              # formatRupiah
```

## Cara jalankan

```bash
npm install
npx expo start
```
Scan QR code pakai **Expo Go**.

## Konfigurasi

Di `src/constants/config.js`:
```js
export const BASE_URL = 'https://zyfay-official.vercel.app';
export const API_KEY = 'zyfay_d1de5a10be1989ef31b69d29b89601ac9d2961757576358e';
```

⚠️ **Catatan keamanan**: API key ini saat ini ditanam langsung di kode (hardcoded).
Karena app React Native di-bundle dan bisa dibongkar (reverse-engineered), siapapun
yang punya file `.apk`/build-nya bisa menemukan key ini. Untuk produksi, sebaiknya:
- Taruh logic yang butuh API key di backend-mu sendiri (app cuma manggil backend-mu,
  backend yang manggil service lain pakai key), atau
- Pakai `expo-constants` + `.env` minimal supaya key nggak ke-commit ke Git (`.gitignore`
  udah termasuk `.env`), meski secara teknis tetap bisa diekstrak dari build.

## Endpoint yang dipakai

Sumber: daftar endpoint dari dokumentasi backend-mu.

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/app/games` | List semua game aktif |
| GET | `/api/app/products?game_id=xxx` | List produk sebuah game (kosongkan `game_id` untuk "Produk Lainnya") |
| GET | `/api/app/flash-sales` | List ZySale yang lagi aktif |
| GET | `/api/app/banners` | List banner beranda |
| GET | `/api/app/notifications` | List notifikasi terbaru |
| POST | `/api/app/orders/create` | Buat pesanan + transaksi pembayaran Pakasir |
| GET | `/api/app/orders/check?id=xxx` | Cek status pesanan (atau `?email=xxx` buat riwayat) |
| POST | `/api/app/orders/cancel` | Batalkan pesanan pending |
| POST | `/api/app/cekid-game` | Cek ID/nickname game |
| POST | `/api/app/chat/start` | Mulai sesi live chat |
| POST | `/api/app/chat/send` | Kirim pesan chat (teks/gambar/VN) |
| GET | `/api/app/chat/messages?session_id=xxx` | Ambil pesan chat (dipakai untuk polling) |
| POST | `/api/app/chat/upload` | Upload gambar/voice note buat chat |

Setiap request otomatis kirim header `x-api-key: <API_KEY>` lewat `src/api/client.js`.
**Asumsi**: nama header `x-api-key` — kalau backend-mu pakai skema lain (misalnya
`Authorization: Bearer <key>`), tinggal ubah satu baris di `src/api/client.js`.

### Belum dipakai di screen (tapi fungsinya udah disiapkan di `src/api/`)
- `fetchFlashSales`, `fetchBanners`, `fetchNotifications` (catalog.js) — belum dipasang
  di `HomeScreen`, tinggal panggil kalau mau tampilkan banner/promo/notifikasi.
- Semua fungsi di `chat.js` — live chat belum ada screen-nya; function-nya siap dipakai
  kalau mau bikin `ChatScreen` baru.
- `fetchOrderHistory`, `cancelOrder`, `checkGameId` (orders.js) — siap dipakai untuk
  fitur riwayat transaksi, batalkan pesanan, dan validasi ID sebelum order.

### Metode pembayaran
Daftar endpoint yang dikasih belum ada `/api/app/payment-methods`, jadi di
`CheckoutScreen` sementara pakai daftar statis (QRIS, Transfer Bank, E-Wallet).
Kalau backend-mu punya endpoint khusus untuk ini, ganti bagian `STATIC_METHODS`
di `src/screens/CheckoutScreen.js` dengan fetch ke endpoint tersebut.

## Push ke GitHub

```bash
cd zyfay-topup-app
git init
git add .
git commit -m "Initial commit: Zyfay top-up app"
git branch -M main
git remote add origin <url-repo-lo>
git push -u origin main
```
`.gitignore` udah nyiapin `node_modules/`, `.expo/`, `.env`, dll biar nggak ikut ke-commit.
