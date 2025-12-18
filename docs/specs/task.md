# Resendメール配信システム 実装タスクリスト

**基準ドキュメント:** `docs/specs/require.md`
**実装計画:** `/Users/m-yamashita/.claude/plans/peaceful-gliding-pillow.md`

## 実装優先順位

### MVP（最小限の動作）

タスク1〜5で「ローカル制作 → アーカイブ → バリデーション」が動作

### 拡張機能（レビュー・配信フロー）

タスク6〜9で「レビュー → 配信」の全フローが完成

### 補完

タスク10〜11で最終仕上げ

---

## タスクリスト

### タスク1: プロジェクト初期化

**目的:** Next.js環境とベース依存関係の構築
**依存関係:** なし

- [ ] `package.json` 作成・初期化（Next.js 14+, TypeScript, React 18+）
- [ ] 依存関係インストール
  - [ ] Core: `next`, `react`, `react-dom`, `typescript`, `@types/node`, `@types/react`
  - [ ] Email: `resend`, `@react-email/render`, `@react-email/components`
  - [ ] AWS: `@aws-sdk/client-s3`, `@aws-sdk/lib-storage`
  - [ ] CLI: `inquirer`, `@types/inquirer`, `chalk`
  - [ ] Validation: `zod`
  - [ ] Util: `date-fns`
  - [ ] DevDep: `tsx`
- [ ] `tsconfig.json` 作成（Next.js推奨設定）
- [ ] `next.config.js` 作成（基本設定）
- [ ] `.env.example` 作成（RESEND_API_KEY, AWS_*, S3_*, REVIEWER_EMAIL）
- [ ] `.gitignore` 更新（.env, node_modules, .next）

**成果物:** `package.json`, `tsconfig.json`, `next.config.js`, `.env.example`

---

### タスク2: 基本ディレクトリ・コンポーネント作成

**目的:** メールテンプレート編集環境の構築
**依存関係:** タスク1

- [ ] ディレクトリ作成
  - [ ] `src/app/draft`
  - [ ] `src/components/email`
  - [ ] `src/lib`
  - [ ] `src/scripts`
  - [ ] `public/mail-assets`
  - [ ] `public/archives`
- [ ] `src/components/email/Img.tsx` 作成（画像パス解決用）
- [ ] `src/components/email/EmailWrapper.tsx` 作成（共通レイアウト）
- [ ] `src/app/draft/page.tsx` 初期テンプレート作成（サンプルデザイン）
- [ ] `src/app/layout.tsx` 作成（Next.js必須）
- [ ] `src/app/page.tsx` 作成（Next.js必須）

**成果物:** `Img.tsx`, `EmailWrapper.tsx`, `draft/page.tsx`, `layout.tsx`, `page.tsx`

---

### タスク3: Zodスキーマ・Resend/S3初期化

**目的:** 外部サービス連携とバリデーション基盤
**依存関係:** タスク1

- [ ] `src/lib/config-schema.ts` 作成
  - [ ] Zodスキーマ定義（subject, audienceId, sentAt）
  - [ ] Config型エクスポート
- [ ] `src/lib/resend.ts` 作成
  - [ ] Resend SDK初期化
  - [ ] RESEND_API_KEY 環境変数読み込み
- [ ] `src/lib/s3.ts` 作成
  - [ ] S3 Client初期化
  - [ ] アップロード用ヘルパー関数

**成果物:** `config-schema.ts`, `resend.ts`, `s3.ts`

---

### タスク4: CLIツール実装（npm run commit）

**目的:** ローカル制作完了後の自動アーカイブ・コミット
**依存関係:** タスク2, タスク3

- [ ] `src/scripts/commit.ts` 作成
  - [ ] 対話型入力実装（inquirer）
    - [ ] コミットメッセージ
    - [ ] メール件名
    - [ ] Resend Audience ID
  - [ ] 日付取得（date-fns: YYYY/MM/DD）
  - [ ] アーカイブディレクトリ作成（`public/archives/{YYYY}/{MM}/{DD-MSG}/`）
  - [ ] ファイル移動
    - [ ] `src/app/draft/page.tsx` → `archives/{YYYY}/{MM}/{DD-MSG}/mail.tsx`
    - [ ] `public/mail-assets/*` → `archives/{YYYY}/{MM}/{DD-MSG}/assets/`
  - [ ] `config.json` 生成（subject, audienceId, sentAt: null）
  - [ ] `src/app/draft/page.tsx` を初期テンプレートにリセット
  - [ ] Git操作自動化（add, commit, push）
- [ ] `package.json` の `scripts` に `commit` コマンド追加

**成果物:** `src/scripts/commit.ts`, `package.json`（scripts更新）

---

### タスク5: バリデーションスクリプト

**目的:** GitHub Actions Check Workflowで使用
**依存関係:** タスク3

- [ ] `src/scripts/validate-archive.ts` 作成
  - [ ] 新規archiveディレクトリ検出（git diff）
  - [ ] config.json検証（Zodスキーマ）
  - [ ] 画像パス検証（mail.tsx内のImgタグパース、assets/配下実在確認）
  - [ ] Resend Audience ID検証（API呼び出し）
  - [ ] エラー時: 詳細メッセージ出力、終了コード1
  - [ ] 正常時: 終了コード0

