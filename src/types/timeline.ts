export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  image?: string;
  category: 'founding' | 'innovation' | 'milestone' | 'icon';
}
