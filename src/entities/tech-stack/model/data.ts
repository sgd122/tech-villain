import type { TechStack } from './types';

export const TECH_STACKS: TechStack[] = [
  { id: 'react', name: 'React', category: 'frontend', tags: ['ui', 'library'] },
  { id: 'nextjs', name: 'Next.js', category: 'frontend', tags: ['framework', 'ssr'] },
  { id: 'vue', name: 'Vue.js', category: 'frontend', tags: ['ui', 'framework'] },
  { id: 'svelte', name: 'Svelte', category: 'frontend', tags: ['ui', 'compiler'] },
  { id: 'angular', name: 'Angular', category: 'frontend', tags: ['framework'] },
  { id: 'react-query', name: 'React Query', category: 'state', tags: ['data-fetching'] },
  { id: 'redux', name: 'Redux', category: 'state', tags: ['state-management'] },
  { id: 'zustand', name: 'Zustand', category: 'state', tags: ['state-management'] },
  { id: 'jotai', name: 'Jotai', category: 'state', tags: ['state-management', 'atomic'] },
  { id: 'nodejs', name: 'Node.js', category: 'backend', tags: ['runtime'] },
  { id: 'nestjs', name: 'NestJS', category: 'backend', tags: ['framework'] },
  { id: 'express', name: 'Express', category: 'backend', tags: ['framework', 'minimal'] },
  { id: 'fastify', name: 'Fastify', category: 'backend', tags: ['framework', 'fast'] },
  { id: 'postgresql', name: 'PostgreSQL', category: 'database', tags: ['sql', 'relational'] },
  { id: 'mongodb', name: 'MongoDB', category: 'database', tags: ['nosql', 'document'] },
  { id: 'redis', name: 'Redis', category: 'database', tags: ['cache', 'in-memory'] },
  { id: 'supabase', name: 'Supabase', category: 'database', tags: ['baas', 'postgresql'] },
  { id: 'typescript', name: 'TypeScript', category: 'language', tags: ['typed'] },
  { id: 'docker', name: 'Docker', category: 'devops', tags: ['container'] },
  { id: 'kubernetes', name: 'Kubernetes', category: 'devops', tags: ['orchestration'] },
];

export const searchStacks = (query: string): TechStack[] => {
  const q = query.toLowerCase();
  return TECH_STACKS.filter(
    (s) => s.name.toLowerCase().includes(q) || s.tags?.some((t) => t.includes(q))
  );
};
