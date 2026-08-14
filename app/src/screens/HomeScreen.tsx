import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IssueView } from '../components/IssueView';
import { isStale } from '../lib/dates';
import { loadLatest } from '../lib/feed';
import { colors } from '../theme';
import type { FeedMeta, Issue } from '../types/report';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const [meta, setMeta] = useState<FeedMeta | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (force = false) => {
    try {
      const result = await loadLatest(force);
      setIssue(result.issue);
      setMeta(result.meta);
      setError(result.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this week');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load(false);
    }, [load]),
  );

  if (loading && !issue) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!issue) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>{error ?? 'No issue yet.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <IssueView
        issue={issue}
        stale={meta ? isStale(meta.fetchedAt) : false}
        error={error}
        source={meta?.source}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          void load(true);
        }}
        onItemPress={(section, item) =>
          navigation.navigate('Item', {
            sectionTitle: section.title,
            language: section.language,
            item,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  message: { color: colors.secondary, textAlign: 'center' },
});
