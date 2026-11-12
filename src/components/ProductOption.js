import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../constants/theme';
import { formatRupiah } from '../utils/format';

export default function ProductOption({ product, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.name, selected && styles.selectedText]} numberOfLines={1}>
        {product.name || product.label}
      </Text>
      <Text style={[styles.price, selected && styles.selectedText]}>
        {formatRupiah(product.price || product.amount)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
  },
  cardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  name: { fontSize: 13, fontWeight: '600', color: colors.textDark },
  price: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  selectedText: { color: colors.primary, fontWeight: '700' },
});
