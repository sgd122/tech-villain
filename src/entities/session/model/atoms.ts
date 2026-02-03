import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { DebateSession, UserInfo } from './types';

export const userInfoAtom = atomWithStorage<UserInfo | null>('tech-villain:user', null);
export const currentSessionAtom = atom<DebateSession | null>(null);

export const isSessionActiveAtom = atom((get) => {
  const session = get(currentSessionAtom);
  return session?.status === 'active';
});
