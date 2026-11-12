import { apiRequest, unwrapList } from './client';

/** GET /api/app/games — list semua game aktif */
export async function fetchGames() {
  const data = await apiRequest('/api/app/games');
  return unwrapList(data);
}

/**
 * GET /api/app/products?game_id=xxx — list produk sebuah game.
 * Kosongkan gameId untuk ambil "Produk Lainnya".
 */
export async function fetchProducts(gameId) {
  const qs = gameId ? `?game_id=${encodeURIComponent(gameId)}` : '';
  const data = await apiRequest(`/api/app/products${qs}`);
  return unwrapList(data);
}

/** GET /api/app/flash-sales — list ZySale yang lagi aktif */
export async function fetchFlashSales() {
  const data = await apiRequest('/api/app/flash-sales');
  return unwrapList(data);
}

/** GET /api/app/banners — list banner beranda */
export async function fetchBanners() {
  const data = await apiRequest('/api/app/banners');
  return unwrapList(data);
}

/** GET /api/app/notifications — list notifikasi terbaru */
export async function fetchNotifications() {
  const data = await apiRequest('/api/app/notifications');
  return unwrapList(data);
}
