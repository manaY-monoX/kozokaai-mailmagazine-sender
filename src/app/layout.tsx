import type { Metadata } from 'next';
import './globals.css';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { SidebarWrapper } from '@/components/layout/SidebarWrapper';

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
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <MantineProvider defaultColorScheme="auto">
          <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <SidebarWrapper />
            <main style={{ flex: 1, overflowY: 'auto', marginLeft: 280 }}>
              {children}
            </main>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
