import bundledIndexJson from '../../assets/reports/index.json';
import bundledSampleIssue from '../../assets/reports/2026-W33.json';
import type { FeedMeta, Issue, ReportIndex } from '../types/report';
import {
  readCachedIndex,
  readCachedIssue,
  writeCache,
  writeCachedIssue,
} from './cache';
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

/** GitHub-as-CMS. Override with EXPO_PUBLIC_FEED_BASE_URL if the repo/branch changes. */
const DEFAULT_FEED_BASE =
  'https://raw.githubusercontent.com/Almos-Pal/Daily-news-report/main';

function feedBaseUrl(): string {
  const value = process.env.EXPO_PUBLIC_FEED_BASE_URL?.trim();
  return (value || DEFAULT_FEED_BASE).replace(/\/$/, '');
}

async function fetchJson(url: string, bustCache = false): Promise<unknown> {
  const target = bustCache ? `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}` : url;
  const response = await fetch(target, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Feed request failed (${response.status})`);
  }
  return response.json();
}

function bundledFallback(error?: string): {
  index: ReportIndex;
  issue: Issue;
  meta: FeedMeta;
  error?: string;
} {
  return {
    index: bundledIndex,
    issue: bundledSample,
    meta: { fetchedAt: Date.now(), source: 'bundled' },
    error,
  };
}

async function issueFromIndex(index: ReportIndex): Promise<Issue> {
  return (
    (await readCachedIssue(index.latest)) ??
    bundledIssues[index.latest] ??
    bundledSample
  );
}

export async function loadLatest(forceRefresh = false): Promise<{
  index: ReportIndex;
  issue: Issue;
  meta: FeedMeta;
  error?: string;
}> {
  const base = feedBaseUrl();
  const cached = await readCachedIndex();

  try {
    const index = parseIndex(await fetchJson(`${base}/reports/index.json`, forceRefresh));
    if (!index) throw new Error('Invalid index.json');
    const summary = index.issues.find((entry) => entry.id === index.latest) ?? index.issues[0];
    if (!summary) throw new Error('Index has no issues');
    const issue = parseIssue(await fetchJson(`${base}/${summary.path}`, forceRefresh));
    if (!issue) throw new Error('Invalid issue JSON');
    const fetchedAt = await writeCache(index, issue);
    return { index, issue, meta: { fetchedAt, source: 'remote' } };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not refresh feed';
    if (cached) {
      return {
        index: cached.index,
        issue: await issueFromIndex(cached.index),
        meta: { fetchedAt: cached.fetchedAt, source: 'cache' },
        error: message,
      };
    }
    return bundledFallback(message);
  }
}

export async function loadIssue(id: string): Promise<Issue> {
  const cached = await readCachedIssue(id);
  if (cached) return cached;
  if (bundledIssues[id]) return bundledIssues[id];

  const indexState = await readCachedIndex();
  const path =
    indexState?.index.issues.find((entry) => entry.id === id)?.path ?? `reports/${id}.json`;
  const issue = parseIssue(await fetchJson(`${feedBaseUrl()}/${path}`));
  if (!issue) throw new Error('Invalid issue JSON');
  await writeCachedIssue(issue);
  return issue;
}

export async function loadIndex(): Promise<ReportIndex> {
  const latest = await loadLatest();
  return latest.index;
}
