import { NextRequest, NextResponse } from 'next/server';
import { createAIAdapter } from '@/shared/api/ai';
import { getEvaluatorPrompt, parseEvaluationResponse } from '@/shared/api/ai/prompts/evaluator';
import type { ChatMessage } from '@/shared/api/ai/types';

export const runtime = 'nodejs';

interface EvaluateRequestBody {
  sessionId: string;
  messages: ChatMessage[];
  techStacks: string[];
  surrendered: boolean;
}

export async function POST(request: NextRequest) {
  const body: EvaluateRequestBody = await request.json();
  const { sessionId, messages, techStacks, surrendered } = body;

  const useMock = !process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const adapter = createAIAdapter(useMock ? 'mock' : 'gemini');

  const evaluationPrompt = getEvaluatorPrompt({ messages, techStacks, surrendered });

  try {
    const response = await adapter.generateResponse(
      [{ id: 'eval', role: 'user', content: evaluationPrompt, timestamp: Date.now() }],
      { maxTokens: 2048 }
    );

    console.log('[Evaluate API] Raw AI response length:', response.length);

    const evaluation = parseEvaluationResponse(response, sessionId, surrendered);
    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('[Evaluate API] Error:', error);
    return NextResponse.json(parseEvaluationResponse('', sessionId, surrendered), { status: 200 });
  }
}
