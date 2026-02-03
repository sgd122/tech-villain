export type StackCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'devops'
  | 'language'
  | 'state'
  | 'Custom';

export interface TechStack {
  id: string;
  name: string;
  category: StackCategory;
  tags?: string[];
}
