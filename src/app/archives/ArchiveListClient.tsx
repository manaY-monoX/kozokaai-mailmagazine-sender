'use client';

import { useState, useMemo } from 'react';
import { ArchiveCard } from '@/components/archive/ArchiveCard';
import {
  ArchiveFilters,
  type FilterState,
} from '@/components/archive/ArchiveFilters';
import type { MailArchive } from '@/lib/archive-loader';

interface ArchiveListClientProps {
  archives: MailArchive[];
}

export function ArchiveListClient({ archives }: ArchiveListClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
  });

  const filteredArchives = useMemo(() => {
    return archives.filter((archive) => {
      // 件名検索
      if (
        filters.search &&
        !archive.subject.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // 送信状態フィルタ
      if (filters.status === 'sent' && !archive.sentAt) return false;
      if (filters.status === 'unsent' && archive.sentAt) return false;

      return true;
    });
  }, [archives, filters]);

  return (
    <>
      <ArchiveFilters onFilterChange={setFilters} />

      <div className="space-y-4">
        {filteredArchives.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            該当するメールが見つかりませんでした
          </div>
        ) : (
          filteredArchives.map((archive) => (
            <ArchiveCard key={archive.path} archive={archive} />
          ))
        )}
      </div>
    </>
  );
}
