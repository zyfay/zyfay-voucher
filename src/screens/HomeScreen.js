import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { fetchGames } from '../api/catalog';
import GameCard from '../components/GameCard';
import SectionHeader from '../components/SectionHeader';
import { colors, spacing, radius } from '../constants/theme';

export default function HomeScreen({ navigate }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const list = await fetchGames();
      setGames(list);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.brand}>Zyfay Voucher</Text>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.mutedText}>Memuat daftar game...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.errorTitle}>Gagal memuat game</Text>
          <Text style={styles.mutedText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={load}>
            <Text style={styles.retryText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item, idx) => String(item.id || item._id || idx)}
          numColumns={3}
          columnWrapperStyle={{ gap: spacing.md }}
          contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}
          ListHeaderComponent={
            <SectionHeader title="Top Up Games" />
          }
          renderItem={({ item }) => (
            <View style={{ flex: 1 / 3 }}>
              <GameCard game={item} onPress={() => navigate('Order', { game: item })} />
            </View>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.bgApp },
  header: {
    backgroundColor: colors.headerGradientStart,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  brand: { fontSize: 22, fontWeight: '800', color: '#F7B731' },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  mutedText: { color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
  errorTitle: { fontSize: 16, fontWeight: '700', color: colors.danger },
  retryBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius.sm,
  },
  retryText: { color: colors.white, fontWeight: '700' },
});
