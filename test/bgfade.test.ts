import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import bgfade, { createBgFade } from '../src/bgfade';

const createList = (id = 'target'): HTMLElement => {
  document.body.innerHTML = `
    <ul id="${id}">
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>
  `;

  return document.getElementById(id)!;
};

describe('bgfade', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('sets up the target and item styles with defaults', () => {
    const target = createList();

    const instance = bgfade('target', { autoStart: false });
    const items = Array.from(target.querySelectorAll<HTMLElement>('li'));

    expect(instance.target).toBe(target);
    expect(instance.items).toHaveLength(3);
    expect(target.style.position).toBe('relative');
    expect(items.map((item) => item.style.position)).toEqual([
      'absolute',
      'absolute',
      'absolute',
    ]);
    expect(items.map((item) => item.style.zIndex)).toEqual(['3', '2', '1']);
    expect(items[0].style.transitionDuration).toBe('3s');
    expect(items[0].style.transitionProperty).toBe('opacity');
    expect(items[0].classList.contains('bg-active')).toBe(true);
  });

  it('normalizes invalid and negative options like the previous implementation', () => {
    createList();

    const instance = bgfade('target', {
      speed: -2,
      duration: 'bad-value',
      autoStart: false,
    });

    expect(instance.items[0].style.transitionDuration).toBe('2s');
  });

  it('automatically advances after the duration', () => {
    const target = createList();
    const items = Array.from(target.querySelectorAll<HTMLElement>('li'));

    const instance = bgfade('target', { speed: 1, duration: 2 });

    expect(instance.isRunning).toBe(true);
    vi.advanceTimersByTime(2000);

    expect(instance.currentIndex).toBe(0);
    expect(items[0].style.opacity).toBe('0');
    expect(items[1].classList.contains('bg-active')).toBe(true);

    vi.advanceTimersByTime(1000);

    expect(items[0].classList.contains('bg-active')).toBe(false);
    expect(items[0].style.opacity).toBe('1');
    expect(items[0].style.zIndex).toBe('0');
  });

  it('stops and resumes animation', () => {
    createList();

    const instance = bgfade('target', { speed: 1, duration: 2 });
    instance.stop();

    expect(instance.isRunning).toBe(false);
    vi.advanceTimersByTime(2000);
    expect(instance.currentIndex).toBe(-1);

    instance.start();
    expect(instance.isRunning).toBe(true);
    expect(instance.currentIndex).toBe(0);

    vi.advanceTimersByTime(2000);

    expect(instance.currentIndex).toBe(1);
  });

  it('lets an in-flight fade finish after stop', () => {
    const target = createList();
    const items = Array.from(target.querySelectorAll<HTMLElement>('li'));

    const instance = bgfade('target', {
      speed: 2,
      duration: 4,
      autoStart: false,
    });

    instance.next();
    vi.advanceTimersByTime(1000);
    instance.stop();
    vi.advanceTimersByTime(1000);

    expect(instance.isRunning).toBe(false);
    expect(items[0].classList.contains('bg-active')).toBe(false);
    expect(items[0].style.opacity).toBe('1');
    expect(items[0].style.zIndex).toBe('0');
  });

  it('can advance manually when autoStart is disabled', () => {
    createList();

    const instance = createBgFade('target', { autoStart: false });

    expect(instance.isRunning).toBe(false);
    instance.next();

    expect(instance.currentIndex).toBe(0);
  });

  it('lets overlapping fade timers finish independently', () => {
    const target = createList();
    const items = Array.from(target.querySelectorAll<HTMLElement>('li'));

    const instance = bgfade('target', {
      speed: 3,
      duration: 1,
      autoStart: false,
    });

    instance.next();
    vi.advanceTimersByTime(1000);
    instance.next();

    expect(items[0].classList.contains('bg-active')).toBe(true);
    expect(items[1].classList.contains('bg-active')).toBe(true);

    vi.advanceTimersByTime(2000);

    expect(items[0].classList.contains('bg-active')).toBe(false);
    expect(items[1].classList.contains('bg-active')).toBe(true);

    vi.advanceTimersByTime(1000);

    expect(items[1].classList.contains('bg-active')).toBe(false);
  });

  it('supports custom selectors and active classes', () => {
    document.body.innerHTML = `
      <div id="target">
        <section>a</section>
        <section>b</section>
      </div>
    `;

    const instance = bgfade('target', {
      selector: 'section',
      activeClass: 'is-active',
      autoStart: false,
    });

    expect(instance.items).toHaveLength(2);
    expect(instance.items[0].classList.contains('is-active')).toBe(true);
  });

  it('restores styles and classes on destroy', () => {
    const target = createList();
    target.style.position = 'static';
    const item = target.querySelector<HTMLElement>('li')!;
    item.style.opacity = '0.5';

    const instance = bgfade('target', { activeClass: 'is-active' });
    instance.destroy();

    expect(instance.isRunning).toBe(false);
    expect(target.style.position).toBe('static');
    expect(item.style.position).toBe('');
    expect(item.style.opacity).toBe('0.5');
    expect(item.classList.contains('is-active')).toBe(false);
  });

  it('clears in-flight fade timers on destroy', () => {
    const target = createList();
    const items = Array.from(target.querySelectorAll<HTMLElement>('li'));

    const instance = bgfade('target', {
      speed: 2,
      duration: 4,
      autoStart: false,
    });

    instance.next();
    instance.destroy();
    vi.advanceTimersByTime(2000);

    expect(items[0].style.opacity).toBe('');
    expect(items[0].style.zIndex).toBe('');
    expect(items[0].classList.contains('bg-active')).toBe(false);
  });

  it('throws a clear error when target is missing', () => {
    expect(() => bgfade('missing')).toThrow(
      'bgfade target element was not found: missing',
    );
  });

  it('throws a clear error when target is not an HTMLElement', () => {
    expect(() => bgfade(null as unknown as HTMLElement)).toThrow(
      'bgfade target must be an HTMLElement or element id',
    );
  });

  it('throws a clear error when selector is invalid', () => {
    createList();

    expect(() => bgfade('target', { selector: '[' })).toThrow(
      'bgfade selector is invalid: [',
    );
  });

  it('throws a clear error when target has no matching items', () => {
    document.body.innerHTML = '<ul id="target"></ul>';

    expect(() => bgfade('target')).toThrow('bgfade target has no items: li');
  });
});
