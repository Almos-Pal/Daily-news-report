import type { ReportItem } from './types/report';

export type RootStackParamList = {
  Home: undefined;
  Archive: undefined;
  Issue: { issueId: string };
  Item: {
    sectionTitle: string;
    language: 'en' | 'hu';
    item: ReportItem;
  };
};
