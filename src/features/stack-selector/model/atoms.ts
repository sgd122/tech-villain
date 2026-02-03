import { atom } from 'jotai';
import type { TechStack } from '@/entities/tech-stack';

export const selectedStacksAtom = atom<TechStack[]>([]);
export const stackSearchQueryAtom = atom('');
