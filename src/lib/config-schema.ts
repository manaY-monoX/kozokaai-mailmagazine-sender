import { z } from 'zod';

/**
 * config.json スキーマ定義
 *
 * アーカイブディレクトリ内の config.json を検証するためのZodスキーマ
 */
export const ConfigSchema = z.object({
  /**
   * メール件名
   */
  subject: z.string().min(1, 'メール件名は必須です'),

  /**
   * Resend Audience ID
   * 形式: aud_xxxxxxxx
   */
  audienceId: z
    .string()
    .regex(/^aud_[a-zA-Z0-9]+$/, 'Audience IDの形式が不正です（例: aud_12345678）'),

  /**
   * 送信日時（ISO 8601形式）
   * null: 未送信
   * string: 送信済み（送信日時）
   */
  sentAt: z.string().nullable(),
});

/**
 * Config型定義
 */
export type Config = z.infer<typeof ConfigSchema>;

/**
 * config.jsonのバリデーション関数
 *
 * @param data - バリデーション対象データ
 * @returns バリデーション結果
 */
export function validateConfig(data: unknown): {
  success: boolean;
  data?: Config;
  error?: z.ZodError;
} {
  const result = ConfigSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, error: result.error };
  }
}