**成果物:** `src/scripts/validate-archive.ts`

---

### タスク6: S3アップロードスクリプト

**目的:** GitHub Actions Staging Workflowで使用
**依存関係:** タスク3

- [ ] `src/scripts/upload-to-s3.ts` 作成
  - [ ] 新規archiveディレクトリ検出
  - [ ] 画像アップロード
    - [ ] `archives/{YYYY}/{MM}/{DD-MSG}/assets/*` を列挙
    - [ ] S3へアップロード（Key, ACL: public-read, ContentType自動判定）
  - [ ] 進捗表示（chalk）
  - [ ] エラーハンドリング（詳細ログ、終了コード1）

**成果物:** `src/scripts/upload-to-s3.ts`

---

### タスク7: テスト送信スクリプト

**目的:** GitHub Actions Staging Workflowで使用
**依存関係:** タスク3, タスク6

- [ ] `src/scripts/send-test-email.ts` 作成
  - [ ] 新規archiveディレクトリ検出
  - [ ] React → HTML変換（@react-email/render）
  - [ ] 画像パス置換（`/mail-assets/` → S3 URL）
  - [ ] テストメール送信
    - [ ] 宛先: REVIEWER_EMAIL
    - [ ] 件名: `[TEST] {config.json の subject}`
    - [ ] 本文: 生成されたHTML
  - [ ] 結果出力（送信ID、成功/失敗ログ）

**成果物:** `src/scripts/send-test-email.ts`

---

### タスク8: 本番配信スクリプト

**目的:** GitHub Actions Production Workflowで使用
**依存関係:** タスク3, タスク7

- [ ] `src/scripts/send-production-email.ts` 作成
  - [ ] 新規archiveディレクトリ検出
  - [ ] React → HTML変換（タスク7同様）
  - [ ] 本番配信
    - [ ] config.json から audienceId 読み込み
    - [ ] Resend API で一斉送信
  - [ ] config.json更新
    - [ ] sentAt に送信日時（ISO 8601）記録
    - [ ] ファイル書き込み
    - [ ] Git commit & push
  - [ ] 結果出力（送信ID、配信件数、成功/失敗ログ）

**成果物:** `src/scripts/send-production-email.ts`

---

### タスク9: GitHub Actions Workflows作成

**目的:** CI/CDパイプライン構築
**依存関係:** タスク5, タスク6, タスク7, タスク8

- [ ] `.github/workflows/check.yml` 作成
  - [ ] Trigger: push to main, feature/**
  - [ ] Jobs: Setup Node.js, npm ci, lint, type-check, build, validate-archive
  - [ ] 環境変数: RESEND_API_KEY
- [ ] `.github/workflows/staging.yml` 作成
  - [ ] Trigger: pull_request (opened, synchronize)
  - [ ] Jobs: Setup Node.js, npm ci, upload-to-s3, send-test-email
  - [ ] 環境変数: AWS_*, S3_*, RESEND_API_KEY, REVIEWER_EMAIL
- [ ] `.github/workflows/production.yml` 作成
  - [ ] Trigger: push to main（マージ後）
  - [ ] Environment: production（Protection Rules設定）
  - [ ] Jobs: Manual Approval待機, Setup Node.js, npm ci, send-production-email
  - [ ] 環境変数: Staging同様
- [ ] `package.json` の `scripts` に追加
  - [ ] `lint`: `next lint`
  - [ ] `type-check`: `tsc --noEmit`

**成果物:** `check.yml`, `staging.yml`, `production.yml`, `package.json`（scripts更新）

---

### タスク10: ShadcnUI導入（任意）

**目的:** UIコンポーネントライブラリの追加
**依存関係:** タスク2

- [ ] ShadcnUI初期化（`npx shadcn-ui@latest init`）
- [ ] 必要なコンポーネント追加（例: Button, Card）
- [ ] `src/app/draft/page.tsx` でShadcnUIコンポーネント使用例追加

**成果物:** `components/ui/*`, `components.json`

**備考:** メールHTML内では使用しない（Reactコンポーネントとして使用）

---

### タスク11: ドキュメント更新

**目的:** 実装内容の知見をドキュメント化
**依存関係:** タスク1〜10完了後

- [ ] `docs/specs/task.md` 作成（本タスクリスト）
- [ ] `docs/INDEX.md` 更新（task.mdへのリンク追加）
- [ ] `README.md` 更新
  - [ ] プロジェクト概要
  - [ ] セットアップ手順
  - [ ] 使い方（npm run dev, npm run commit）

**成果物:** `task.md`, `INDEX.md`（更新）, `README.md`（更新）

---

## 進捗管理

- **現在のフェーズ:** タスク11（ドキュメント更新）の一部完了
  - ✅ `docs/specs/task.md` 作成済み
  - 🔄 `docs/INDEX.md` 更新予定
  - 🔄 `README.md` 更新予定

- **次のステップ:** タスク1（プロジェクト初期化）から実装開始

---

## 参考リンク

- **要件定義書:** `docs/specs/require.md`
- **実装計画:** `/Users/m-yamashita/.claude/plans/peaceful-gliding-pillow.md`
- **ブランチ戦略:** `docs/dev/branch.md`
- **ドキュメント索引:** `docs/INDEX.md`
