export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  persona?: string;
  techStacks?: string[];
  context?: string; // 프로젝트 배경, 기술 선택 이유 등
}

export interface AIProvider {
  generateResponse(messages: ChatMessage[], options?: GenerateOptions): Promise<string>;
  streamResponse(messages: ChatMessage[], options?: GenerateOptions): AsyncGenerator<string, void, unknown>;
}

export type AIProviderType = 'gemini' | 'mock';
