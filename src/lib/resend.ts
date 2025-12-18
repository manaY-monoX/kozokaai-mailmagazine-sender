import { Resend } from 'resend';

/**
 * Resend SDK初期化
 *
 * 環境変数 RESEND_API_KEY が必要
 */
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Resend Audience存在確認
 *
 * @param audienceId - Resend Audience ID
 * @returns 存在する場合 true
 */
export async function checkAudienceExists(
  audienceId: string
): Promise<boolean> {
  try {
    const { data, error } = await resend.audiences.get(audienceId);

    if (error) {
      console.error('Resend API Error:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Failed to check audience:', error);
    return false;
  }
}

/**
 * Resend Audience一覧取得
 *
 * @returns Audience一覧
 */
export async function listAudiences() {
  try {
    const { data, error } = await resend.audiences.list();

    if (error) {
      console.error('Resend API Error:', error);
      return [];
    }

    return data?.data || [];
  } catch (error) {
    console.error('Failed to list audiences:', error);
    return [];
  }
}
