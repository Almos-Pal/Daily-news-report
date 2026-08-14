import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatWeekRange } from '../lib/dates';
import { loadIndex } from '../lib/feed';
import { colors, space, type } from '../theme';
import type { ReportIndex } from '../types/report';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Archive'>;

export function ArchiveScreen({ navigation }: Props) {
  const [index, setIndex] = useState<ReportIndex | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void (async () => {
        try {
          const next = await loadIndex();
          if (!cancelled) {
            setIndex(next);
            setError(null);
          }
        } catch (err) {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : 'Could not load archive');
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  if (loading && !index) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!index) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>{error ?? 'No issues yet.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.flex}>
      {index.issues.map((entry) => (
        <Pressable
          key={entry.id}
          onPress={() => navigation.navigate('Issue', { issueId: entry.id })}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        >
          <Text style={styles.kicker}>
            {entry.id}
            {entry.id === index.latest ? '  ·  latest' : ''}
          </Text>
          <Text style={styles.title}>{entry.title}</Text>
          <Text style={styles.range}>{formatWeekRange(entry.weekStart, entry.weekEnd)}</Text>
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
  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: { color: colors.secondary, textAlign: 'center' },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: space.md,
    marginBottom: space.sm,
  },
  pressed: { backgroundColor: colors.cardPressed },
  kicker: { ...type.kicker, color: colors.muted, marginBottom: space.xs },
  title: { ...type.issueTitle, color: colors.text },
  range: { ...type.caption, color: colors.secondary, marginTop: space.xs },
});
