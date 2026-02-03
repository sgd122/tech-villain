import { GoogleGenAI } from '@google/genai';
import { getCEOFirstQuestionPrompt, getCEOPrompt } from './prompts/ceo-persona';
import { getCTOPrompt, getFirstQuestionPrompt } from './prompts/cto-persona';
import {
  getHipsterFirstQuestionPrompt,
  getHipsterPrompt,
} from './prompts/hipster-persona';
import type { AIProvider, ChatMessage, GenerateOptions } from './types';

function getPromptByPersona(
  persona: string | undefined,
  techStacks: string[],
  isFirstQuestion: boolean,
  context?: string
): string {
  let basePrompt: string;
  switch (persona) {
    case 'ceo':
      basePrompt = isFirstQuestion
        ? getCEOFirstQuestionPrompt(techStacks)
        : getCEOPrompt(techStacks);
      break;
    case 'hipster':
      basePrompt = isFirstQuestion
        ? getHipsterFirstQuestionPrompt(techStacks)
        : getHipsterPrompt(techStacks);
      break;
    case 'cto':
    default:
      basePrompt = isFirstQuestion
        ? getFirstQuestionPrompt(techStacks)
        : getCTOPrompt(techStacks);
  }

  if (context) {
    basePrompt += `

## 지원자가 제공한 배경 정보
${context}

위 배경 정보를 참고하여 더 구체적이고 날카로운 질문을 던지세요. 지원자가 언급한 내용의 허점을 파고드세요.`;
  }

  return basePrompt;
}

export class GeminiAIAdapter implements AIProvider {
  private client: GoogleGenAI;
  private modelName = 'gemini-3-flash-preview';

  constructor() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is required');
    }
    this.client = new GoogleGenAI({ apiKey });
  }

  async generateResponse(
    messages: ChatMessage[],
    options?: GenerateOptions & { isFirstQuestion?: boolean }
  ): Promise<string> {
    const techStacks = options?.techStacks || [];
    const isFirstQuestion = options?.isFirstQuestion || messages.length === 0;
    const systemPrompt = getPromptByPersona(
      options?.persona,
      techStacks,
      isFirstQuestion,
      options?.context
    );

    const contents =
      messages.length === 0
        ? [{ role: 'user' as const, parts: [{ text: '면접을 시작해주세요.' }] }]
        : messages.map((m) => ({
            role: (m.role === 'assistant' ? 'model' : 'user') as
              | 'user'
              | 'model',
            parts: [{ text: m.content }],
          }));

    const response = await this.client.models.generateContent({
      model: this.modelName,
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: options?.temperature ?? 0.8,
        maxOutputTokens: options?.maxTokens ?? 2048,
      },
    });

    return response.text || '';
  }

  async *streamResponse(
    messages: ChatMessage[],
    options?: GenerateOptions & { isFirstQuestion?: boolean }
  ): AsyncGenerator<string> {
    const techStacks = options?.techStacks || [];
    const isFirstQuestion = options?.isFirstQuestion || messages.length === 0;
    const systemPrompt = getPromptByPersona(
      options?.persona,
      techStacks,
      isFirstQuestion,
      options?.context
    );

    const contents =
      messages.length === 0
        ? [{ role: 'user' as const, parts: [{ text: '면접을 시작해주세요.' }] }]
        : messages.map((m) => ({
            role: (m.role === 'assistant' ? 'model' : 'user') as
              | 'user'
              | 'model',
            parts: [{ text: m.content }],
          }));

    const response = await this.client.models.generateContentStream({
      model: this.modelName,
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: options?.temperature ?? 0.8,
        maxOutputTokens: options?.maxTokens ?? 2048,
      },
    });

    for await (const chunk of response) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  }
}
