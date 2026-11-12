// Konfigurasi dasar aplikasi.
// Base URL backend (terpisah dari app ini).
export const BASE_URL = 'https://zyfay-official.vercel.app';

// API key dikirim lewat header 'x-api-key' di setiap request.
// ASUMSI: sesuaikan nama header ini (mis. jadi 'Authorization: Bearer ...')
// kalau backend lo pakai skema yang beda.
export const API_KEY = 'zyfay_d1de5a10be1989ef31b69d29b89601ac9d2961757576358e';

// Interval polling untuk cek status pesanan & chat (ms)
export const ORDER_POLL_INTERVAL = 5000;
export const CHAT_POLL_INTERVAL = 4000;
