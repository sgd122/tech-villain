import type { AIProvider, AIProviderType } from './types';
import { MockAIAdapter } from './mock-adapter';
import { GeminiAIAdapter } from './gemini-adapter';

export function createAIAdapter(type: AIProviderType): AIProvider {
  switch (type) {
    case 'gemini':
      return new GeminiAIAdapter();
    case 'mock':
    default:
      return new MockAIAdapter();
  }
}

export * from './types';
