export function formatRupiah(num) {
  const n = Number(num) || 0;
  return 'Rp' + n.toLocaleString('id-ID');
}
