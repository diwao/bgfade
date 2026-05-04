const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const rootDir = path.join(__dirname, '..');
const fixturePath = path.join(rootDir, 'test', 'types', 'cjs-require-classic.ts');
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bgfade-types-'));
const nodeModulesDir = path.join(tempDir, 'node_modules');
const packageLink = path.join(nodeModulesDir, 'bgfade');
const fixtureCopyPath = path.join(tempDir, 'cjs-require-classic.ts');
const tscPath = path.join(rootDir, 'node_modules', '.bin', 'tsc');

fs.mkdirSync(nodeModulesDir, { recursive: true });
fs.symlinkSync(rootDir, packageLink, 'dir');
fs.copyFileSync(fixturePath, fixtureCopyPath);

execFileSync(
  tscPath,
  [
    fixtureCopyPath,
    '--ignoreConfig',
    '--module',
    'commonjs',
    '--moduleResolution',
    'node',
    '--target',
    'es2020',
    '--strict',
    '--skipLibCheck',
    '--noEmit',
    '--ignoreDeprecations',
    '6.0',
  ],
  {
    stdio: 'inherit',
  },
);
