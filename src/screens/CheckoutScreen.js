import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { createOrder } from '../api/orders';
import PaymentMethodRow from '../components/PaymentMethodRow';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radius } from '../constants/theme';
import { formatRupiah } from '../utils/format';

// NOTE: backend-mu belum punya endpoint /api/app/payment-methods terpisah
// di daftar yang dikasih; kalau ada, ganti bagian ini jadi fetch dari situ.
// Sementara dipakai daftar statis yang umum dipakai Pakasir.
const STATIC_METHODS = [
  { id: 'qris', name: 'QRIS', fee: 0 },
  { id: 'bca_va', name: 'Transfer Bank (VA BCA/BRI/Mandiri)', fee: 0 },
  { id: 'ewallet', name: 'E-Wallet (OVO/DANA/GoPay)', fee: 0 },
];

export default function CheckoutScreen({ orderDraft, navigate, goBack }) {
  const [methods] = useState(STATIC_METHODS);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const price = orderDraft.product.price || orderDraft.product.amount || 0;
  const fee = selectedMethod ? selectedMethod.fee || 0 : 0;
  const total = Number(price) + Number(fee);

  const handlePay = async () => {
    if (!selectedMethod) return Alert.alert('Oops', 'Pilih metode pembayaran dulu');
    setSubmitting(true);
    try {
      const result = await createOrder({
        gameId: orderDraft.game.id || orderDraft.game._id,
        productId: orderDraft.product.id || orderDraft.product._id,
        playerId: orderDraft.playerId,
        zoneId: orderDraft.zoneId,
        whatsapp: orderDraft.whatsapp,
      });

      const invoiceId =
        result.invoice_id || result.invoiceId || result?.data?.invoice_id || result?.data?.id;
      if (!invoiceId) throw new Error('Backend tidak mengembalikan invoice_id');

      navigate('Status', {
        order: { ...orderDraft, selectedMethod, total, invoiceId },
      });
    } catch (e) {
      Alert.alert('Gagal membuat pesanan', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.gameName}>{orderDraft.game.name || orderDraft.game.title}</Text>
          <Row label="ID Player" value={`${orderDraft.playerId}${orderDraft.zoneId ? ` (${orderDraft.zoneId})` : ''}`} />
          <Row label="Produk" value={orderDraft.product.name || orderDraft.product.label} />
          <Row label="WhatsApp" value={orderDraft.whatsapp} />
        </View>

        <Text style={styles.label}>Metode Pembayaran</Text>
        {methods.map((m) => (
          <PaymentMethodRow
            key={m.id}
            method={m}
            selected={selectedMethod?.id === m.id}
            onPress={() => setSelectedMethod(m)}
          />
        ))}

        <View style={styles.card}>
          <Row label="Harga Produk" value={formatRupiah(price)} />
          <Row label="Biaya Admin" value={formatRupiah(fee)} />
          <View style={styles.divider} />
          <Row label="Total Bayar" value={formatRupiah(total)} bold />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <PrimaryButton title="Bayar Sekarang" onPress={handlePay} loading={submitting} />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, bold }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.rowBoldLabel]}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.rowBoldValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bgApp },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { paddingHorizontal: spacing.sm, paddingVertical: 4 },
  backText: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  title: { fontSize: 17, fontWeight: '700', color: colors.textDark, marginLeft: spacing.sm },
  content: { padding: spacing.lg, paddingBottom: 100 },
  card: { backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.lg, marginBottom: spacing.xl },
  gameName: { fontSize: 16, fontWeight: '800', color: colors.textDark, marginBottom: spacing.sm },
  label: { fontSize: 14, fontWeight: '700', color: colors.textDark, marginBottom: spacing.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  rowLabel: { fontSize: 13, color: colors.textMuted },
  rowValue: { fontSize: 13, fontWeight: '600', color: colors.textDark },
  rowBoldLabel: { fontSize: 15, fontWeight: '800', color: colors.textDark },
  rowBoldValue: { fontSize: 18, fontWeight: '800', color: colors.primary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 8 },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
