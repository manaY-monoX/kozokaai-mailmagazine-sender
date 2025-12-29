import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getArchive } from '@/lib/archive-loader';
import { renderMailToHtml } from '@/lib/mail-renderer';

interface PageProps {
  params: Promise<{
    yyyy: string;
    mm: string;
    ddMsg: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { yyyy, mm, ddMsg } = await params;
  const archive = await getArchive(yyyy, mm, ddMsg);

  if (!archive) {
    return {
      title: 'アーカイブが見つかりません',
    };
  }

  return {
    title: `${archive.subject} | メール配信履歴`,
    description: `${archive.subject} のプレビュー`,
  };
}

export default async function ArchiveDetailPage({ params }: PageProps) {
  const { yyyy, mm, ddMsg } = await params;

  // メタデータ取得
  const archive = await getArchive(yyyy, mm, ddMsg);

  if (!archive) {
    notFound();
  }

  // HTML変換
  const s3BaseUrl = process.env.S3_BUCKET_URL;
  const result = await renderMailToHtml({
    yyyy,
    mm,
    ddMsg,
    s3BaseUrl,
  });

  if ('error' in result) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Link href="/archives">
              <Button variant="outline">← 一覧へ戻る</Button>
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              エラーが発生しました
            </h1>
            <p className="text-gray-700">{result.error}</p>
          </div>
        </div>
      </div>
    );
  }

  const isSent = archive.sentAt !== null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/archives">
            <Button variant="outline">← 一覧へ戻る</Button>
          </Link>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isSent
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {isSent ? '送信済み' : '未送信'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h1 className="text-2xl font-bold mb-2">{archive.subject}</h1>
          <div className="text-sm text-gray-600">
            <p>作成日: {archive.createdAt.toLocaleDateString('ja-JP')}</p>
            {archive.sentAt && (
              <p>送信日: {new Date(archive.sentAt).toLocaleDateString('ja-JP')}</p>
            )}
            <p>Audience ID: {archive.audienceId}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">メールプレビュー</h2>
          <iframe
            srcDoc={result.html}
            className="w-full border-0 rounded"
            style={{ height: '800px' }}
            sandbox="allow-same-origin"
            title="メールプレビュー"
          />
        </div>
      </div>
    </div>
  );
}
