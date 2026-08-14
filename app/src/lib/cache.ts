import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Issue, ReportIndex } from '../types/report';
import { parseIndex, parseIssue } from './parse';

const INDEX_KEY = 'dnr:index';
const META_KEY = 'dnr:meta';
const issueKey = (id: string) => `dnr:issue:${id}`;

type StoredMeta = { fetchedAt: number };

export async function readCachedIndex(): Promise<{
  index: ReportIndex;
  fetchedAt: number;
} | null> {
  const [raw, metaRaw] = await Promise.all([
    AsyncStorage.getItem(INDEX_KEY),
    AsyncStorage.getItem(META_KEY),
  ]);
  if (!raw) return null;
  try {
    const index = parseIndex(JSON.parse(raw));
    const meta = metaRaw ? (JSON.parse(metaRaw) as StoredMeta) : null;
    if (!index) return null;
    return { index, fetchedAt: meta?.fetchedAt ?? 0 };
  } catch {
    return null;
  }
}

export async function readCachedIssue(id: string): Promise<Issue | null> {
  const raw = await AsyncStorage.getItem(issueKey(id));
  if (!raw) return null;
  try {
    return parseIssue(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function writeCache(index: ReportIndex, issue: Issue): Promise<number> {
  const fetchedAt = Date.now();
  await AsyncStorage.multiSet([
    [INDEX_KEY, JSON.stringify(index)],
    [META_KEY, JSON.stringify({ fetchedAt } satisfies StoredMeta)],
    [issueKey(issue.id), JSON.stringify(issue)],
  ]);
  return fetchedAt;
}

export async function writeCachedIssue(issue: Issue): Promise<void> {
  await AsyncStorage.setItem(issueKey(issue.id), JSON.stringify(issue));
}
