import { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IssueView } from '../components/IssueView';
import { loadIssue } from '../lib/feed';
import { colors } from '../theme';
import type { Issue } from '../types/report';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Issue'>;

export function IssueScreen({ navigation, route }: Props) {
  const { issueId } = route.params;
  const [issue, setIssue] = useState<Issue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void (async () => {
        try {
          const next = await loadIssue(issueId);
          if (!cancelled) {
            setIssue(next);
            setError(null);
          }
        } catch (err) {
          if (!cancelled) {
            setError(err instanceof Error ? err.message : 'Could not load issue');
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [issueId]),
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
        <Text style={styles.message}>{error ?? 'Missing issue.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <IssueView
        issue={issue}
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
