import { atom } from 'jotai';
import type { PersonaType } from '@/entities/persona';

export const selectedPersonaAtom = atom<PersonaType>('cto');
