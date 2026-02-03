'use client';

import { useAtom, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  useChat,
  ChatMessages,
  ChatInput,
  TurnIndicator,
  GGButton,
  isDebateCompleteAtom,
  messagesAtom,
} from '@/features/debate-chat';
import { currentSessionAtom } from '@/entities/session';
import { getPersonaById } from '@/entities/persona';
import { ROUTES } from '@/shared/lib/constants';

export function DebateArena() {
  const router = useRouter();
  const [session, setSession] = useAtom(currentSessionAtom);
  const [isComplete] = useAtom(isDebateCompleteAtom);
  const setMessages = useSetAtom(messagesAtom);

  const persona = session ? getPersonaById(session.selectedPersona) : null;
  const techStacks = session?.selectedStacks.map((s) => s.name) || [];

  const { messages, isLoading, currentTurn, canSend, sendMessage } = useChat({
    techStacks,
    persona: session?.selectedPersona,
    context: session?.context,
  });

  useEffect(() => {
    if (!session) {
      router.push(ROUTES.home);
      return;
    }
    // Reset messages when entering debate
    setMessages([]);
  }, [session, router, setMessages]);

  useEffect(() => {
    if (isComplete && session) {
      setSession({ ...session, status: 'completed' });
      router.push(ROUTES.result);
    }
  }, [isComplete, session, setSession, router]);

  const handleSurrender = () => {
    if (session) {
      setSession({ ...session, status: 'surrendered' });
      router.push(ROUTES.result);
    }
  };

  if (!session || !persona) return null;

  return (
    <Card className="w-full max-w-3xl mx-auto h-[85vh] sm:h-[80vh] flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{persona.emoji}</span>
          <span className="font-semibold">{persona.nameKo}</span>
        </div>
        <div className="flex items-center gap-4">
          <TurnIndicator currentTurn={currentTurn} />
          <GGButton onSurrender={handleSurrender} disabled={isLoading} />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ChatMessages
          messages={messages}
          nickname={session.userInfo.nickname}
          personaEmoji={persona.emoji}
          personaName={persona.nameKo}
        />
        <ChatInput
          onSend={sendMessage}
          disabled={!canSend}
          placeholder={isLoading ? 'AI 응답 대기 중...' : '답변을 입력하세요...'}
        />
      </CardContent>
    </Card>
  );
}
