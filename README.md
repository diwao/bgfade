# bgfade

[![Test](https://github.com/diwao/bgfade/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/diwao/bgfade/actions/workflows/test.yml)
[![npm version](https://img.shields.io/npm/v/bgfade.svg)](https://www.npmjs.com/package/bgfade)

bgfade switches DOM elements with a fade animation.

## Installation

```sh
npm install bgfade
```

## Usage

```html
<style>
  #target {
    height: 300px;
    list-style: none;
    width: 300px;
  }

  #target li {
    background-color: royalblue;
    font-size: 30px;
    height: 100%;
    text-align: center;
    width: 100%;
  }
</style>

<ul id="target">
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

```ts
import bgfade from 'bgfade';

const bg = bgfade('target');
```

You can also use the named export.

```ts
import { createBgFade } from 'bgfade';

const bg = createBgFade(document.getElementById('target')!);
```

## Options

```ts
bgfade('target', {
  speed: 3,
  duration: 4,
  selector: 'li',
  activeClass: 'bg-active',
  autoStart: true,
});
```

| option | type | default | description |
| ---- | ---- | ---- | ---- |
| `speed` | `number \| string` | `3` | Fade-out duration in seconds. |
| `duration` | `number \| string` | `4` | Time between fade steps in seconds. |
| `selector` | `string` | `li` | Selector for child elements to switch. |
| `activeClass` | `string` | `bg-active` | Class added to the next active item. |
| `autoStart` | `boolean` | `true` | Starts the animation automatically. |

`speed` and `duration` accept numbers and numeric strings in seconds. Negative values are converted to positive values; zero and fractional values remain supported. Non-numeric values, non-finite values (such as `Infinity`), and absolute values greater than `2147483.647` seconds use the corresponding default (`speed: 3`, `duration: 4`). This upper limit keeps timer delays within the signed 32-bit millisecond range so oversized delays cannot unexpectedly fire immediately.

## Instance API

```ts
const bg = bgfade('target', { autoStart: false });

bg.start();
bg.stop();
bg.next();
bg.destroy();
```

| method/property | description |
| ---- | ---- |
| `start()` | Starts the animation if it is stopped. |
| `stop()` | Stops scheduling future animation steps. Any in-flight fade continues until it finishes. |
| `pause()` | Alias of `stop()`. |
| `resume()` | Alias of `start()`. |
| `next()` | Advances one step manually. |
| `destroy()` | Stops the animation, clears in-flight fade timers, and restores styles/classes changed by bgfade. |
| `currentIndex` | Current fading item index. Initial value is `-1`. |
| `isRunning` | Whether the animation is currently running. |

## Notes

- The target element must exist.
- The target must have at least one item matching `selector`.
- bgfade sets inline styles on the target and each item during initialization.
- If `duration` is shorter than `speed`, the next step may begin before the current fade finishes.

## Dependency security

- Dependabot checks npm dependencies and GitHub Actions weekly on Monday at 09:00 JST and opens update pull requests against `dev`.
- The Dependency audit workflow checks the lockfile, including development dependencies, on pull requests, pushes, and manual runs. It fails on low or higher severity vulnerabilities and registry errors, without installing dependencies or running their lifecycle scripts.
- A weekly audit runs on Monday at 09:00 JST and checks `dev` for newly published advisories.
- To activate Dependabot and scheduled audits, these configuration files must also be merged into the repository's default branch. Dependabot security updates operate on the default branch; `target-branch: dev` directs version-update pull requests only.
- Review dependency-update pull requests and require successful tests and audits before merging. GitHub Actions use major-version tags such as `@v4`; Dependabot proposes version updates.
