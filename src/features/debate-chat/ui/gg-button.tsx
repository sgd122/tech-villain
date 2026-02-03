'use client';

import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';

interface GGButtonProps {
  onSurrender: () => void;
  disabled?: boolean;
}

export function GGButton({ onSurrender, disabled }: GGButtonProps) {
  return (
    <Button variant="destructive" size="sm" onClick={onSurrender} disabled={disabled}>
      <Flag className="h-4 w-4 mr-1" />
      GG (항복)
    </Button>
  );
}
