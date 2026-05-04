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

interface NormalizedOptions {
  speed: number;
  duration: number;
  selector: string;
  activeClass: string;
  autoStart: boolean;
}

interface StoredStyle {
  position: string;
  transitionDuration: string;
  transitionProperty: string;
  opacity: string;
  zIndex: string;
  hadActiveClass: boolean;
}

const DEFAULT_SPEED = 3;
const DEFAULT_DURATION = 4;
const DEFAULT_SELECTOR = 'li';
const DEFAULT_ACTIVE_CLASS = 'bg-active';

const normalizeNumber = (value: unknown, defaultValue: number): number => {
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? defaultValue : Math.abs(numberValue);
};

const normalizeOptions = (options: BgFadeOptions = {}): NormalizedOptions => ({
  speed: normalizeNumber(options.speed, DEFAULT_SPEED),
  duration: normalizeNumber(options.duration, DEFAULT_DURATION),
  selector: options.selector ?? DEFAULT_SELECTOR,
  activeClass: options.activeClass ?? DEFAULT_ACTIVE_CLASS,
  autoStart: options.autoStart !== false,
});

const resolveTarget = (target: BgFadeTarget): HTMLElement => {
  if (typeof target !== 'string') {
    if (typeof HTMLElement === 'undefined' || !(target instanceof HTMLElement)) {
      throw new Error('bgfade target must be an HTMLElement or element id');
    }

    return target;
  }

  const element = document.getElementById(target);
  if (!element) {
    throw new Error(`bgfade target element was not found: ${target}`);
  }

  return element;
};

class BgFade implements BgFadeInstance {
  readonly target: HTMLElement;
  readonly items: HTMLElement[];

  private readonly options: NormalizedOptions;
  private readonly originalTargetPosition: string;
  private readonly originalItemStyles: StoredStyle[];
  private animationTimer: ReturnType<typeof setTimeout> | null = null;
  private fadeTimers = new Set<ReturnType<typeof setTimeout>>();
  private active = false;
  private current = -1;

  constructor(target: BgFadeTarget, options?: BgFadeOptions) {
    this.options = normalizeOptions(options);
    if (this.options.activeClass === '') {
      throw new Error('bgfade activeClass must not be empty');
    }

    this.target = resolveTarget(target);
    try {
      this.items = Array.from(
        this.target.querySelectorAll<HTMLElement>(this.options.selector),
      );
    } catch {
      throw new Error(`bgfade selector is invalid: ${this.options.selector}`);
    }

    if (this.items.length === 0) {
      throw new Error(`bgfade target has no items: ${this.options.selector}`);
    }

    this.originalTargetPosition = this.target.style.position;
    this.originalItemStyles = this.items.map((item) => ({
      position: item.style.position,
      transitionDuration: item.style.transitionDuration,
      transitionProperty: item.style.transitionProperty,
      opacity: item.style.opacity,
      zIndex: item.style.zIndex,
      hadActiveClass: item.classList.contains(this.options.activeClass),
    }));

    this.setup();
    this.setActive(-1);

    if (this.options.autoStart) {
      this.active = true;
      this.scheduleNext();
    }
  }

  get currentIndex(): number {
    return this.current;
  }

  get isRunning(): boolean {
    return this.active;
  }

  start(): void {
    if (this.active) {
      return;
    }

    this.active = true;
    this.next();
  }

  stop(): void {
    this.active = false;
    this.clearAnimationTimer();
  }

  pause(): void {
    this.stop();
  }

  resume(): void {
    this.start();
  }

  next(): void {
    this.clearAnimationTimer();

    const next = this.getNextIndex();
    this.setActive(next);
    this.fadeOut(this.items[next], () => {
      if (next === 0) {
        this.items[next].style.zIndex = '0';
        this.items[next].style.opacity = '1';
      } else if (next + 1 >= this.items.length) {
        this.setZIndex();
        this.items.forEach((item) => {
          item.style.opacity = '1';
        });
      }
    });

    if (this.active) {
      this.scheduleNext();
    }
  }

  destroy(): void {
    this.stop();
    this.clearFadeTimer();
    this.target.style.position = this.originalTargetPosition;
    this.items.forEach((item, index) => {
      const original = this.originalItemStyles[index];
      if (!original.hadActiveClass) {
        item.classList.remove(this.options.activeClass);
      }
      item.style.position = original.position;
      item.style.transitionDuration = original.transitionDuration;
      item.style.transitionProperty = original.transitionProperty;
      item.style.opacity = original.opacity;
      item.style.zIndex = original.zIndex;
    });
  }

  private setup(): void {
    this.target.style.position = 'relative';
    this.setZIndex();
  }

  private setFadeStyle(item: HTMLElement): void {
    item.style.transitionDuration = `${this.options.speed}s`;
    item.style.transitionProperty = 'opacity';
    item.style.position = 'absolute';
  }

  private setZIndex(): void {
    const max = this.items.length;
    this.items.forEach((item, index) => {
      item.style.zIndex = String(max - index);
      this.setFadeStyle(item);
    });
  }

  private getNextIndex(): number {
    this.current += 1;
    if (this.current >= this.items.length) {
      this.current = 0;
    }

    return this.current;
  }

  private setActive(index: number): void {
    let activeIndex = index + 1;
    if (activeIndex >= this.items.length) {
      activeIndex = 0;
    }

    this.items[activeIndex].classList.add(this.options.activeClass);
  }

  private fadeOut(item: HTMLElement, callback: () => void): void {
    item.style.opacity = '0';
    const fadeTimer = setTimeout(() => {
      callback();
      item.classList.remove(this.options.activeClass);
      this.fadeTimers.delete(fadeTimer);
    }, this.options.speed * 1000);
    this.fadeTimers.add(fadeTimer);
  }

  private scheduleNext(): void {
    this.animationTimer = setTimeout(() => {
      this.next();
    }, this.options.duration * 1000);
  }

  private clearAnimationTimer(): void {
    if (this.animationTimer !== null) {
      clearTimeout(this.animationTimer);
      this.animationTimer = null;
    }
  }

  private clearFadeTimer(): void {
    this.fadeTimers.forEach((fadeTimer) => {
      clearTimeout(fadeTimer);
    });
    this.fadeTimers.clear();
  }
}

export const createBgFade = (
  target: BgFadeTarget,
  options?: BgFadeOptions,
): BgFadeInstance => new BgFade(target, options);

export default createBgFade;
