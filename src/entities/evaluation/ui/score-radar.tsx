'use client';

import { useEffect, useState } from 'react';
import type { EvaluationResult } from '../model/types';

interface ScoreRadarProps {
  metrics: EvaluationResult['metrics'];
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#22c55e'; // green
  if (score >= 60) return '#eab308'; // yellow
  if (score >= 40) return '#f97316'; // orange
  return '#ef4444'; // red
}

export function ScoreRadar({ metrics }: ScoreRadarProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const data = [
    { label: '논리력', score: metrics.logic.score },
    { label: '깊이', score: metrics.depth.score },
    { label: '태도', score: metrics.attitude.score },
  ];

  const centerX = 150;
  const centerY = 130;
  const maxRadius = 100;

  // 삼각형 꼭지점 각도 (위, 좌하, 우하)
  const angles = [-90, 150, 30].map((deg) => (deg * Math.PI) / 180);

  // 점수에 따른 좌표 계산
  const getPoint = (index: number, score: number) => {
    const radius = (score / 100) * maxRadius;
    const angle = angles[index];
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  // 그리드 라인 (20, 40, 60, 80, 100)
  const gridLevels = [20, 40, 60, 80, 100];

  const points = data.map((d, i) => getPoint(i, animated ? d.score : 0));

  // 평균 점수로 색상 결정
  const avgScore = Math.round((data[0].score + data[1].score + data[2].score) / 3);
  const fillColor = getScoreColor(avgScore);

  // 100점 기준 외곽선 좌표
  const maxPoints = angles.map((angle) => ({
    x: centerX + maxRadius * Math.cos(angle),
    y: centerY + maxRadius * Math.sin(angle),
  }));

  return (
    <div className="w-full flex justify-center">
      <svg width="300" height="280" viewBox="0 0 300 280">
        <defs>
          {/* 100점 영역 그라데이션 */}
          <linearGradient id="maxAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.15" />
          </linearGradient>
          {/* 100점 테두리 그라데이션 */}
          <linearGradient id="maxBorderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* 100점 기준 외곽선 (최대 영역) - 그라데이션 배경 */}
        <polygon
          points={maxPoints.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="url(#maxAreaGradient)"
          stroke="url(#maxBorderGradient)"
          strokeWidth="2"
        />

        {/* 내부 그리드 라인 (25, 50, 75) - 더 깔끔하게 */}
        {[25, 50, 75].map((level) => {
          const gridPoints = angles.map((angle) => {
            const r = (level / 100) * maxRadius;
            return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
          });
          return (
            <polygon
              key={level}
              points={gridPoints.join(' ')}
              fill="none"
              stroke="#6366f1"
              strokeWidth="1"
              opacity={0.15}
            />
          );
        })}

        {/* 축 라인 */}
        {angles.map((angle, i) => (
          <line
            key={i}
            x1={centerX}
            y1={centerY}
            x2={centerX + maxRadius * Math.cos(angle)}
            y2={centerY + maxRadius * Math.sin(angle)}
            stroke="#6366f1"
            strokeWidth="1"
            opacity={0.2}
          />
        ))}

        {/* 내 점수 영역 (채워지는 부분) */}
        <polygon
          points={`${points[0].x},${points[0].y} ${points[1].x},${points[1].y} ${points[2].x},${points[2].y}`}
          fill={fillColor}
          fillOpacity={0.6}
          stroke={fillColor}
          strokeWidth="3"
          style={{
            transition: 'all 0.8s ease-out',
          }}
        />

        {/* 데이터 포인트 */}
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="6"
            fill={getScoreColor(data[i].score)}
            stroke="white"
            strokeWidth="2"
            style={{
              transition: 'all 0.8s ease-out',
            }}
          />
        ))}

        {/* 라벨 */}
        <text x={centerX} y={20} textAnchor="middle" className="fill-foreground text-sm font-medium">
          {data[0].label}
        </text>
        <text x={centerX} y={35} textAnchor="middle" className="fill-muted-foreground text-xs">
          {data[0].score}점
        </text>

        <text x={40} y={240} textAnchor="middle" className="fill-foreground text-sm font-medium">
          {data[1].label}
        </text>
        <text x={40} y={255} textAnchor="middle" className="fill-muted-foreground text-xs">
          {data[1].score}점
        </text>

        <text x={260} y={240} textAnchor="middle" className="fill-foreground text-sm font-medium">
          {data[2].label}
        </text>
        <text x={260} y={255} textAnchor="middle" className="fill-muted-foreground text-xs">
          {data[2].score}점
        </text>
      </svg>
    </div>
  );
}
