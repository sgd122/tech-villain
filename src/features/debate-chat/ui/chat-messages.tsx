'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserMessage, AIMessage } from '@/entities/message';
import type { Message } from '@/entities/message';

interface ChatMessagesProps {
  messages: Message[];
  nickname: string;
  personaEmoji: string;
  personaName: string;
}

export function ChatMessages({ messages, nickname, personaEmoji, personaName }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) =>
          message.role === 'user' ? (
            <UserMessage key={message.id} message={message} nickname={nickname} />
          ) : (
            <AIMessage
              key={message.id}
              message={message}
              personaEmoji={personaEmoji}
              personaName={personaName}
            />
          )
        )}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}
