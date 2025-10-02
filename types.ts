export type Page = 'audio' | 'photo' | 'video' | 'planner' | 'autofill' | 'keys';

export interface MenuItem {
  id: Page;
  labelKey: string;
  icon: React.ElementType;
}