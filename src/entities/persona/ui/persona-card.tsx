'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/lib/utils';
import type { Persona } from '../model/types';

interface PersonaCardProps {
  persona: Persona;
  selected: boolean;
  onSelect: () => void;
}

export function PersonaCard({ persona, selected, onSelect }: PersonaCardProps) {
  const difficultyColors = {
    hard: 'bg-red-500/10 text-red-500',
    medium: 'bg-yellow-500/10 text-yellow-500',
    easy: 'bg-green-500/10 text-green-500',
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:border-primary',
        selected && 'border-primary ring-2 ring-primary',
        !persona.available && 'opacity-50 cursor-not-allowed'
      )}
      onClick={() => persona.available && onSelect()}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <span className="text-3xl">{persona.emoji}</span>
          <Badge className={difficultyColors[persona.difficulty]}>{persona.difficulty.toUpperCase()}</Badge>
        </div>
        <CardTitle className="text-lg">{persona.nameKo}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{persona.description}</CardDescription>
        {!persona.available && (
          <Badge variant="outline" className="mt-2">Coming Soon</Badge>
        )}
      </CardContent>
    </Card>
  );
}
