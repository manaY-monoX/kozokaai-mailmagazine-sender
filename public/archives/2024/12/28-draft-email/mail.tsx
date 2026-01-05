import React from 'react';
import { EmailWrapper } from '@/components/email/EmailWrapper';

export default function DraftEmail() {
  return (
    <EmailWrapper previewText="未送信メール">
      <h1 style={{ fontSize: '24px', margin: '0 0 16px 0' }}>未送信メール</h1>
      <p style={{ fontSize: '15px', lineHeight: '1.6' }}>
        これは未送信のメールです（sentAt: null）。
      </p>
    </EmailWrapper>
  );
}
