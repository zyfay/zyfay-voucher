import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { fetchProducts } from '../api/catalog';
import ProductOption from '../components/ProductOption';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing, radius } from '../constants/theme';

export default function OrderScreen({ game, navigate, goBack }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [playerId, setPlayerId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchProducts(game.id || game._id);
        setProducts(list);
      } catch (e) {
        Alert.alert('Gagal memuat produk', e.message);
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, [game]);

  const handleOrderNow = () => {
    if (!playerId.trim()) return Alert.alert('Oops', 'ID Player wajib diisi');
    if (!selectedProduct) return Alert.alert('Oops', 'Pilih nominal dulu ya');
    if (!whatsapp.trim() || whatsapp.trim().length < 9)
      return Alert.alert('Oops', 'Nomor WhatsApp tidak valid');

    navigate('Checkout', {
      orderDraft: {
        game,
        product: selectedProduct,
        playerId: playerId.trim(),
        zoneId: zoneId.trim(),
        whatsapp: whatsapp.trim(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{game.name || game.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>ID Player</Text>
        <TextInput style={styles.input} placeholder="Masukkan ID Player" value={playerId} onChangeText={setPlayerId} />

        <Text style={styles.label}>Zona (opsional)</Text>
        <TextInput style={styles.input} placeholder="Masukkan Zona ID" value={zoneId} onChangeText={setZoneId} />

        <Text style={styles.label}>Pilih Nominal</Text>
        {loadingProducts ? (
          <ActivityIndicator color={colors.primary} />
        ) : products.length === 0 ? (
          <Text style={styles.mutedText}>Tidak ada produk tersedia</Text>
        ) : (
          <View style={styles.productGrid}>
            {products.map((p, idx) => {
              const key = String(p.id || p._id || idx);
              const isSelected =
                selectedProduct && String(selectedProduct.id || selectedProduct._id) === key;
              return (
                <ProductOption key={key} product={p} selected={isSelected} onPress={() => setSelectedProduct(p)} />
              );
            })}
          </View>
        )}

        <Text style={styles.label}>Nomor WhatsApp</Text>
        <TextInput
          style={styles.input}
          placeholder="08xxxxxxxxxx"
          value={whatsapp}
          onChangeText={setWhatsapp}
          keyboardType="phone-pad"
        />
        <Text style={styles.hint}>Dipakai untuk kirim notifikasi status transaksi</Text>
      </ScrollView>

      <View style={styles.bottomBar}>
        <PrimaryButton title="Order Now" onPress={handleOrderNow} />
      </View>
    </SafeAreaView>
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
  title: { fontSize: 17, fontWeight: '700', color: colors.textDark, marginLeft: spacing.sm, flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 100 },
  label: { fontSize: 14, fontWeight: '700', color: colors.textDark, marginBottom: spacing.sm, marginTop: spacing.lg },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textDark,
  },
  hint: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  mutedText: { fontSize: 13, color: colors.textMuted },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
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
