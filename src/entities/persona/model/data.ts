import type { Persona, PersonaType } from './types';

export const PERSONAS: Persona[] = [
  {
    id: 'cto',
    name: 'Grim Reaper CTO',
    nameKo: '저승사자 CTO',
    emoji: '💀',
    description: '논리적 허점 발견 시 가차 없음. 20년 경력의 냉정한 기술 심판관.',
    difficulty: 'hard',
    available: true,
  },
  {
    id: 'ceo',
    name: 'Startup CEO',
    nameKo: '창업병 대표',
    emoji: '💸',
    description: 'ROI, 비용, 일정 중심 공격. "그래서 돈은 얼마나 아껴지는데?"',
    difficulty: 'medium',
    available: true,
  },
  {
    id: 'hipster',
    name: 'Hipster Junior',
    nameKo: '힙스터 주니어',
    emoji: '🦄',
    description: '최신 트렌드 기반 공격. "요즘 누가 그거 써요?"',
    difficulty: 'easy',
    available: true,
  },
];

export const getPersonaById = (id: PersonaType): Persona | undefined =>
  PERSONAS.find(p => p.id === id);
