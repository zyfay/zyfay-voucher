import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { checkOrderStatus } from '../api/orders';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radius } from '../constants/theme';
import { formatRupiah } from '../utils/format';
import { ORDER_POLL_INTERVAL } from '../constants/config';

export default function StatusScreen({ order, goHome }) {
  const [status, setStatus] = useState('Menunggu');
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const check = async () => {
      try {
        const data = await checkOrderStatus(order.invoiceId);
        const newStatus = data.status || data?.data?.status || 'Menunggu';
        setStatus(newStatus);
        setError(null);

        const lower = String(newStatus).toLowerCase();
        if (['sukses', 'success', 'gagal', 'failed'].includes(lower)) {
          setChecking(false);
          clearInterval(intervalRef.current);
        }
      } catch (e) {
        setError(e.message);
      }
    };

    check();
    intervalRef.current = setInterval(check, ORDER_POLL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [order.invoiceId]);

  const lower = String(status).toLowerCase();
  const isSuccess = lower === 'sukses' || lower === 'success';
  const isFailed = lower === 'gagal' || lower === 'failed';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.subHeader}>
        <Text style={styles.title}>Status Transaksi</Text>
      </View>

      <View style={styles.container}>
        <View style={[styles.iconCircle, isSuccess && styles.iconSuccess, isFailed && styles.iconFailed]}>
          <Text style={styles.iconText}>{isSuccess ? '✓' : isFailed ? '✕' : '⏳'}</Text>
        </View>

        <Text style={styles.statusTitle}>
          {isSuccess ? 'Pembayaran Berhasil!' : isFailed ? 'Pembayaran Gagal' : 'Menunggu Pembayaran...'}
        </Text>
        <Text style={styles.invoice}>Invoice: {order.invoiceId}</Text>

        {checking && !isSuccess && !isFailed && (
          <View style={styles.pollingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.pollingText}>Mengecek status setiap beberapa detik...</Text>
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.card}>
          <Row label="Game" value={order.game.name || order.game.title} />
          <Row label="Produk" value={order.product.name || order.product.label} />
          <Row label="Total" value={formatRupiah(order.total)} />
        </View>

        {(isSuccess || isFailed) && <PrimaryButton title="Kembali ke Beranda" onPress={goHome} style={{ width: '100%' }} />}
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bgApp },
  subHeader: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  title: { fontSize: 17, fontWeight: '700', color: colors.textDark },
  container: { flex: 1, padding: spacing.xxl, alignItems: 'center' },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFF3CD',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: spacing.xl,
  },
  iconSuccess: { backgroundColor: colors.successBg },
  iconFailed: { backgroundColor: colors.dangerBg },
  iconText: { fontSize: 40 },
  statusTitle: { fontSize: 18, fontWeight: '800', color: colors.textDark, textAlign: 'center' },
  invoice: { fontSize: 13, color: colors.textMuted, marginTop: 6 },
  pollingBox: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  pollingText: { marginLeft: 10, color: colors.textMuted, fontSize: 13 },
  errorText: { color: colors.danger, fontSize: 12, marginTop: spacing.sm, textAlign: 'center' },
  card: { backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.xl, width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  rowLabel: { fontSize: 13, color: colors.textMuted },
  rowValue: { fontSize: 13, fontWeight: '600', color: colors.textDark },
});
