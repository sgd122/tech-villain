import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const nickname = searchParams.get('nickname') ?? 'Anonymous';
  const verdict = searchParams.get('verdict') ?? 'draw';
  const score = searchParams.get('score') ?? '0';
  const stacks = searchParams.get('stacks') ?? '';

  const verdictConfig = {
    win: { label: 'SURVIVED', color: '#22c55e' },
    lose: { label: 'DESTROYED', color: '#ef4444' },
    draw: { label: 'DRAW', color: '#eab308' },
  };

  const config = verdictConfig[verdict as keyof typeof verdictConfig] || verdictConfig.draw;

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#0a0a0a',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 10 }}>💀</div>
        <div style={{ fontSize: 64, fontWeight: 'bold', marginBottom: 20 }}>Tech Villain</div>
        <div style={{ fontSize: 32, color: '#888', marginBottom: 40 }}>
          {nickname}의 기술 면접 결과
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: config.color,
            marginBottom: 20,
          }}
        >
          {config.label}
        </div>
        <div style={{ fontSize: 48 }}>Score: {score}/100</div>
        <div style={{ fontSize: 24, color: '#666', marginTop: 30 }}>{stacks}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}
