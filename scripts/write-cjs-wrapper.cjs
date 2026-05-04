const fs = require('node:fs');
const path = require('node:path');

const distDir = path.join(__dirname, '..', 'dist');
const cjsPath = path.join(distDir, 'bgfade.cjs');
const internalCjsPath = path.join(distDir, 'bgfade-module.cjs');

fs.renameSync(cjsPath, internalCjsPath);
fs.writeFileSync(
  cjsPath,
  `'use strict';

const mod = require('./bgfade-module.cjs');
const bgfade = mod.default || mod.createBgFade;

module.exports = bgfade;
module.exports.default = bgfade;
module.exports.createBgFade = mod.createBgFade || bgfade;
`,
);
