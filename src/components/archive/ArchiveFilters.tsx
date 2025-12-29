'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface FilterState {
  search: string;
  status: 'all' | 'sent' | 'unsent';
}

interface ArchiveFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export function ArchiveFilters({ onFilterChange }: ArchiveFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
  });

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusChange = (status: FilterState['status']) => {
    const newFilters = { ...filters, status };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4 mb-6">
      <Input
        placeholder="件名で検索..."
        value={filters.search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
        className="max-w-md"
      />
      <div className="flex gap-2">
        <Button
          variant={filters.status === 'all' ? 'default' : 'outline'}
          onClick={() => handleStatusChange('all')}
          size="sm"
        >
          すべて
        </Button>
        <Button
          variant={filters.status === 'sent' ? 'default' : 'outline'}
          onClick={() => handleStatusChange('sent')}
          size="sm"
        >
          送信済み
        </Button>
        <Button
          variant={filters.status === 'unsent' ? 'default' : 'outline'}
          onClick={() => handleStatusChange('unsent')}
          size="sm"
        >
          未送信
        </Button>
      </div>
    </div>
  );
}
