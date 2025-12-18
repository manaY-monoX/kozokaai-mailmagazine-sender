import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Resend メール配信システム',
  description: 'メールマガジン作成・配信システム',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
