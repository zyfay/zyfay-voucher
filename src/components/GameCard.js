import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { colors, radius } from '../constants/theme';

export default function GameCard({ game, onPress }) {
  const name = game.name || game.title || 'Game';
  const subtitle = game.currency_name || game.publisher || '';
  const badge = game.badge || game.label;

  return (
    <TouchableOpacity style={styles.wrap} activeOpacity={0.75} onPress={onPress}>
      <View style={styles.imageBox}>
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
        {game.icon_url || game.image ? (
          <Image source={{ uri: game.icon_url || game.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <Text style={styles.letter}>{name.charAt(0).toUpperCase()}</Text>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      {subtitle ? <Text style={styles.sub} numberOfLines={1}>{subtitle}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  imageBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  letter: { fontSize: 32, fontWeight: '800', color: colors.white },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    zIndex: 2,
  },
  badgeText: { fontSize: 9, fontWeight: '800', color: colors.accentText },
  name: { fontSize: 13, fontWeight: '700', color: colors.textDark, marginTop: 8 },
  sub: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
});
