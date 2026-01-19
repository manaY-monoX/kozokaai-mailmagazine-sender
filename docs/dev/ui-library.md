# ダッシュボードUIライブラリ仕様書

## 概要

本ドキュメントは、**ダッシュボード（管理画面）用UIライブラリ**の仕様書です。Tailwind CSS 4.x + shadcn/ui パターンに基づくカスタムコンポーネント実装を定義します。

**重要**: このドキュメントはダッシュボード用のUIライブラリに特化しています。**メールテンプレート用のデザインシステムは `design-system.md` を参照してください。**

**技術スタック**
- Tailwind CSS 4.x (@tailwindcss/postcss)
- shadcn/ui パターン（カスタム実装）
- clsx + tailwind-merge (`cn()` ユーティリティ)
- React 19.2.3
- Next.js 16.1.0 (App Router)

**用途の明確化**
- ✅ **ダッシュボード（管理画面）**: このドキュメントのコンポーネントを使用
- ❌ **メールテンプレート**: `design-system.md` のインラインスタイルを使用

---

## アーキテクチャ概要

### UIライブラリの選定経緯

#### Mantine UI削除の経緯

**過去の試験的導入（2026-01-08 - 2026-01-16）**
- コミット `7f1c780e` で Mantine UI を導入
- Mantine UI 7.15.5 を使用
- 約1週間の試験運用

**削除理由**
- プロジェクトの要件（メールマガジン配信）に対して過剰な機能セット
- バンドルサイズの増加（不要な依存関係）
- カスタマイズの柔軟性が低い
- Tailwind CSS 4.x との統合が複雑

**現在のアプローチ（2026-01-16 以降）**
- Tailwind CSS 4.x + shadcn/ui パターンへ復帰
- 必要なコンポーネントのみをカスタム実装
- `cn()` ユーティリティによる柔軟なスタイリング
- 軽量で高速なバンドル

### ディレクトリ構造

```
src/components/
├── ui/                         # 汎用UIコンポーネント（shadcn/uiパターン）
│   ├── button.tsx              # Button（variant, size対応）
│   ├── card.tsx                # Card + サブコンポーネント
│   └── input.tsx               # Input（基本フォーム）
├── archive/                    # ドメイン固有コンポーネント
│   ├── ArchiveCard.tsx         # メールアーカイブカード
│   └── ArchiveFilters.tsx      # アーカイブフィルタリング
└── email/                      # メールテンプレート用コンポーネント
    ├── EmailWrapper.tsx        # メールレイアウト（table-based）
    └── Img.tsx                 # 画像パス解決
```

