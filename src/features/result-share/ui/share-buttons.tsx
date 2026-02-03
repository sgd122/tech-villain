'use client';

import { Button } from '@/components/ui/button';
import { Twitter, Link2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { encodeResult } from '@/shared/lib/result-encoder';
import type { EvaluationResult } from '@/entities/evaluation';

interface ShareButtonsProps {
  nickname: string;
  verdict: string;
  score: number;
  stacks: string[];
  evaluation: EvaluationResult;
}

export function ShareButtons({ nickname, verdict, score, stacks, evaluation }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const resultCode = encodeResult(nickname, stacks, evaluation);
  const shareUrl = `${baseUrl}/result/${resultCode}`;

  const shareText = `Tech Villain에서 ${nickname}의 결과: ${verdict === 'win' ? '생존!' : verdict === 'lose' ? '탈락...' : '무승부'} (${score}점)\n기술 스택: ${stacks.join(', ')}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('링크가 복사되었습니다!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={copyLink}>
        {copied ? <Check className="h-4 w-4 mr-1" /> : <Link2 className="h-4 w-4 mr-1" />}
        {copied ? '복사됨!' : '링크 복사'}
      </Button>
      <Button variant="outline" size="sm" onClick={shareTwitter}>
        <Twitter className="h-4 w-4 mr-1" />
        트위터
      </Button>
    </div>
  );
}
