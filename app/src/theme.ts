export const colors = {
  bg: '#0B0B0D',
  card: '#161618',
  cardPressed: '#1C1C1F',
  hairline: '#2C2C2E',
  text: '#F5F5F7',
  secondary: '#A1A1A6',
  muted: '#6E6E73',
  accent: '#0A84FF',
  stale: '#FF9F0A',
  error: '#FF453A',
};

export const space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 36,
};

export const type = {
  kicker: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  title: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  issueTitle: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  headline: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
  },
};
