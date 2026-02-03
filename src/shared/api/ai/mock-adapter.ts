import type { AIProvider, ChatMessage, GenerateOptions } from './types';

const MOCK_FIRST_QUESTIONS = [
  (stacks: string[]) =>
    `${stacks[0]}를 썼다고? 흥미롭네. 근데 왜 굳이 ${stacks[0]}야? 다른 대안들은 검토 안 해봤어?`,
  (stacks: string[]) =>
    `자, ${stacks.join(', ')}로 방어하겠다 이거지? 먼저 ${stacks[0]}부터 가자. 이거 선택한 이유가 뭐야? 팀에서 다 동의했어?`,
  (stacks: string[]) =>
    `${stacks[0]}... 요즘도 이거 쓰는 곳이 있구나. 왜 이걸 선택했는지 설명해봐. 근거가 있어?`,
];

const MOCK_FOLLOWUPS = [
  '그래서? 구체적인 수치로 말해봐. 성능 벤치마크 해봤어?',
  '그건 알겠고, 단점은? 그 문제는 어떻게 해결했는데?',
  '실제로 프로덕션에서 써봤어? 장애 나면 어떻게 대응해?',
  '팀원들 러닝커브는 어땠어? 온보딩 시간 얼마나 걸렸는데?',
  '흠, 그 정도 답변이면 좀 부족한데. 더 깊이 파고들어봐.',
  '다른 대안은 진짜 안 검토해봤어? 요즘 그거보다 나은 게 많은데.',
];

export class MockAIAdapter implements AIProvider {
  async generateResponse(
    messages: ChatMessage[],
    options?: GenerateOptions & { isFirstQuestion?: boolean }
  ): Promise<string> {
    await new Promise((r) => setTimeout(r, 300));

    const stacks = options?.techStacks || ['기술'];

    if (messages.length === 0 || options?.isFirstQuestion) {
      const randomFirst =
        MOCK_FIRST_QUESTIONS[Math.floor(Math.random() * MOCK_FIRST_QUESTIONS.length)];
      return randomFirst(stacks);
    }

    return MOCK_FOLLOWUPS[Math.floor(Math.random() * MOCK_FOLLOWUPS.length)];
  }

  async *streamResponse(
    messages: ChatMessage[],
    options?: GenerateOptions & { isFirstQuestion?: boolean }
  ): AsyncGenerator<string> {
    const response = await this.generateResponse(messages, options);

    // 단어 단위로 스트리밍 (더 자연스럽게)
    const words = response.split(' ');
    for (const word of words) {
      await new Promise((r) => setTimeout(r, 50));
      yield word + ' ';
    }
  }
}
