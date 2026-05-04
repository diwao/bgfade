const fs = require('node:fs');
const path = require('node:path');

const distDir = path.join(__dirname, '..', 'dist');
const cjsPath = path.join(distDir, 'bgfade.cjs');
const cjsTypesPath = path.join(distDir, 'bgfade.d.cts');
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

fs.writeFileSync(
  cjsTypesPath,
  `declare function bgfade(
  target: bgfade.BgFadeTarget,
  options?: bgfade.BgFadeOptions,
): bgfade.BgFadeInstance;

declare namespace bgfade {
  export { bgfade as default };

  export type BgFadeTarget = string | HTMLElement;

  export interface BgFadeOptions {
    speed?: number | string;
    duration?: number | string;
    selector?: string;
    activeClass?: string;
    autoStart?: boolean;
  }

  export interface BgFadeInstance {
    readonly target: HTMLElement;
    readonly items: HTMLElement[];
    readonly currentIndex: number;
    readonly isRunning: boolean;
    start(): void;
    stop(): void;
    pause(): void;
    resume(): void;
    next(): void;
    destroy(): void;
  }

  export const createBgFade: typeof bgfade;
}

export = bgfade;
`,
);
