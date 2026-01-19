/**
 * lightningcss のネイティブバイナリへのシンボリックリンクを作成するスクリプト
 * 
 * pnpm のシンボリックリンク構造により、lightningcss パッケージが
 * optionalDependencies の lightningcss-linux-arm64-gnu のバイナリを
 * 見つけられない場合があるため、明示的にシンボリックリンクを作成する
 */

const fs = require('fs');
const path = require('path');

const platform = process.platform;
const arch = process.arch;

// プラットフォーム固有のバイナリ名を決定
let binaryName;
if (platform === 'linux') {
  if (arch === 'arm64') {
    // Linux ARM64 の場合は gnu をデフォルトとする（musl の場合は手動で対応が必要）
    binaryName = 'lightningcss.linux-arm64-gnu.node';
  } else if (arch === 'arm') {
    binaryName = 'lightningcss.linux-arm-gnueabihf.node';
  } else {
    // Linux x64 の場合は gnu をデフォルトとする（musl の場合は手動で対応が必要）
    binaryName = 'lightningcss.linux-x64-gnu.node';
  }
} else if (platform === 'darwin') {
  binaryName = arch === 'arm64' 
    ? 'lightningcss.darwin-arm64.node'
    : 'lightningcss.darwin-x64.node';
} else if (platform === 'win32') {
  binaryName = arch === 'arm64'
    ? 'lightningcss.win32-arm64-msvc.node'
    : 'lightningcss.win32-x64-msvc.node';
} else {
  console.log(`Unsupported platform: ${platform}-${arch}`);
  process.exit(0);
}

// lightningcss パッケージのディレクトリを探す
const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
const lightningcssPath = path.join(nodeModulesPath, 'lightningcss');

// pnpm の場合は .pnpm ディレクトリ内を探す
let lightningcssDir;
if (fs.existsSync(lightningcssPath)) {
  lightningcssDir = lightningcssPath;
} else {
  // .pnpm ディレクトリ内を検索
  const pnpmPath = path.join(nodeModulesPath, '.pnpm');
  if (fs.existsSync(pnpmPath)) {
    const entries = fs.readdirSync(pnpmPath, { withFileTypes: true });
    const lightningcssEntry = entries.find(
      entry => entry.isDirectory() && entry.name.startsWith('lightningcss@')
    );
    if (lightningcssEntry) {
      lightningcssDir = path.join(
        pnpmPath,
        lightningcssEntry.name,
        'node_modules',
        'lightningcss'
      );
    }
  }
}

if (!lightningcssDir || !fs.existsSync(lightningcssDir)) {
  console.log('lightningcss package not found, skipping fix');
  process.exit(0);
}

// バイナリファイルを探す
let binaryPath;
const optionalPkgName = binaryName.replace('.node', '').replace(/\./g, '-');

// まず、optionalDependencies のパッケージを探す
const optionalPkgPath = path.join(nodeModulesPath, optionalPkgName);
if (fs.existsSync(optionalPkgPath)) {
  binaryPath = path.join(optionalPkgPath, binaryName);
} else {
  // .pnpm ディレクトリ内を検索
  const pnpmPath = path.join(nodeModulesPath, '.pnpm');
  if (fs.existsSync(pnpmPath)) {
    const entries = fs.readdirSync(pnpmPath, { withFileTypes: true });
    const optionalPkgEntry = entries.find(
      entry => entry.isDirectory() && entry.name.startsWith(`${optionalPkgName}@`)
    );
    if (optionalPkgEntry) {
      binaryPath = path.join(
        pnpmPath,
        optionalPkgEntry.name,
        'node_modules',
        optionalPkgName,
        binaryName
      );
    }
  }
}

if (!binaryPath || !fs.existsSync(binaryPath)) {
  console.log(`Binary ${binaryName} not found, skipping fix`);
  process.exit(0);
}

// シンボリックリンクを作成
const linkPath = path.join(lightningcssDir, binaryName);
try {
  // 既存のリンクやファイルを削除
  if (fs.existsSync(linkPath)) {
    try {
      const stats = fs.lstatSync(linkPath);
      if (stats.isSymbolicLink() || stats.isFile()) {
        fs.unlinkSync(linkPath);
      }
    } catch (unlinkError) {
      // 削除に失敗した場合は続行（権限の問題など）
      console.log(`Warning: Could not remove existing file: ${unlinkError.message}`);
    }
  }
  
  // 相対パスでシンボリックリンクを作成
  const relativePath = path.relative(lightningcssDir, binaryPath);
  
  // 既に正しいリンクが存在するか確認
  if (fs.existsSync(linkPath)) {
    try {
      const existingLink = fs.readlinkSync(linkPath);
      const expectedRelativePath = path.relative(lightningcssDir, binaryPath);
      if (existingLink === expectedRelativePath || existingLink === binaryPath) {
        console.log(`✓ Symlink already exists and is correct: ${linkPath}`);
        process.exit(0);
      }
    } catch (e) {
      // 読み取りに失敗した場合は続行
    }
  }
  
  fs.symlinkSync(relativePath, linkPath);
  console.log(`✓ Created symlink: ${linkPath} -> ${relativePath}`);
} catch (error) {
  // 既に正しいリンクが存在する場合はエラーを無視
  if (error.code === 'EEXIST') {
    try {
      const existingLink = fs.readlinkSync(linkPath);
      const expectedRelativePath = path.relative(lightningcssDir, binaryPath);
      if (existingLink === expectedRelativePath || existingLink === binaryPath) {
        console.log(`✓ Symlink already exists and is correct: ${linkPath}`);
        process.exit(0);
      }
    } catch (e) {
      // 読み取りに失敗した場合は続行
    }
  }
  console.error(`Failed to create symlink: ${error.message}`);
  process.exit(1);
}

