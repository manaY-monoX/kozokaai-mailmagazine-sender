import React from 'react';

interface EmailWrapperProps {
  children: React.ReactNode;
  previewText?: string;
}

/**
 * メール共通レイアウトコンポーネント
 *
 * メールクライアント互換性のため、インラインスタイルを使用
 * テーブルレイアウトで中央揃え・最大幅を設定
 */
export function EmailWrapper({ children, previewText }: EmailWrapperProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#f6f9fc',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* プレビューテキスト（メーラーの件名下に表示される） */}
        {previewText && (
          <div
            style={{
              display: 'none',
              maxHeight: 0,
              overflow: 'hidden',
            }}
          >
            {previewText}
          </div>
        )}

        {/* メインコンテンツ */}
        <table
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{
            margin: 0,
            padding: 0,
            backgroundColor: '#f6f9fc',
          }}
        >
          <tr>
            <td align="center" style={{ padding: '40px 0' }}>
              <table
                width="600"
                cellPadding="0"
                cellSpacing="0"
                style={{
                  maxWidth: '600px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
              >
                <tr>
                  <td style={{ padding: '40px' }}>{children}</td>
                </tr>
              </table>

              {/* フッター */}
              <table
                width="600"
                cellPadding="0"
                cellSpacing="0"
                style={{
                  maxWidth: '600px',
                  marginTop: '20px',
                }}
              >
                <tr>
                  <td
                    align="center"
                    style={{
                      fontSize: '12px',
                      color: '#8898aa',
                      lineHeight: '16px',
                    }}
                  >
                    <p style={{ margin: '0 0 8px 0' }}>
                      このメールは [会社名] からお送りしています
                    </p>
                    <p style={{ margin: 0 }}>
                      © {new Date().getFullYear()} [会社名]. All rights
                      reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}
