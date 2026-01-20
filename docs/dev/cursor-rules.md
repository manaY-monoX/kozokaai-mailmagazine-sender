# Cursor IDE ルールファイル設定ガイド

## 概要

このプロジェクトでは、Cursor IDE（AI統合IDE）でメールデザインを行う際に、AIに守ってほしいルールやデザイン制約を `.cursor/rules/` ディレクトリに設定しています。

## ルールファイル構成

### .cursor/rules/ ディレクトリ

```
.cursor/
└── rules/
    ├── email-design.mdc       # メールHTML互換性ルール
    ├── components.mdc         # コンポーネント使用ルール
    ├── coding-standards.mdc   # 厳格なコーディング規約
    ├── assets.mdc             # 画像・アセット管理ルール
    └── colors.mdc             # カラーパレットルール
```

### 各ルールファイルの役割

#### 1. email-design.mdc
- テーブルレイアウト必須
- インラインスタイル必須
- flexbox/grid禁止
- メールクライアント互換性ルール

#### 2. components.mdc
- EmailWrapper/EmailFooter必須使用
- Imgコンポーネント必須使用
- 配信停止リンク保護（法的要件）

#### 3. coding-standards.mdc
- TypeScript strict モード
- 関数20行以内
- Early returnパターン
- JSDocコメント必須

#### 4. assets.mdc
- 画像配置ルール（`public/mail-assets/`）
- alt属性必須
- ファイル命名規則

#### 5. colors.mdc
- プロジェクトカラーパレット
- Blue（#2563eb）、Slate系（#f8fafc～#0f172a）
- カスタムカラー追加手順

## Cursor IDE での使用方法

### ルールの適用

Cursor IDE は `.cursor/rules/` ディレクトリの `.mdc` ファイルを自動的に読み込みます。AIチャット、コード補完、リファクタリング提案などで、これらのルールが適用されます。

### ルールの確認

Cursor IDE の設定画面から「Rules for AI」セクションでプロジェクトルールを確認できます。

### ルールの更新

`.cursor/rules/*.mdc` ファイルを編集すると、Cursor IDE が自動的に反映します。

## ルール追加・更新手順

1. 該当する `.mdc` ファイルを編集（または新規作成）
2. Markdown形式でルールを記述
3. Git commit: `DOC: Cursor AIルールを更新`
4. Push後、チームメンバーと共有

## ベストプラクティス

### ルール記述のコツ

#### 具体的で実行可能
❌ 「良いコードを書け」（曖昧）
✅ 「関数は20行以内、すべてのパラメータに型注釈を付ける」（具体的）

#### 例を含める
正しい実装例（✅）と間違った実装例（❌）を併記する

#### カテゴリ別に整理
関連するルールをセクションごとにまとめる

### メンテナンス

#### 定期的な見直し
- プロジェクトの成長に合わせてルールを更新
- 不要になったルールは削除
- 新しいベストプラクティスを追加

#### チーム共有
- ルール変更時はチームに通知
- レビュー時にルール遵守を確認

## トラブルシューティング

### Cursor IDEがルールを認識しない

1. `.cursor/rules/` ディレクトリが存在するか確認
2. ファイル拡張子が `.mdc` であることを確認
3. Cursor IDEを再起動

### ルールが適用されない

1. Cursor IDEの設定で「Rules for AI」が有効か確認
2. `.mdc` ファイルのMarkdown形式が正しいか確認
3. Cursor IDEのバージョンを最新に更新

## 参考リンク

- [Cursor公式ドキュメント - Rules](https://cursor.com/docs/context/rules)
- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules): 130+のルールテンプレート集
- [プロジェクトCLAUDE.md](../../CLAUDE.md): プロジェクト全体のルール

---

最終更新日: 2026-01-20
