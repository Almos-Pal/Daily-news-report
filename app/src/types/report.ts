export const SECTION_IDS = [
  'apple',
  'cursor',
  'ai',
  'tech',
  'hungary',
  'world',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export type Source = {
  name: string;
  url: string;
};

export type ReportItem = {
  headline: string;
  summary: string;
  whyItMatters: string;
  sources: Source[];
  tags?: string[];
};

export type ReportSection = {
  id: SectionId;
  title: string;
  language: 'en' | 'hu';
  items: ReportItem[];
};

export type Issue = {
  id: string;
  weekStart: string;
  weekEnd: string;
  generatedAt: string;
  title: string;
  tldr: string;
  sections: ReportSection[];
};

export type IssueSummary = {
  id: string;
  weekStart: string;
  weekEnd: string;
  title: string;
  path: string;
};

export type ReportIndex = {
  latest: string;
  issues: IssueSummary[];
};

export type FeedMeta = {
  fetchedAt: number;
  source: 'remote' | 'cache' | 'bundled';
};
