type BgFadeTarget = string | HTMLElement;
interface BgFadeOptions {
    speed?: number | string;
    duration?: number | string;
    selector?: string;
    activeClass?: string;
    autoStart?: boolean;
}
interface BgFadeInstance {
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
declare const createBgFade: (target: BgFadeTarget, options?: BgFadeOptions) => BgFadeInstance;

export { type BgFadeInstance, type BgFadeOptions, type BgFadeTarget, createBgFade, createBgFade as default };
