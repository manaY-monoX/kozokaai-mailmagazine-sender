'use client';

import { Card, Title, Text } from '@mantine/core';

export default function HelpPage() {
  return (
    <div className="container max-w-4xl py-12">
      <Card withBorder shadow="sm" radius="md">
        <Card.Section p="lg">
          <Title order={2}>使い方</Title>
        </Card.Section>
        <Card.Section p="lg">
          <Text>メール配信システムの使い方</Text>
        </Card.Section>
      </Card>
    </div>
  );
}
