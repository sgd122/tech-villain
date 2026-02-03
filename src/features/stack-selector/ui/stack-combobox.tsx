'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronsUpDown, X, Plus } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { TECH_STACKS, type TechStack } from '@/entities/tech-stack';
import { selectedStacksAtom } from '../model/atoms';

export function StackCombobox() {
  const [open, setOpen] = useState(false);
  const [selectedStacks, setSelectedStacks] = useAtom(selectedStacksAtom);
  const [inputValue, setInputValue] = useState('');

  const toggleStack = (stack: TechStack) => {
    setSelectedStacks((prev) => {
      const exists = prev.find((s) => s.id === stack.id);
      if (exists) return prev.filter((s) => s.id !== stack.id);
      if (prev.length >= 3) return prev;
      return [...prev, stack];
    });
  };

  const addCustomStack = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || selectedStacks.length >= 3) return;
    if (selectedStacks.find((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;

    const customStack: TechStack = {
      id: `custom-${Date.now()}`,
      name: trimmed,
      category: 'Custom',
    };
    setSelectedStacks((prev) => [...prev, customStack]);
    setInputValue('');
  };

  const removeStack = (stackId: string) => {
    setSelectedStacks((prev) => prev.filter((s) => s.id !== stackId));
  };

  const filteredStacks = TECH_STACKS.filter((stack) =>
    stack.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  const showAddCustom =
    inputValue.trim() &&
    !filteredStacks.some((s) => s.name.toLowerCase() === inputValue.toLowerCase()) &&
    !selectedStacks.some((s) => s.name.toLowerCase() === inputValue.toLowerCase()) &&
    selectedStacks.length < 3;

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedStacks.length > 0
              ? `${selectedStacks.length}개 선택됨`
              : '기술 스택 선택 (최대 3개)'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="기술 스택 검색 또는 직접 입력..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              {showAddCustom && (
                <CommandGroup heading="직접 추가">
                  <CommandItem onSelect={() => addCustomStack(inputValue)}>
                    <Plus className="mr-2 h-4 w-4" />
                    &quot;{inputValue}&quot; 추가
                    <Badge variant="outline" className="ml-auto text-xs">
                      Custom
                    </Badge>
                  </CommandItem>
                </CommandGroup>
              )}
              {filteredStacks.length === 0 && !showAddCustom && (
                <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
              )}
              {filteredStacks.length > 0 && (
                <CommandGroup heading="추천 기술 스택">
                  {filteredStacks.map((stack) => (
                    <CommandItem
                      key={stack.id}
                      value={stack.name}
                      onSelect={() => toggleStack(stack)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedStacks.find((s) => s.id === stack.id)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {stack.name}
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {stack.category}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedStacks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedStacks.map((stack) => (
            <Badge
              key={stack.id}
              variant={stack.category === 'Custom' ? 'outline' : 'default'}
              className="gap-1"
            >
              {stack.name}
              {stack.category === 'Custom' && (
                <span className="text-muted-foreground text-xs">(custom)</span>
              )}
              <button
                onClick={() => removeStack(stack.id)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
