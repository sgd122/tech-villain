export interface ScoreMetric {
  name: string;
  nameKo: string;
  score: number;
  feedback: string;
}

export interface EvaluationResult {
  sessionId: string;
  verdict: 'win' | 'lose' | 'draw';
  verdictReason: string;
  metrics: {
    logic: ScoreMetric;
    depth: ScoreMetric;
    attitude: ScoreMetric;
  };
  overallScore: number;
  roastMessage: string;
}
