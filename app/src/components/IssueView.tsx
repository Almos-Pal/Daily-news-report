import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Issue, ReportItem, ReportSection } from '../types/report';
import { colors, space, type } from '../theme';
import { formatWeekRange } from '../lib/dates';
import { ItemCard } from './ItemCard';

type Props = {
  issue: Issue;
  stale?: boolean;
  error?: string;
  source?: 'remote' | 'cache' | 'bundled';
  refreshing?: boolean;
  onRefresh?: () => void;
  onItemPress: (section: ReportSection, item: ReportItem, itemIndex: number) => void;
};

export function IssueView({
  issue,
  stale,
  error,
  source,
  refreshing,
  onRefresh,
  onItemPress,
}: Props) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={Boolean(refreshing)}
            onRefresh={onRefresh}
            tintColor={colors.accent}
          />
        ) : undefined
      }
    >
      <Text style={styles.kicker}>{formatWeekRange(issue.weekStart, issue.weekEnd)}</Text>
      <Text style={styles.title}>{issue.title}</Text>
      <Text style={styles.tldr}>{issue.tldr}</Text>
      {source === 'remote' ? (
        <Text style={styles.live}>Live from GitHub</Text>
      ) : null}
      {stale ? (
        <Text style={styles.stale}>This copy is more than 8 days old. Pull to refresh.</Text>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {issue.sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <ItemCard
              key={`${section.id}-${itemIndex}`}
              item={item}
              onPress={() => onItemPress(section, item, itemIndex)}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.xl,
  },
  kicker: {
    ...type.kicker,
    color: colors.muted,
    marginBottom: space.sm,
  },
  title: {
    ...type.title,
    color: colors.text,
  },
  tldr: {
    ...type.body,
    color: colors.secondary,
    marginTop: space.md,
    marginBottom: space.sm,
  },
  live: {
    ...type.caption,
    color: colors.accent,
    marginBottom: space.lg,
  },
  stale: {
    ...type.caption,
    color: colors.stale,
    marginBottom: space.md,
  },
  error: {
    ...type.caption,
    color: colors.error,
    marginBottom: space.md,
  },
  section: {
    marginBottom: space.lg,
  },
  sectionTitle: {
    ...type.kicker,
    color: colors.accent,
    marginBottom: space.sm,
  },
});
