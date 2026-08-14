import {
  SECTION_IDS,
  type Issue,
  type IssueSummary,
  type ReportIndex,
  type ReportItem,
  type ReportSection,
  type SectionId,
  type Source,
} from '../types/report';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function parseSource(value: unknown): Source | null {
  if (!isRecord(value)) return null;
  const name = asString(value.name);
  const url = asString(value.url);
  if (!name || !url || !url.startsWith('https://')) return null;
  return { name, url };
}

function parseItem(value: unknown): ReportItem | null {
  if (!isRecord(value)) return null;
  const headline = asString(value.headline);
  const summary = asString(value.summary);
  const whyItMatters = asString(value.whyItMatters);
  if (!headline || !summary || !whyItMatters) return null;
  if (!Array.isArray(value.sources)) return null;
  const sources = value.sources
    .map(parseSource)
    .filter((source): source is Source => source !== null);
  if (sources.length === 0) return null;
  const tags = Array.isArray(value.tags)
    ? value.tags.filter((tag): tag is string => typeof tag === 'string')
    : undefined;
  return { headline, summary, whyItMatters, sources, tags };
}

function parseSection(value: unknown): ReportSection | null {
  if (!isRecord(value)) return null;
  const id = asString(value.id);
  if (!id || !(SECTION_IDS as readonly string[]).includes(id)) return null;
  const title = asString(value.title);
  const language = value.language === 'hu' ? 'hu' : value.language === 'en' ? 'en' : null;
  if (!title || !language || !Array.isArray(value.items)) return null;
  const items = value.items
    .map(parseItem)
    .filter((item): item is ReportItem => item !== null);
  if (items.length === 0) return null;
  return { id: id as SectionId, title, language, items };
}

export function parseIssue(value: unknown): Issue | null {
  if (!isRecord(value)) return null;
  const id = asString(value.id);
  const weekStart = asString(value.weekStart);
  const weekEnd = asString(value.weekEnd);
  const generatedAt = asString(value.generatedAt);
  const title = asString(value.title);
  const tldr = asString(value.tldr);
  if (!id || !weekStart || !weekEnd || !generatedAt || !title || !tldr) return null;
  if (!Array.isArray(value.sections)) return null;
  const byId = new Map<SectionId, ReportSection>();
  for (const raw of value.sections) {
    const section = parseSection(raw);
    if (section) byId.set(section.id, section);
  }
  const sections = SECTION_IDS.map((sectionId) => byId.get(sectionId)).filter(
    (section): section is ReportSection => section !== undefined,
  );
  return { id, weekStart, weekEnd, generatedAt, title, tldr, sections };
}

export function parseIndex(value: unknown): ReportIndex | null {
  if (!isRecord(value)) return null;
  const latest = asString(value.latest);
  if (!latest || !Array.isArray(value.issues)) return null;
  const issues: IssueSummary[] = [];
  for (const raw of value.issues) {
    if (!isRecord(raw)) continue;
    const id = asString(raw.id);
    const weekStart = asString(raw.weekStart);
    const weekEnd = asString(raw.weekEnd);
    const title = asString(raw.title);
    const path = asString(raw.path);
    if (id && weekStart && weekEnd && title && path) {
      issues.push({ id, weekStart, weekEnd, title, path });
    }
  }
  if (issues.length === 0) return null;
  return { latest, issues };
}
