// src/bgfade.ts
var DEFAULT_SPEED = 3;
var DEFAULT_DURATION = 4;
var DEFAULT_SELECTOR = "li";
var DEFAULT_ACTIVE_CLASS = "bg-active";
var normalizeNumber = (value, defaultValue) => {
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? defaultValue : Math.abs(numberValue);
};
var normalizeOptions = (options = {}) => ({
  speed: normalizeNumber(options.speed, DEFAULT_SPEED),
  duration: normalizeNumber(options.duration, DEFAULT_DURATION),
  selector: options.selector || DEFAULT_SELECTOR,
  activeClass: options.activeClass || DEFAULT_ACTIVE_CLASS,
  autoStart: options.autoStart !== false
});
var resolveTarget = (target) => {
  if (typeof target !== "string") {
    return target;
  }
  const element = document.getElementById(target);
  if (!element) {
    throw new Error(`bgfade target element was not found: ${target}`);
  }
  return element;
};
var BgFade = class {
  constructor(target, options) {
    this.animationTimer = null;
    this.fadeTimer = null;
    this.active = false;
    this.current = -1;
    this.options = normalizeOptions(options);
    this.target = resolveTarget(target);
    this.items = Array.from(
      this.target.querySelectorAll(this.options.selector)
    );
    if (this.items.length === 0) {
      throw new Error(`bgfade target has no items: ${this.options.selector}`);
    }
    this.originalTargetPosition = this.target.style.position;
    this.originalItemStyles = this.items.map((item) => ({
      position: item.style.position,
      transitionDuration: item.style.transitionDuration,
      transitionProperty: item.style.transitionProperty,
      opacity: item.style.opacity,
      zIndex: item.style.zIndex
    }));
    this.setup();
    this.setActive(-1);
    if (this.options.autoStart) {
      this.start();
    }
  }
  get currentIndex() {
    return this.current;
  }
  get isRunning() {
    return this.active;
  }
  start() {
    if (this.active) {
      return;
    }
    this.active = true;
    this.animationTimer = setTimeout(() => {
      this.next();
    }, this.options.duration * 1e3);
  }
  stop() {
    this.active = false;
    this.clearTimers();
  }
  pause() {
    this.stop();
  }
  resume() {
    this.start();
  }
  next() {
    this.clearAnimationTimer();
    const next = this.getNextIndex();
    this.setActive(next);
    this.fadeOut(this.items[next], () => {
      if (next === 0) {
        this.items[next].style.zIndex = "0";
        this.items[next].style.opacity = "1";
      } else if (next + 1 >= this.items.length) {
        this.setZIndex();
        this.items.forEach((item) => {
          item.style.opacity = "1";
        });
      }
    });
    if (this.active) {
      this.animationTimer = setTimeout(() => {
        this.next();
      }, this.options.duration * 1e3);
    }
  }
  destroy() {
    this.stop();
    this.target.style.position = this.originalTargetPosition;
    this.items.forEach((item, index) => {
      const original = this.originalItemStyles[index];
      item.classList.remove(this.options.activeClass);
      item.style.position = original.position;
      item.style.transitionDuration = original.transitionDuration;
      item.style.transitionProperty = original.transitionProperty;
      item.style.opacity = original.opacity;
      item.style.zIndex = original.zIndex;
    });
  }
  setup() {
    this.target.style.position = "relative";
    this.setZIndex();
  }
  setFadeStyle(item) {
    item.style.transitionDuration = `${this.options.speed}s`;
    item.style.transitionProperty = "opacity";
    item.style.position = "absolute";
  }
  setZIndex() {
    const max = this.items.length;
    this.items.forEach((item, index) => {
      item.style.zIndex = String(max - index);
      this.setFadeStyle(item);
    });
  }
  getNextIndex() {
    this.current += 1;
    if (this.current >= this.items.length) {
      this.current = 0;
    }
    return this.current;
  }
  setActive(index) {
    let activeIndex = index + 1;
    if (activeIndex >= this.items.length) {
      activeIndex = 0;
    }
    this.items[activeIndex].classList.add(this.options.activeClass);
  }
  fadeOut(item, callback) {
    item.style.opacity = "0";
    this.clearFadeTimer();
    this.fadeTimer = setTimeout(() => {
      callback();
      item.classList.remove(this.options.activeClass);
      this.fadeTimer = null;
    }, this.options.speed * 1e3);
  }
  clearTimers() {
    this.clearAnimationTimer();
    this.clearFadeTimer();
  }
  clearAnimationTimer() {
    if (this.animationTimer !== null) {
      clearTimeout(this.animationTimer);
      this.animationTimer = null;
    }
  }
  clearFadeTimer() {
    if (this.fadeTimer !== null) {
      clearTimeout(this.fadeTimer);
      this.fadeTimer = null;
    }
  }
};
var createBgFade = (target, options) => new BgFade(target, options);
var bgfade_default = createBgFade;
export {
  createBgFade,
  bgfade_default as default
};
