import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReportItem } from '../types/report';
import { colors, space, type } from '../theme';

type Props = {
  item: ReportItem;
  onPress: () => void;
};

export function ItemCard({ item, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <Text style={styles.headline}>{item.headline}</Text>
      <Text style={styles.summary} numberOfLines={3}>
        {item.summary}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.why} numberOfLines={2}>
          {item.whyItMatters}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: space.md,
    marginBottom: space.sm,
  },
  pressed: {
    backgroundColor: colors.cardPressed,
  },
  headline: {
    ...type.headline,
    color: colors.text,
  },
  summary: {
    ...type.body,
    color: colors.secondary,
    marginTop: space.sm,
  },
  footer: {
    marginTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
    paddingTop: space.sm,
  },
  why: {
    ...type.caption,
    color: colors.muted,
    fontStyle: 'italic',
  },
});
