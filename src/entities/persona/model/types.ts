export type PersonaType = 'cto' | 'ceo' | 'hipster';

export interface Persona {
  id: PersonaType;
  name: string;
  nameKo: string;
  emoji: string;
  description: string;
  difficulty: 'hard' | 'medium' | 'easy';
  available: boolean;
}
