'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScoreRadar } from '@/entities/evaluation';
import type { EvaluationResult } from '@/entities/evaluation';
import { decodeResult, resultToEvaluation } from '@/shared/lib/result-encoder';
import { ROUTES } from '@/shared/lib/constants';
import { RotateCcw } from 'lucide-react';

interface SharedResultPageProps {
  code: string;
}

export function SharedResultPage({ code }: SharedResultPageProps) {
  const router = useRouter();

  const { data, error } = useMemo(() => {
    const decoded = decodeResult(code);
    if (decoded) {
      return {
        data: {
          nickname: decoded.n,
          stacks: decoded.s,
          evaluation: resultToEvaluation(decoded, 'shared'),
        } as { nickname: string; stacks: string[]; evaluation: EvaluationResult },
        error: false,
      };
    }
    return { data: null, error: true };
  }, [code]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>잘못된 링크</CardTitle>
            <CardDescription>결과를 찾을 수 없습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push(ROUTES.home)} className="w-full">
              나도 도전하기
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!data) return null;

  const { nickname, stacks, evaluation } = data;

  const verdictConfig = {
    win: { label: 'SURVIVED', color: 'bg-green-500', emoji: '🏆' },
    lose: { label: 'DESTROYED', color: 'bg-red-500', emoji: '💀' },
    draw: { label: 'DRAW', color: 'bg-yellow-500', emoji: '🤝' },
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Tech Villain</CardTitle>
          <CardDescription>
            {nickname}님의 {stacks.join(', ')} 방어 결과
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <span className="text-5xl mb-2 block">{verdictConfig[evaluation.verdict].emoji}</span>
            <Badge
              className={`${verdictConfig[evaluation.verdict].color} text-white text-2xl px-4 py-1`}
            >
              {verdictConfig[evaluation.verdict].label}
            </Badge>
            <p className="text-4xl font-bold mt-4">{evaluation.overallScore}점</p>
          </div>

          <Separator />

          <ScoreRadar metrics={evaluation.metrics} />

          <div className="grid gap-3">
            {Object.values(evaluation.metrics).map((metric) => (
              <div
                key={metric.name}
                className="flex justify-between items-center p-3 bg-muted rounded-lg"
              >
                <span className="font-medium">{metric.nameKo}</span>
                <Badge variant="outline" className="text-lg">
                  {metric.score}
                </Badge>
              </div>
            ))}
          </div>

          {evaluation.roastMessage && (
            <>
              <Separator />
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm italic">&quot;{evaluation.roastMessage}&quot;</p>
                <p className="text-right text-xs text-muted-foreground mt-2">- 저승사자 CTO</p>
              </div>
            </>
          )}

          <Button onClick={() => router.push(ROUTES.home)} className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            나도 도전하기
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
