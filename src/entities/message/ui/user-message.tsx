import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Message } from '../model/types';

interface UserMessageProps {
  message: Message;
  nickname: string;
}

export function UserMessage({ message, nickname }: UserMessageProps) {
  return (
    <div className="flex gap-3 justify-end">
      <div className="flex flex-col items-end max-w-[80%]">
        <span className="text-xs text-muted-foreground mb-1">{nickname}</span>
        <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
      <Avatar className="h-8 w-8">
        <AvatarFallback>{nickname[0]?.toUpperCase()}</AvatarFallback>
      </Avatar>
    </div>
  );
}
