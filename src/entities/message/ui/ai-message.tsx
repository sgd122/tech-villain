import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { Message } from '../model/types';

interface AIMessageProps {
  message: Message;
  personaEmoji: string;
  personaName: string;
}

export function AIMessage({ message, personaEmoji, personaName }: AIMessageProps) {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{personaEmoji}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col max-w-[80%]">
        <span className="text-xs text-muted-foreground mb-1">{personaName}</span>
        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-2">
          {message.isStreaming && !message.content ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
          {message.isStreaming && message.content && (
            <span className="inline-block w-1 h-4 bg-foreground animate-pulse ml-1" />
          )}
        </div>
      </div>
    </div>
  );
}
