'use client';

import { Group, Burger, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import styles from './SidebarHeader.module.css';

export interface SidebarHeaderProps {
  mobileOpened: boolean;
  toggleMobile: () => void;
}

export function SidebarHeader({ mobileOpened, toggleMobile }: SidebarHeaderProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group h="100%" px="md" justify="space-between" className={styles.header}>
      <Group>
        <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
        <div className={styles.logo}>
          <span className={styles.logoIcon}>R</span>
        </div>
        <div>
          <div className={styles.title}>Resend Mail</div>
          <div className={styles.version}>v0.1.0</div>
        </div>
      </Group>

      <ActionIcon
        variant="default"
        onClick={() => toggleColorScheme()}
        size="lg"
        aria-label="Toggle color scheme"
      >
        {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
      </ActionIcon>
    </Group>
  );
}
