import type { ChatMessage } from '../types';

interface EvaluatorInput {
  messages: ChatMessage[];
  techStacks: string[];
  surrendered: boolean;
}

export const getEvaluatorPrompt = ({ messages, techStacks, surrendered }: EvaluatorInput): string => `
당신은 기술 면접 토론 평가자입니다. 토론 내용의 **질적 수준**을 분석하여 JSON 형식으로 평가하세요.

## 평가 대상 기술 스택
${techStacks.join(', ')}

## 토론 내용
${messages.length > 0 ? messages.map((m) => `[${m.role === 'user' ? '지원자' : 'CTO'}]: ${m.content}`).join('\n\n') : '(토론 없음)'}

## 항복 여부
${surrendered ? '⚠️ 지원자가 항복함 (GG)' : '끝까지 방어함'}

## 평가 기준 (각 0-100점) - 대화 퀄리티 기반

### 1. logic (논리력) - 답변의 논리적 구조
- 90-100: 완벽한 논리 구조, 모든 주장에 근거 제시, 반박에 체계적 대응
- 70-89: 대부분 논리적, 일부 근거 부족하나 설득력 있음
- 50-69: 기본적 논리는 있으나 허점 다수, 감정적 대응 섞임
- 30-49: 논리 부족, 두루뭉술한 답변, 질문 회피 경향
- 0-29: 논리 없음, 질문과 무관한 답변, 횡설수설

### 2. depth (깊이) - 기술적 이해도
- 90-100: 내부 동작 원리 설명, 벤치마크/수치 제시, 대안 비교 분석
- 70-89: 기술 특성 이해, 트레이드오프 인식, 실무 경험 언급
- 50-69: 표면적 이해, 공식 문서 수준, 깊은 질문에 막힘
- 30-49: 피상적 지식, 용어만 아는 수준, 구체성 부족
- 0-29: 기술 이해 부족, 오개념, 답변 불가

### 3. attitude (태도) - 면접 태도
- 90-100: 자신감 있되 겸손, 모르는 건 인정, 배우려는 자세
- 70-89: 전문적 태도, 질문 의도 파악, 적절한 대응
- 50-69: 보통 수준, 가끔 방어적, 일부 회피
- 30-49: 과도하게 방어적, 인정 안 함, 감정적 반응
- 0-29: 불성실, 질문 무시, 태도 불량

## 판정 기준
${
  surrendered
    ? '- 항복 = 무조건 "lose"\n- 단, 항복 전 답변 퀄리티에 따라 점수 차등 (좋은 답변 후 항복이면 40-50점, 나쁜 답변 후 항복이면 10-30점)'
    : '- 평균 70점 이상: "win" (훌륭한 방어)\n- 평균 50-69점: "draw" (아쉬운 방어)\n- 평균 50점 미만: "lose" (방어 실패)'
}

## 응답 형식 (JSON만 출력)
{
  "verdict": "${surrendered ? 'lose' : '"win" | "lose" | "draw"'}",
  "verdictReason": "판정 이유 (대화 퀄리티 기반, 한 문장)",
  "metrics": {
    "logic": { "score": 0-100, "feedback": "구체적 피드백 (어떤 답변이 좋았고/나빴는지)" },
    "depth": { "score": 0-100, "feedback": "구체적 피드백" },
    "attitude": { "score": 0-100, "feedback": "구체적 피드백" }
  },
  "overallScore": 세 점수의 평균 (소수점 버림),
  "roastMessage": "CTO의 총평 (2-3문장, 구체적인 대화 내용 언급하며 평가)"
}
`;

export const parseEvaluationResponse = (
  response: string,
  sessionId: string,
  surrendered: boolean = false
) => {
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');

    const parsed = JSON.parse(jsonMatch[0]);

    // 항복 시 verdict 강제 lose (점수는 AI가 퀄리티 기반으로 판단)
    const verdict = surrendered ? 'lose' : parsed.verdict;

    return {
      sessionId,
      verdict,
      verdictReason: parsed.verdictReason,
      metrics: {
        logic: { name: 'logic', nameKo: '논리력', ...parsed.metrics.logic },
        depth: { name: 'depth', nameKo: '깊이', ...parsed.metrics.depth },
        attitude: { name: 'attitude', nameKo: '태도', ...parsed.metrics.attitude },
      },
      overallScore: parsed.overallScore,
      roastMessage: parsed.roastMessage,
    };
  } catch (error) {
    console.error('[Evaluator] Failed to parse response:', error);
    console.error('[Evaluator] Raw response:', response);
    return {
      sessionId,
      verdict: surrendered ? ('lose' as const) : ('draw' as const),
      verdictReason: '평가 중 오류가 발생했습니다.',
      metrics: {
        logic: { name: 'logic', nameKo: '논리력', score: 50, feedback: '평가 불가' },
        depth: { name: 'depth', nameKo: '깊이', score: 50, feedback: '평가 불가' },
        attitude: { name: 'attitude', nameKo: '태도', score: 50, feedback: '평가 불가' },
      },
      overallScore: 50,
      roastMessage: '토론 내용을 평가하는 데 문제가 있었습니다.',
    };
  }
};
