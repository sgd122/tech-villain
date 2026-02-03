import { NextRequest } from 'next/server';
import { createAIAdapter } from '@/shared/api/ai';
import type { ChatMessage, GenerateOptions } from '@/shared/api/ai/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ChatRequestBody {
  messages: ChatMessage[];
  options?: GenerateOptions & { isFirstQuestion?: boolean };
}

export async function POST(request: NextRequest) {
  const body: ChatRequestBody = await request.json();
  const { messages, options } = body;

  const useMock = !process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const adapter = createAIAdapter(useMock ? 'mock' : 'gemini');

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of adapter.streamResponse(messages, options)) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Stream error';
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
