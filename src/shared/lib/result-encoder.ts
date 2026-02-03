import type { EvaluationResult } from '@/entities/evaluation';

interface ShareableResult {
  n: string; // nickname
  s: string[]; // stacks
  v: 'win' | 'lose' | 'draw'; // verdict
  o: number; // overallScore
  l: number; // logic score
  d: number; // depth score
  a: number; // attitude score
  r: string; // roastMessage
}

// UTF-8 safe Base64 encoding (handles Korean)
function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function base64ToUtf8(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function encodeResult(
  nickname: string,
  stacks: string[],
  evaluation: EvaluationResult
): string {
  const data: ShareableResult = {
    n: nickname,
    s: stacks,
    v: evaluation.verdict,
    o: evaluation.overallScore,
    l: evaluation.metrics.logic.score,
    d: evaluation.metrics.depth.score,
    a: evaluation.metrics.attitude.score,
    r: evaluation.roastMessage,
  };

  const json = JSON.stringify(data);
  // UTF-8 safe Base64 URL-safe encoding
  return utf8ToBase64(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function decodeResult(encoded: string): ShareableResult | null {
  try {
    // Restore Base64 padding
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';

    const json = base64ToUtf8(base64);
    return JSON.parse(json) as ShareableResult;
  } catch {
    return null;
  }
}

export function resultToEvaluation(data: ShareableResult, sessionId: string): EvaluationResult {
  return {
    sessionId,
    verdict: data.v,
    verdictReason: '',
    metrics: {
      logic: { name: 'logic', nameKo: '논리력', score: data.l, feedback: '' },
      depth: { name: 'depth', nameKo: '깊이', score: data.d, feedback: '' },
      attitude: { name: 'attitude', nameKo: '태도', score: data.a, feedback: '' },
    },
    overallScore: data.o,
    roastMessage: data.r,
  };
}
