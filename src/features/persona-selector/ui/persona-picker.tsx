'use client';

import { useAtom } from 'jotai';
import { PERSONAS, PersonaCard } from '@/entities/persona';
import { selectedPersonaAtom } from '../model/atoms';

export function PersonaPicker() {
  const [selectedPersona, setSelectedPersona] = useAtom(selectedPersonaAtom);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {PERSONAS.map((persona) => (
        <PersonaCard
          key={persona.id}
          persona={persona}
          selected={selectedPersona === persona.id}
          onSelect={() => setSelectedPersona(persona.id)}
        />
      ))}
    </div>
  );
}
