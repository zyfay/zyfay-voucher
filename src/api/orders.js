import { apiRequest } from './client';

/**
 * POST /api/app/orders/create — buat pesanan + transaksi pembayaran Pakasir.
 * payload disesuaikan dengan field yang backend minta; sesuaikan kalau beda.
 */
export async function createOrder({ gameId, productId, playerId, zoneId, whatsapp, email }) {
  return apiRequest('/api/app/orders/create', {
    method: 'POST',
    body: {
      game_id: gameId,
      product_id: productId,
      player_id: playerId,
      zone_id: zoneId,
      whatsapp,
      email,
    },
  });
}

/**
 * GET /api/app/orders/check?id=xxx — cek status satu pesanan,
 * atau ?email=xxx untuk ambil riwayat transaksi berdasarkan email.
 */
export async function checkOrderStatus(invoiceId) {
  return apiRequest(`/api/app/orders/check?id=${encodeURIComponent(invoiceId)}`);
}

export async function fetchOrderHistory(email) {
  return apiRequest(`/api/app/orders/check?email=${encodeURIComponent(email)}`);
}

/** POST /api/app/orders/cancel — batalkan pesanan yang masih pending */
export async function cancelOrder(invoiceId) {
  return apiRequest('/api/app/orders/cancel', {
    method: 'POST',
    body: { id: invoiceId },
  });
}

/** POST /api/app/cekid-game — cek ID/nickname game sebelum order */
export async function checkGameId({ gameId, playerId, zoneId }) {
  return apiRequest('/api/app/cekid-game', {
    method: 'POST',
    body: { game_id: gameId, player_id: playerId, zone_id: zoneId },
  });
}
