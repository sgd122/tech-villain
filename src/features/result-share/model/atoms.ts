import { atom } from 'jotai';
import type { EvaluationResult } from '@/entities/evaluation';

export const evaluationResultAtom = atom<EvaluationResult | null>(null);
export const isEvaluatingAtom = atom(false);
