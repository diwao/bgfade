import bgfade = require('bgfade');

declare const target: HTMLElement;

const fromId = bgfade('target', { speed: 1 });
const fromElement = bgfade(target, { duration: '2' });
const fromDefault = bgfade.default('target');
const fromNamed = bgfade.createBgFade('target');

const options: bgfade.BgFadeOptions = {
  activeClass: 'is-active',
  autoStart: false,
  selector: 'section',
};

const instance: bgfade.BgFadeInstance = bgfade('target', options);
const targetValue: bgfade.BgFadeTarget = target;

fromId.stop();
fromElement.start();
fromDefault.pause();
fromNamed.resume();
instance.destroy();

void targetValue;
