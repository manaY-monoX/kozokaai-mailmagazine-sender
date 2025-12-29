import * as path from 'path';
import * as fs from 'fs';
import { pathToFileURL } from 'url';
import { render } from '@react-email/render';

interface RenderOptions {
  yyyy: string;
  mm: string;
  ddMsg: string;
  s3BaseUrl?: string;
}

/**
 * mail.tsx を HTML に変換
 *
 * @param options - レンダリングオプション
 * @returns { html: string } | { error: string }
 */
export async function renderMailToHtml(
  options: RenderOptions
): Promise<{ html: string } | { error: string }> {
  const { yyyy, mm, ddMsg, s3BaseUrl } = options;

  const mailPath = path.join(
    process.cwd(),
    'public',
    'archives',
    yyyy,
    mm,
    ddMsg,
    'mail.tsx'
  );

  if (!fs.existsSync(mailPath)) {
    return { error: `mail.tsx が見つかりません: ${mailPath}` };
  }

  try {
    // 動的インポート (send-test-email.ts L98-100 と同じ)
    const moduleUrl = pathToFileURL(mailPath).href;
    const module = await import(moduleUrl);
    const Component = module.default;

    if (typeof Component !== 'function') {
      throw new Error('Default export is not a React component');
    }

    // React → HTML 変換
    const html = await render(Component(), { plainText: false });

    // 画像パス置換 (S3 URL)
    if (s3BaseUrl) {
      return { html: replaceImagePaths(html, s3BaseUrl, yyyy, mm, ddMsg) };
    }

    return { html };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'React コンポーネントのレンダリングに失敗しました',
    };
  }
}

/**
 * 画像パスを /mail-assets/ から S3 URL に置換
 *
 * 注意: render() 後のHTMLは <img> タグになっている（<Img> ではない）
 */
function replaceImagePaths(
  html: string,
  s3BaseUrl: string,
  yyyy: string,
  mm: string,
  ddMsg: string
): string {
  // 正規表現: <img> タグ（render() 後は <img> になる）
  const pattern = /<img[^>]*src=['"]\/mail-assets\/([^'"]+)['"]/gi;

  return html.replace(pattern, (match, filename) => {
    const s3Url = `${s3BaseUrl}/archives/${yyyy}/${mm}/${ddMsg}/assets/${filename}`;
    return match.replace(/\/mail-assets\/[^'"]+/, s3Url);
  });
}
