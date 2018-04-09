module exports = (id, speed = 1, duration = 5) => {
  'use strict';
  // vars
  let animeTimer = null;
  const fadeSpeed = speed;
  const fadeDuration = duration * 1000;
  const target = document.getElementById(id);
  const items = this.target.querySelectorAll('li');

  // functions
  const setFadeStyle = (item, duration) => {
    item.style.transitionDuration = `${duration}s`;
    item.style.transitionProperty = 'opacity';
  };

  const setZindex = (items) => {
    const max = items.length;
    for(let i = 0, len = items.length; i < len; i++) {
      items[i].style.zIndex = max - i;
      setFadeStyle(items[i], fadeSpeed);
    }
  };

  const getNext = (() => {
    let current = -1;
    let next;
    return function(){
      next = ++current;
      if (next >= items.length) {
        current = 0;
        next = 0;
      }
      return next;
    }
  })();

  const fade = (item, func) => {
    console.log('test')
    item.style.opacity = 0;
    setTimeout(function(){
      if (func) {
        func();
      }
      console.log('end');
    }, fadeSpeed * 1000);
  };

  const animate = () => {
    var next = getNext();
    console.log(next);
    fade(items[next], function(){
      if (next === 0) {
        items[next].style.zIndex = 0;
        items[next].style.opacity = 1;
      } else if (next + 1 >= items.length) {
        setZindex(items);
        for (let i = 0, len = items.length; i < len; i++) {
          items[i].style.opacity = 1;
        }
      }
    });
    animeTimer = setTimeout(function(){
      animate();
    }, fadeDuration);
  };

  class BgFade {
    constructor(){
      setZindex(items);
      setTimeout(function(){
        animate();
      }, fadeDuration);
    }

    stop() {
      clearTimeout(animeTimer);
      animeTimer = null;
    }

    start() {
      if (animeTimer === null) {
        animate();
      }
    }
  }

  return new BgFade();
};
