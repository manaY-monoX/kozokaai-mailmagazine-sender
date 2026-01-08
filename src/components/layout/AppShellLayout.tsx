'use client';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SidebarHeader } from './SidebarHeader';
import { Sidebar } from './Sidebar';
import type { MailArchive } from '@/lib/archive-loader';

export interface AppShellLayoutProps {
  archives: MailArchive[];
  children: React.ReactNode;
}

export function AppShellLayout({ archives, children }: AppShellLayoutProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <SidebarHeader
          mobileOpened={mobileOpened}
          toggleMobile={toggleMobile}
        />
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar archives={archives} />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
