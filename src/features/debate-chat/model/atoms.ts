import { atom } from 'jotai';
import type { Message } from '@/entities/message';
import { MAX_TURNS } from '@/shared/lib/constants';

export const messagesAtom = atom<Message[]>([]);
export const isLoadingAtom = atom(false);
export const chatErrorAtom = atom<string | null>(null);

export const currentTurnAtom = atom((get) => {
  const messages = get(messagesAtom);
  return messages.filter((m) => m.role === 'user').length;
});

export const canSendMessageAtom = atom((get) => {
  const turn = get(currentTurnAtom);
  const isLoading = get(isLoadingAtom);
  return turn < MAX_TURNS && !isLoading;
});

export const isDebateCompleteAtom = atom((get) => {
  const turn = get(currentTurnAtom);
  return turn >= MAX_TURNS;
});
