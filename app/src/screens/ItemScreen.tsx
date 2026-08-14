import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { colors, space, type } from '../theme';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Item'>;

export function ItemScreen({ route }: Props) {
  const { sectionTitle, item } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.flex}>
      <Text style={styles.kicker}>{sectionTitle}</Text>
      <Text style={styles.headline}>{item.headline}</Text>
      <Text style={styles.body}>{item.summary}</Text>
      <View style={styles.whyBox}>
        <Text style={styles.whyLabel}>Why it matters</Text>
        <Text style={styles.why}>{item.whyItMatters}</Text>
      </View>
      <Text style={styles.kicker}>Sources</Text>
      {item.sources.map((source) => (
        <Pressable
          key={source.url}
          onPress={() => void Linking.openURL(source.url)}
          style={({ pressed }) => [styles.source, pressed && styles.pressed]}
        >
          <Text style={styles.sourceName}>{source.name}</Text>
          <Text style={styles.sourceUrl} numberOfLines={1}>
            {source.url}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: {
    padding: space.lg,
    paddingBottom: space.xl,
  },
  kicker: {
    ...type.kicker,
    color: colors.accent,
    marginBottom: space.sm,
  },
  headline: {
    ...type.title,
    color: colors.text,
    marginBottom: space.md,
  },
  body: {
    ...type.body,
    color: colors.secondary,
    marginBottom: space.lg,
  },
  whyBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: space.md,
    marginBottom: space.xl,
  },
  whyLabel: {
    ...type.kicker,
    color: colors.muted,
    marginBottom: space.sm,
  },
  why: {
    ...type.body,
    color: colors.text,
  },
  source: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: space.md,
    marginBottom: space.sm,
  },
  pressed: { backgroundColor: colors.cardPressed },
  sourceName: { ...type.headline, fontSize: 16, color: colors.text },
  sourceUrl: { ...type.caption, color: colors.muted, marginTop: 4 },
});
