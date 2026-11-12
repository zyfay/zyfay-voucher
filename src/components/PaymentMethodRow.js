import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../constants/theme';
import { formatRupiah } from '../utils/format';

export default function PaymentMethodRow({ method, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.row, selected && styles.rowSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.radioOuter}>
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{method.name || method.label}</Text>
        {method.fee ? (
          <Text style={styles.fee}>Biaya admin: {formatRupiah(method.fee)}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 10,
  },
  rowSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  name: { fontSize: 14, fontWeight: '600', color: colors.textDark },
  fee: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
