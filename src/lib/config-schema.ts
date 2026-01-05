import { z } from 'zod';

/**
 * config.json スキーマ定義
 *
 * アーカイブディレクトリ内の config.json を検証するためのZodスキーマ
 */
export const ConfigSchema = z
  .object({
    /**
     * メール件名
     */
    subject: z.string().min(1, 'メール件名は必須です'),

    /**
     * Resend Segment ID（推奨）
     * 形式: UUID v4 (例: 78261eea-8f8b-4381-83c6-79fa7120f1cf)
     */
    segmentId: z
      .string()
      .uuid(
        'Segment IDの形式が不正です（例: 78261eea-8f8b-4381-83c6-79fa7120f1cf）'
      )
      .optional(),

    /**
     * Resend Audience ID（非推奨、後方互換性のため残す）
     * 形式: aud_xxxxxxxx
     * @deprecated Use segmentId instead
     */
    audienceId: z
      .string()
      .regex(
        /^aud_[a-zA-Z0-9]+$/,
        'Audience IDの形式が不正です（例: aud_12345678）'
      )
      .optional(),

    /**
     * 送信日時（ISO 8601形式）
     * null: 未送信
     * string: 送信済み（送信日時）
     */
    sentAt: z.string().nullable(),
  })
  .refine((data) => data.segmentId || data.audienceId, {
    message: 'segmentId または audienceId のいずれかは必須です',
    path: ['segmentId'],
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
