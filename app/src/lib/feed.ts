import bundledIndexJson from '../../assets/reports/index.json';
import bundledSampleIssue from '../../assets/reports/2026-W33.json';
import type { FeedMeta, Issue, ReportIndex } from '../types/report';
import {
  readCachedIndex,
  readCachedIssue,
  writeCache,
  writeCachedIssue,
} from './cache';
import { isStale } from './dates';
import { parseIndex, parseIssue } from './parse';

const parsedIndex = parseIndex(bundledIndexJson);
const parsedSample = parseIssue(bundledSampleIssue);

if (!parsedIndex || !parsedSample) {
  throw new Error('Bundled sample reports failed to parse');
}

const bundledIndex: ReportIndex = parsedIndex;
const bundledSample: Issue = parsedSample;

const bundledIssues: Record<string, Issue> = {
  [bundledSample.id]: bundledSample,
};

function feedBaseUrl(): string | null {
  const value = process.env.EXPO_PUBLIC_FEED_BASE_URL?.trim();
  return value ? value.replace(/\/$/, '') : null;
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Feed request failed (${response.status})`);
  }
  return response.json();
}

function bundledFallback(): { index: ReportIndex; issue: Issue; meta: FeedMeta } {
  return {
    index: bundledIndex,
    issue: bundledSample,
    meta: { fetchedAt: Date.now(), source: 'bundled' },
  };
}

export async function loadLatest(forceRefresh = false): Promise<{
  index: ReportIndex;
  issue: Issue;
  meta: FeedMeta;
  error?: string;
}> {
  const base = feedBaseUrl();
  const cached = await readCachedIndex();

  if (!forceRefresh && cached && !isStale(cached.fetchedAt)) {
    const issue =
      (await readCachedIssue(cached.index.latest)) ??
      bundledIssues[cached.index.latest] ??
      bundledSample;
    return {
      index: cached.index,
      issue,
      meta: { fetchedAt: cached.fetchedAt, source: 'cache' },
    };
  }

  if (base) {
    try {
      const index = parseIndex(await fetchJson(`${base}/reports/index.json`));
      if (!index) throw new Error('Invalid index.json');
      const summary = index.issues.find((entry) => entry.id === index.latest) ?? index.issues[0];
      if (!summary) throw new Error('Index has no issues');
      const issue = parseIssue(await fetchJson(`${base}/${summary.path}`));
      if (!issue) throw new Error('Invalid issue JSON');
      const fetchedAt = await writeCache(index, issue);
      return { index, issue, meta: { fetchedAt, source: 'remote' } };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not refresh feed';
      if (cached) {
        const issue =
          (await readCachedIssue(cached.index.latest)) ??
          bundledIssues[cached.index.latest] ??
          bundledSample;
        return {
          index: cached.index,
          issue,
          meta: { fetchedAt: cached.fetchedAt, source: 'cache' },
          error: forceRefresh ? message : undefined,
        };
      }
      return { ...bundledFallback(), error: message };
    }
  }

  if (cached) {
    const issue =
      (await readCachedIssue(cached.index.latest)) ??
      bundledIssues[cached.index.latest] ??
      bundledSample;
    return {
      index: cached.index,
      issue,
      meta: { fetchedAt: cached.fetchedAt, source: 'cache' },
    };
  }

  return bundledFallback();
}

export async function loadIssue(id: string): Promise<Issue> {
  const cached = await readCachedIssue(id);
  if (cached) return cached;
  if (bundledIssues[id]) return bundledIssues[id];

  const base = feedBaseUrl();
  const indexState = await readCachedIndex();
  const path =
    indexState?.index.issues.find((entry) => entry.id === id)?.path ?? `reports/${id}.json`;

  if (base) {
    const issue = parseIssue(await fetchJson(`${base}/${path}`));
    if (!issue) throw new Error('Invalid issue JSON');
    await writeCachedIssue(issue);
    return issue;
  }

  throw new Error(`Issue ${id} is not available offline`);
}

export async function loadIndex(): Promise<ReportIndex> {
  const latest = await loadLatest();
  return latest.index;
}
