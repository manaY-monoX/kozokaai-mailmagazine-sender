'use client';

import { Stack, Box, Text } from '@mantine/core';
import { SidebarNav } from './SidebarNav';
import { ArchiveAccordion } from './ArchiveAccordion';
import type { MailArchive } from '@/lib/archive-loader';
import styles from './Sidebar.module.css';

interface SidebarProps {
  archives: MailArchive[];
}

export function Sidebar({ archives }: SidebarProps) {
  return (
    <Stack gap={0} h="100%" className={styles.sidebar}>
      <Box style={{ flex: 1, overflowY: 'auto' }}>
        <SidebarNav />
        <Box mt="xl" px="sm">
          <Text size="xs" fw={600} tt="uppercase" c="dimmed" px="sm" mb="xs">
            配信履歴
          </Text>
          <ArchiveAccordion archives={archives} />
        </Box>
      </Box>

      <Box className={styles.footer}>
        <Text size="xs" c="dimmed">© 2026 Resend Mail</Text>
      </Box>
    </Stack>
  );
}
