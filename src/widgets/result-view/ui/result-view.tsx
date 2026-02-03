'use client';

import { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreRadar } from '@/entities/evaluation';
import { ShareButtons, evaluationResultAtom, isEvaluatingAtom } from '@/features/result-share';
import { currentSessionAtom } from '@/entities/session';
import { messagesAtom } from '@/features/debate-chat';
import { ROUTES } from '@/shared/lib/constants';
import { encodeResult } from '@/shared/lib/result-encoder';
import { RotateCcw } from 'lucide-react';

export function ResultView() {
  const router = useRouter();
  const [session, setSession] = useAtom(currentSessionAtom);
  const messages = useAtomValue(messagesAtom);
  const setMessages = useSetAtom(messagesAtom);
  const [evaluation, setEvaluation] = useAtom(evaluationResultAtom);
  const [isEvaluating, setIsEvaluating] = useAtom(isEvaluatingAtom);

  useEffect(() => {
    if (!session) {
      router.push(ROUTES.home);
      return;
    }

    if (!evaluation && !isEvaluating) {
      setIsEvaluating(true);

      fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          messages: messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp,
          })),
          techStacks: session.selectedStacks.map((s) => s.name),
          surrendered: session.status === 'surrendered',
        }),
      })
        .then((res) => res.json())
        .then(setEvaluation)
        .finally(() => setIsEvaluating(false));
    }
  }, [session, evaluation, isEvaluating, messages, router, setEvaluation, setIsEvaluating]);

  // Auto-redirect to shareable URL after evaluation completes
  useEffect(() => {
    if (evaluation && session && typeof window !== 'undefined') {
      const code = encodeResult(
        session.userInfo.nickname,
        session.selectedStacks.map((s) => s.name),
        evaluation
      );
      window.history.replaceState(null, '', `/result/${code}`);
    }
  }, [evaluation, session]);

  const handleRestart = () => {
    setSession(null);
    setEvaluation(null);
    setMessages([]);
    router.push(ROUTES.home);
  };

  if (!session) return null;

  const verdictConfig = {
    win: { label: 'SURVIVED', color: 'bg-green-500', emoji: '🏆' },
    lose: { label: 'DESTROYED', color: 'bg-red-500', emoji: '💀' },
    draw: { label: 'DRAW', color: 'bg-yellow-500', emoji: '🤝' },
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">토론 결과</CardTitle>
        <CardDescription>
          {session.userInfo.nickname}님의 {session.selectedStacks.map((s) => s.name).join(', ')} 방어
          결과
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEvaluating || !evaluation ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-48 mx-auto" />
            <Skeleton className="h-[250px] w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="text-5xl mb-2 block">{verdictConfig[evaluation.verdict].emoji}</span>
              <Badge
                className={`${verdictConfig[evaluation.verdict].color} text-white text-2xl px-4 py-1`}
              >
                {verdictConfig[evaluation.verdict].label}
              </Badge>
              <p className="text-muted-foreground mt-2">{evaluation.verdictReason}</p>
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
                  <div>
                    <span className="font-medium">{metric.nameKo}</span>
                    <p className="text-sm text-muted-foreground">{metric.feedback}</p>
                  </div>
                  <Badge variant="outline" className="text-lg">
                    {metric.score}
                  </Badge>
                </div>
              ))}
            </div>

            <Separator />

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm italic">&quot;{evaluation.roastMessage}&quot;</p>
              <p className="text-right text-xs text-muted-foreground mt-2">- 저승사자 CTO</p>
            </div>

            <div className="flex flex-col gap-3">
              <ShareButtons
                nickname={session.userInfo.nickname}
                verdict={evaluation.verdict}
                score={evaluation.overallScore}
                stacks={session.selectedStacks.map((s) => s.name)}
                evaluation={evaluation}
              />
              <Button onClick={handleRestart} variant="outline" className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                다시 도전하기
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
