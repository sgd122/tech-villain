'use client';

import { useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StackCombobox, selectedStacksAtom } from '@/features/stack-selector';
import { PersonaPicker, selectedPersonaAtom } from '@/features/persona-selector';
import { currentSessionAtom, userInfoAtom } from '@/entities/session';
import { ROUTES } from '@/shared/lib/constants';

type Step = 'nickname' | 'stack' | 'context' | 'persona';

const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`[\]]+/g;

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('nickname');
  const [nickname, setNickname] = useState('');
  const [context, setContext] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [enrichedContext, setEnrichedContext] = useState<string | null>(null);

  const [, setUserInfo] = useAtom(userInfoAtom);
  const [selectedStacks] = useAtom(selectedStacksAtom);
  const [selectedPersona] = useAtom(selectedPersonaAtom);
  const setCurrentSession = useSetAtom(currentSessionAtom);

  const canProceedNickname = nickname.trim().length >= 2;
  const canProceedStack = selectedStacks.length > 0;

  // context에서 URL 추출 후 내용 가져오기
  const processContextUrls = async (text: string): Promise<string> => {
    const urls = text.match(URL_REGEX) || [];
    if (urls.length === 0) return text;

    const uniqueUrls = [...new Set(urls)].slice(0, 3); // 최대 3개
    const fetchedContents: string[] = [];

    for (const url of uniqueUrls) {
      try {
        const response = await fetch('/api/fetch-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        if (response.ok) {
          const data = await response.json();
          fetchedContents.push(`[참고: ${url}]\n${data.content}`);
        }
      } catch {
        // 실패한 URL은 무시
      }
    }

    if (fetchedContents.length === 0) return text;

    return `${text}\n\n--- 참고 자료 (자동 추출) ---\n${fetchedContents.join('\n\n')}`;
  };

  const handleContextNext = async () => {
    if (context.trim()) {
      setIsProcessing(true);
      try {
        const processed = await processContextUrls(context.trim());
        setEnrichedContext(processed);
      } catch {
        setEnrichedContext(context.trim());
      } finally {
        setIsProcessing(false);
      }
    } else {
      setEnrichedContext(null);
    }
    setStep('persona');
  };

  const handleStart = () => {
    setUserInfo({ nickname: nickname.trim() });
    setCurrentSession({
      id: nanoid(),
      userInfo: { nickname: nickname.trim() },
      selectedStacks,
      selectedPersona,
      context: enrichedContext || undefined,
      status: 'active',
      startedAt: Date.now(),
    });
    router.push(ROUTES.debate);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {step === 'nickname' && '닉네임 입력'}
          {step === 'stack' && '방어할 기술 스택'}
          {step === 'context' && '추가 정보 (선택)'}
          {step === 'persona' && '상대 선택'}
        </CardTitle>
        <CardDescription>
          {step === 'nickname' && '면접에서 사용할 닉네임을 입력하세요'}
          {step === 'stack' &&
            '당신이 방어할 기술 스택을 선택하세요 (최대 3개)'}
          {step === 'context' &&
            '프로젝트 배경이나 기술 선택 이유를 알려주세요'}
          {step === 'persona' && '당신을 공격할 면접관을 선택하세요'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 'nickname' && (
          <>
            <Input
              placeholder="닉네임 (2자 이상)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
            />
            <Button
              onClick={() => setStep('stack')}
              disabled={!canProceedNickname}
              className="w-full"
            >
              다음
            </Button>
          </>
        )}

        {step === 'stack' && (
          <>
            <StackCombobox />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('nickname')}
                className="flex-1"
              >
                이전
              </Button>
              <Button
                onClick={() => setStep('context')}
                disabled={!canProceedStack}
                className="flex-1"
              >
                다음
              </Button>
            </div>
          </>
        )}

        {step === 'context' && (
          <>
            <Textarea
              placeholder="예: 이커머스 프로젝트에서 React Query를 선택한 이유는 서버 상태 관리와 캐싱 때문입니다...

GitHub나 블로그 링크를 함께 붙여넣으면 AI가 자동으로 내용을 참고합니다.
https://github.com/user/project"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={6}
              maxLength={1000}
            />

            <p className="text-sm text-muted-foreground">
              프로젝트 배경이나 참고 링크(GitHub, 블로그 등)를 자유롭게 작성하세요.
              링크는 자동으로 내용을 가져옵니다. (선택사항)
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('stack')}
                className="flex-1"
                disabled={isProcessing}
              >
                이전
              </Button>
              <Button
                onClick={handleContextNext}
                disabled={isProcessing}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    링크 분석 중...
                  </>
                ) : context.trim() ? (
                  '다음'
                ) : (
                  '건너뛰기'
                )}
              </Button>
            </div>
          </>
        )}

        {step === 'persona' && (
          <>
            <PersonaPicker />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('context')}
                className="flex-1"
              >
                이전
              </Button>
              <Button onClick={handleStart} className="flex-1">
                토론 시작
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
