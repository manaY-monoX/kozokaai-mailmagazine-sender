'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container, Group, Anchor, Avatar, Text } from '@mantine/core';

const navItems = [
  { href: '/', label: 'ホーム' },
  { href: '/draft', label: 'メール編集' },
  { href: '/archives', label: '配信履歴' },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      borderBottom: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-5))',
      backgroundColor: 'light-dark(rgba(255, 255, 255, 0.95), rgba(26, 27, 30, 0.95))',
      backdropFilter: 'blur(8px)'
    }}>
      <Container size="xl">
        <Group h={64} justify="space-between">
          <Group gap="xl">
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Group gap="xs">
                <Avatar size={32} radius="md" color="blue" />
                <Text fw={600} size="lg">Resend Mail</Text>
              </Group>
            </Link>
            <Group gap="md" visibleFrom="md">
              {navItems.map((item) => (
                <Anchor
                  key={item.href}
                  component={Link}
                  href={item.href}
                  size="sm"
                  fw={500}
                  c={pathname === item.href ? 'blue' : 'dimmed'}
                  style={{
                    transition: 'color 0.2s',
                    textDecoration: 'none'
                  }}
                >
                  {item.label}
                </Anchor>
              ))}
            </Group>
          </Group>
        </Group>
      </Container>
    </header>
  );
}
