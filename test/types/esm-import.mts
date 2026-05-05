import bgfade, {
  createBgFade,
  type BgFadeInstance,
  type BgFadeOptions,
  type BgFadeTarget,
} from 'bgfade';

declare const target: HTMLElement;

const options: BgFadeOptions = {
  speed: 1,
  duration: '2',
};

const fromDefault: BgFadeInstance = bgfade('target', options);
const fromNamed = createBgFade(target);
const targetValue: BgFadeTarget = 'target';

fromDefault.stop();
fromNamed.start();

void targetValue;
