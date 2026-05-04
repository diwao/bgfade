declare function bgfade(
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
