import type { PersonaType } from '@/entities/persona';
import type { TechStack } from '@/entities/tech-stack';

export interface UserInfo {
  nickname: string;
}

export interface DebateSession {
  id: string;
  userInfo: UserInfo;
  selectedStacks: TechStack[];
  selectedPersona: PersonaType;
  context?: string; // 선택사항: 프로젝트 배경, 기술 선택 이유 등
  status: 'pending' | 'active' | 'completed' | 'surrendered';
  startedAt: number;
}
