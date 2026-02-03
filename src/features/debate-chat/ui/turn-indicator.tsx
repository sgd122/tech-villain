import { Badge } from '@/components/ui/badge';
import { MAX_TURNS } from '@/shared/lib/constants';

interface TurnIndicatorProps {
  currentTurn: number;
}

export function TurnIndicator({ currentTurn }: TurnIndicatorProps) {
  const progress = (currentTurn / MAX_TURNS) * 100;

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="font-mono">
        {currentTurn}/{MAX_TURNS} 턴
      </Badge>
      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