**関心の分離**
- **ui/**: 汎用的なUIコンポーネント（再利用性が高い）
- **archive/**: ドメイン固有のコンポーネント（ビジネスロジック含む）
- **email/**: メールテンプレート専用（インラインスタイル）

---

## 技術スタック詳細

### Tailwind CSS 4.x

**PostCSS統合（破壊的変更）**

Tailwind CSS 4.x では専用PostCSSプラグインが必須です。

**postcss.config.js**:
```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // 旧: tailwindcss: {}
    autoprefixer: {},
  },
};
```

**package.json**:
```json
{
  "dependencies": {
    "@tailwindcss/postcss": "4.1.18"
  },
  "devDependencies": {
    "tailwindcss": "4.1.18"
  }
}
```

### cn() ユーティリティ

**実装**: `src/lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**依存パッケージ**:
- **clsx** (2.1.1): 条件付きクラス名の結合
- **tailwind-merge** (3.4.0): Tailwindクラスの競合解決

**使用例**:
```tsx
<button
  className={cn(
    'base-classes',
    variant === 'primary' && 'primary-classes',
    variant === 'secondary' && 'secondary-classes',
    className // 外部からの追加クラス
  )}
>
  ボタン
</button>
```

**利点**:
- クラスの競合を自動解決（例: `p-4` + `p-2` → `p-2`）
- 条件付きクラスの簡潔な記述
- TypeScript型安全性

---

## 実装済みコンポーネント

### 1. Button

**ファイルパス**: `src/components/ui/button.tsx`

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}
```

**Variant仕様**:
- **default**: `bg-blue-600 text-white hover:bg-blue-700`
- **outline**: `border border-gray-300 bg-transparent hover:bg-gray-100`
- **ghost**: `bg-transparent hover:bg-gray-100`

**Size仕様**:
- **default**: `h-10 px-4 py-2`
- **sm**: `h-9 px-3`
- **lg**: `h-11 px-8`

**基本スタイル**:
- `inline-flex items-center justify-center`
- `rounded-md text-sm font-medium`
- `transition-colors`
- `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`
- `disabled:pointer-events-none disabled:opacity-50`

**使用例**:
```tsx
import { Button } from '@/components/ui/button';

// デフォルト
<Button>クリック</Button>

// アウトライン、小サイズ
<Button variant="outline" size="sm">
  キャンセル
</Button>

// カスタムクラス追加
<Button className="w-full">
  送信
</Button>
```

**ファイル参照**: `src/components/ui/button.tsx:1`

---

### 2. Card

**ファイルパス**: `src/components/ui/card.tsx`

**コンポーネント構成**:
- **Card**: ルートコンテナ
- **CardHeader**: ヘッダー領域
- **CardTitle**: タイトル（h3）
- **CardDescription**: サブテキスト
- **CardContent**: メインコンテンツ
- **CardFooter**: フッター領域

**スタイル仕様**:

**Card**:
- `rounded-lg border bg-white text-gray-950 shadow-sm`

**CardHeader**:
- `flex flex-col space-y-1.5 p-6`

**CardTitle**:
- `text-2xl font-semibold leading-none tracking-tight`

**CardDescription**:
- `text-sm text-gray-500`

**CardContent**:
- `p-6 pt-0`

**CardFooter**:
- `flex items-center p-6 pt-0`

**使用例**:
```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>カードタイトル</CardTitle>
    <CardDescription>カードの説明文</CardDescription>
  </CardHeader>
  <CardContent>
    <p>メインコンテンツ</p>
  </CardContent>
  <CardFooter>
    <Button>アクション</Button>
  </CardFooter>
</Card>
```

**ファイル参照**: `src/components/ui/card.tsx:1`

---

### 3. Input

**ファイルパス**: `src/components/ui/input.tsx`

**Props**:
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // 標準のHTMLInputElement属性をすべて継承
}
```

**スタイル仕様**:
- `flex h-10 w-full`
- `rounded-md border border-gray-300 bg-white`
- `px-3 py-2 text-sm`
- `placeholder:text-gray-400`
- `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2`
- `disabled:cursor-not-allowed disabled:opacity-50`

**使用例**:
```tsx
import { Input } from '@/components/ui/input';

// 基本
<Input placeholder="入力してください" />

// 検索
<Input
  type="search"
  placeholder="件名で検索..."
  className="max-w-md"
/>

// 制御コンポーネント
<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**ファイル参照**: `src/components/ui/input.tsx:1`

---

### 4. ArchiveCard

**ファイルパス**: `src/components/archive/ArchiveCard.tsx`

**用途**: メールアーカイブ一覧表示

**Props**:
```typescript
interface ArchiveCardProps {
  archive: MailArchive;
}

interface MailArchive {
  path: string;
  subject: string;
  createdAt: Date | string;
  sentAt: Date | string | null;
  audienceId: string;
}
```

**機能**:
- メールアーカイブの件名、作成日、送信日を表示
- 送信ステータスバッジ（送信済み: 緑、未送信: グレー）
- クリックで詳細ページへ遷移
- ホバーエフェクト（`hover:shadow-md transition-shadow`）

**スタイル仕様**:
- ベース: `Card` コンポーネント使用
- ステータスバッジ:
  - 送信済み: `bg-green-100 text-green-800`
  - 未送信: `bg-gray-100 text-gray-600`

**使用例**:
```tsx
import { ArchiveCard } from '@/components/archive/ArchiveCard';

<ArchiveCard archive={{
  path: '2026/01/19-example',
  subject: '【サマーセール】最大50%OFF',
  createdAt: new Date('2026-01-19'),
  sentAt: new Date('2026-01-20'),
  audienceId: 'aud_abc123',
}} />
```

**ファイル参照**: `src/components/archive/ArchiveCard.tsx:1`

---

### 5. ArchiveFilters

**ファイルパス**: `src/components/archive/ArchiveFilters.tsx`

**用途**: アーカイブ一覧のフィルタリングUI

**Props**:
```typescript
interface ArchiveFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  search: string;
  status: 'all' | 'sent' | 'unsent';
}
```

**機能**:
- 検索入力（件名で検索）
- ステータスフィルター（すべて / 送信済み / 未送信）
- Reactフック（`useState`）による状態管理

**スタイル仕様**:
- 検索入力: `Input` コンポーネント使用（`max-w-md`）
- ボタングループ: `Button` コンポーネント（variant: 'default' / 'outline'）

**使用例**:
```tsx
import { ArchiveFilters } from '@/components/archive/ArchiveFilters';

const [filters, setFilters] = useState<FilterState>({
  search: '',
  status: 'all',
});

<ArchiveFilters onFilterChange={setFilters} />
```

**ファイル参照**: `src/components/archive/ArchiveFilters.tsx:1`

---

## スタイリング戦略

### ダッシュボード vs メールテンプレート

**ダッシュボード（本ドキュメント）**:
- ✅ Tailwind CSSクラス使用
- ✅ `cn()` ユーティリティ使用
- ✅ Flexbox/Grid使用可能
- ✅ CSS変数使用可能
- ✅ shadcn/uiパターン準拠

**メールテンプレート（`design-system.md`）**:
- ❌ Tailwind CSSクラス使用不可
- ❌ `cn()` ユーティリティ使用不可
- ❌ Flexbox/Grid使用不可（メールクライアント非対応）
- ❌ CSS変数使用不可
- ✅ インラインスタイルのみ
- ✅ `<table>` タグレイアウト（EmailWrapper）

### カラーパレット

**プライマリカラー**:
- `blue-600` (#2563eb): CTAボタン、リンク
- `blue-700` (#1d4ed8): ホバー状態

**グレースケール**:
- `gray-50` (#f9fafb): 背景（サブ）
- `gray-100` (#f3f4f6): ホバー背景
- `gray-300` (#d1d5db): ボーダー
- `gray-400` (#9ca3af): プレースホルダー
- `gray-500` (#6b7280): サブテキスト
- `gray-600` (#4b5563): セカンダリテキスト
- `gray-950` (#030712): プライマリテキスト

**システムカラー**:
- `green-100` (#dcfce7): 成功バッジ背景
- `green-800` (#166534): 成功バッジテキスト
- `red-100` (#fee2e2): エラーバッジ背景
- `red-800` (#991b1b): エラーバッジテキスト

### スペーシングシステム

Tailwindのデフォルトスペーシング（0.25rem = 4px 単位）を使用:
- `space-y-1.5`: 0.375rem (6px)
- `p-2`: 0.5rem (8px)
- `p-3`: 0.75rem (12px)
- `p-4`: 1rem (16px)
- `p-6`: 1.5rem (24px)
- `gap-2`: 0.5rem (8px)
- `gap-4`: 1rem (16px)

### Border Radius

- `rounded-md`: 0.375rem (6px) - ボタン、入力欄
- `rounded-lg`: 0.5rem (8px) - カード
- `rounded-full`: 9999px - バッジ、アバター

---

## ベストプラクティス

### コンポーネント設計

#### ✅ 推奨

**1. React.forwardRef を使用**
```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={cn(...)} {...props} />;
  }
);
Button.displayName = 'Button';
```

**理由**:
- ref転送によるDOM操作の柔軟性
- サードパーティライブラリとの統合性向上
- DevToolsでのコンポーネント名表示

**2. cn() ユーティリティで基本スタイルと外部スタイルを結合**
```tsx
className={cn('base-classes', className)}
```

**理由**:
- クラスの競合を自動解決
- カスタマイズ性の向上
- コンポーネント再利用性の向上

**3. variant/size パターンの使用**
```tsx
const variantStyles = {
  default: 'bg-blue-600 text-white',
  outline: 'border border-gray-300',
};

const sizeStyles = {
  sm: 'h-9 px-3',
  default: 'h-10 px-4',
};

className={cn(variantStyles[variant], sizeStyles[size])}
```

**理由**:
- 一貫性のあるデザインシステム
- 型安全性（TypeScript）
- 拡張性の高い設計

**4. TypeScript型定義の継承**
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}
```

**理由**:
- すべての標準HTML属性が使用可能
- IDE補完の恩恵
- 型安全性の向上

#### ❌ 非推奨

**1. インラインスタイルの使用（ダッシュボードでは）**
```tsx
// ❌ 非推奨
<button style={{ backgroundColor: '#2563eb' }}>ボタン</button>

// ✅ 推奨
<Button>ボタン</Button>
```

**理由**:
- Tailwindのユーティリティクラスが活用できない
- スタイルの再利用性が低い
- デザインシステムの一貫性が損なわれる

**注意**: メールテンプレート（`src/app/draft/page.tsx`）ではインラインスタイルが必須です。

**2. 固定値のハードコーディング**
```tsx
// ❌ 非推奨
<div className="w-[237px] h-[42px]">...</div>

// ✅ 推奨
<div className="w-60 h-10">...</div>
```

**理由**:
- Tailwindのスペーシングシステムとの不整合
- デザインシステムの一貫性が損なわれる
- レスポンシブ対応が困難

**3. 過剰なコンポーネント抽象化**
```tsx
// ❌ 非推奨（3行のためにコンポーネント作成）
const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="text-sm text-gray-500">{children}</span>
);

// ✅ 推奨（直接記述）
<span className="text-sm text-gray-500">ラベル</span>
```

**理由**:
- 不要な抽象化は複雑性を増す
- パフォーマンスへの影響
- コードの可読性低下

**例外**: 3回以上使用される場合は抽象化を検討

---

## トラブルシューティング

### 1. Tailwind CSSクラスが適用されない

**症状**:
```tsx
<div className="bg-blue-600">...</div>
// 背景色が適用されない
```

**原因**:
- PostCSS設定が正しくない
- `@tailwindcss/postcss` プラグインが未インストール

**解決策**:
```bash
# パッケージ確認
pnpm list @tailwindcss/postcss

# 再インストール
pnpm install -D @tailwindcss/postcss tailwindcss
```

**postcss.config.js 確認**:
```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // 必須
    autoprefixer: {},
  },
};
```

---

### 2. cn() ユーティリティが未定義

**症状**:
```tsx
import { cn } from '@/lib/utils';
// Error: Cannot find module '@/lib/utils'
```

**原因**:
- `src/lib/utils.ts` が存在しない
- パスエイリアス設定が正しくない

**解決策**:
```bash
# ファイル確認
ls src/lib/utils.ts

# パスエイリアス確認（tsconfig.json）
cat tsconfig.json | grep "@/lib"
```

**tsconfig.json 設定**:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### 3. クラスの競合が解決されない

**症状**:
```tsx
<Button className="p-2">ボタン</Button>
// p-4（デフォルト）と p-2 の両方が適用される
```

**原因**:
- `cn()` ユーティリティが正しく実装されていない
- `tailwind-merge` が未インストール

**解決策**:
```bash
# パッケージ確認
pnpm list tailwind-merge clsx

# 再インストール
pnpm install tailwind-merge clsx
```

**utils.ts 確認**:
```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));  // 必須
}
```

---

### 4. TypeScript型エラー

**症状**:
```tsx
<Button asChild>...</Button>
// Error: Property 'asChild' does not exist on type 'ButtonProps'
```

**原因**:
- `asChild` プロパティは過去のバージョンで削除された
- 古いサンプルコードを使用している

**解決策**:
```tsx
// ❌ 旧バージョン
<Button asChild>
  <Link href="/path">リンク</Link>
</Button>

// ✅ 現在のバージョン
<Link href="/path">
  <Button>リンク</Button>
</Link>
```

**参考**: `docs/ops/security-updates.md` の React2Shell 脆弱性対応セクション

---

## 新規コンポーネント追加手順

### 1. コンポーネントファイル作成

**ファイルパス**: `src/components/ui/{component-name}.tsx`

**テンプレート**:
```tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ComponentNameProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary';
  // カスタムプロパティ
}

const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'default-classes',
      secondary: 'secondary-classes',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'base-classes',
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
ComponentName.displayName = 'ComponentName';

export { ComponentName };
```

---

### 2. TypeScript型定義

**重要事項**:
- `React.forwardRef` の型パラメータを正確に指定
- 適切なHTML要素の型を継承（`HTMLButtonElement`, `HTMLDivElement` など）
- `displayName` を必ず設定（DevTools用）

---

### 3. スタイリングガイドライン

**基本原則**:
- `cn()` ユーティリティを使用
- 基本スタイル + variant スタイル + 外部スタイルの順
- Tailwindのユーティリティクラスのみ使用（カスタムCSSは避ける）

**カラーパレット**:
- プライマリ: `blue-600`, `blue-700`
- グレースケール: `gray-50` ~ `gray-950`
- システムカラー: `green-*`, `red-*`, `yellow-*`

**スペーシング**:
- Tailwindのデフォルトスケール使用（4px単位）
- 固定値（`w-[237px]`）は避ける

---

### 4. テスト・確認

**チェックリスト**:
- [ ] TypeScript型エラーがないことを確認（`pnpm run type-check`）
- [ ] ESLintエラーがないことを確認（`pnpm run lint`）
- [ ] ブラウザで表示確認（`pnpm run dev`）
- [ ] variant/size すべてのパターンを確認
- [ ] ホバー/フォーカス状態を確認
- [ ] レスポンシブ対応を確認

---

### 5. ドキュメント更新

**更新対象**:
- **本ドキュメント（`docs/dev/ui-library.md`）**: 実装済みコンポーネントセクションに追加
- **`docs/INDEX.md`**: 必要に応じて更新（大きな変更の場合）

**コミットメッセージ**:
```bash
FEAT: Add {ComponentName} component

- Add {ComponentName} component with variant support
- Update docs/dev/ui-library.md

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## 参考リンク

- [Tailwind CSS 4.x Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [React forwardRef](https://react.dev/reference/react/forwardRef)
- [clsx Documentation](https://github.com/lukeed/clsx)
- [tailwind-merge Documentation](https://github.com/dcastil/tailwind-merge)

---

## ファイル参照

### UIコンポーネント
- Button: `src/components/ui/button.tsx:1`
- Card: `src/components/ui/card.tsx:1`
- Input: `src/components/ui/input.tsx:1`

### ドメインコンポーネント
- ArchiveCard: `src/components/archive/ArchiveCard.tsx:1`
- ArchiveFilters: `src/components/archive/ArchiveFilters.tsx:1`

### ユーティリティ
- cn(): `src/lib/utils.ts:1`

### 関連ドキュメント
- メールテンプレート用デザインシステム: `docs/dev/design-system.md`
- プロジェクト概要: `CLAUDE.md`
- セキュリティアップデート履歴: `docs/ops/security-updates.md`

---

## 更新履歴

- **2026-01-19**: 初版作成
  - ダッシュボード用UIライブラリの完全ドキュメント化
  - Mantine UI削除の経緯を記載
  - Tailwind CSS 4.x + shadcn/ui パターンの実装詳細を追加
  - 実装済みコンポーネント（Button, Card, Input, ArchiveCard, ArchiveFilters）の仕様書
  - メールテンプレートとの使い分けを明確化
  - 新規コンポーネント追加手順を追加

---

最終更新日: 2026-01-19
