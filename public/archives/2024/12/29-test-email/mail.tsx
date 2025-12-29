import React from 'react';
import { EmailWrapper } from '@/components/email/EmailWrapper';
import { Img } from '@/components/email/Img';

export default function TestEmail() {
  return (
    <EmailWrapper previewText="テストメールのプレビュー">
      <h1 style={{ fontSize: '24px', margin: '0 0 16px 0' }}>テストメール</h1>
      <p style={{ fontSize: '15px', lineHeight: '1.6' }}>
        これはテスト用のメールです。
      </p>
      <Img
        src="/mail-assets/placeholder.webp"
        alt="テスト画像"
        width="520"
        style={{ width: '100%', height: 'auto' }}
      />
    </EmailWrapper>
  );
}
