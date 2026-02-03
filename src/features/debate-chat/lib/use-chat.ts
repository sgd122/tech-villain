'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { nanoid } from 'nanoid';
import type { Message } from '@/entities/message';
import type { ChatMessage } from '@/shared/api/ai/types';
import {
  messagesAtom,
  isLoadingAtom,
  chatErrorAtom,
  currentTurnAtom,
  canSendMessageAtom,
} from '../model/atoms';

interface UseChatOptions {
  techStacks: string[];
  persona?: string;
  context?: string;
}

export function useChat({ techStacks, persona, context }: UseChatOptions) {
  const [messages, setMessages] = useAtom(messagesAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const setError = useSetAtom(chatErrorAtom);
  const currentTurn = useAtomValue(currentTurnAtom);
  const canSend = useAtomValue(canSendMessageAtom);
  const hasInitialized = useRef(false);

  // AI 선공: 토론 시작 시 AI가 먼저 질문
  const startDebate = useCallback(async () => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    setIsLoading(true);
    setError(null);

    const aiMessageId = nanoid();
    setMessages([
      {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [],
          options: { techStacks, persona, context, isFirstQuestion: true },
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullContent += parsed.text;
                setMessages([
                  {
                    id: aiMessageId,
                    role: 'assistant',
                    content: fullContent,
                    timestamp: Date.now(),
                    isStreaming: true,
                  },
                ]);
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }

      setMessages([
        {
          id: aiMessageId,
          role: 'assistant',
          content: fullContent,
          timestamp: Date.now(),
          isStreaming: false,
        },
      ]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      setMessages([]);
      hasInitialized.current = false;
    } finally {
      setIsLoading(false);
    }
  }, [techStacks, persona, context, setMessages, setIsLoading, setError]);

  // 컴포넌트 마운트 시 AI 선공 시작
  useEffect(() => {
    if (techStacks.length > 0 && messages.length === 0 && !hasInitialized.current) {
      startDebate();
    }
  }, [techStacks, messages.length, startDebate]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!canSend || !content.trim()) return;

      const userMessage: Message = {
        id: nanoid(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      };

      const currentMessages = [...messages, userMessage];
      setMessages(currentMessages);
      setIsLoading(true);
      setError(null);

      const aiMessageId = nanoid();
      setMessages([
        ...currentMessages,
        {
          id: aiMessageId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          isStreaming: true,
        },
      ]);

      try {
        const chatMessages: ChatMessage[] = currentMessages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: m.timestamp,
        }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: chatMessages,
            options: { techStacks, persona, context },
          }),
        });

        if (!response.ok) throw new Error('Failed to get response');

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullContent += parsed.text;
                  setMessages([
                    ...currentMessages,
                    {
                      id: aiMessageId,
                      role: 'assistant',
                      content: fullContent,
                      timestamp: Date.now(),
                      isStreaming: true,
                    },
                  ]);
                }
              } catch {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }

        setMessages([
          ...currentMessages,
          {
            id: aiMessageId,
            role: 'assistant',
            content: fullContent,
            timestamp: Date.now(),
            isStreaming: false,
          },
        ]);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        setMessages(currentMessages);
      } finally {
        setIsLoading(false);
      }
    },
    [canSend, messages, setMessages, setIsLoading, setError, techStacks, persona, context]
  );

  // 리셋 함수 (다시 도전하기용)
  const resetChat = useCallback(() => {
    hasInitialized.current = false;
    setMessages([]);
    setError(null);
  }, [setMessages, setError]);

  return { messages, isLoading, currentTurn, canSend, sendMessage, resetChat };
}
