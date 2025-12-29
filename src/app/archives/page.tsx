import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getArchiveList } from '@/lib/archive-loader';
import { ArchiveListClient } from './ArchiveListClient';

export const metadata = {
  title: 'メール配信履歴 | Resend メール配信システム',
  description: '過去に送信したメールマガジンの一覧',
};

export default async function ArchivesPage() {
  const archives = await getArchiveList();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">メール配信履歴</h1>
            <p className="text-gray-600 mt-2">
              過去に送信したメールマガジン {archives.length}件
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">ホームへ戻る</Button>
          </Link>
        </div>

        <Suspense
          fallback={<div className="text-center py-12">読み込み中...</div>}
        >
          {archives.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              メールアーカイブが見つかりませんでした
            </div>
          ) : (
            <ArchiveListClient archives={archives} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
