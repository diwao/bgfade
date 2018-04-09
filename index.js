module.exports = (id, speed, duration) => {
  'use strict';
  if (typeof speed === 'undefined') {
    speed = 3;
  }
  if (typeof duration === 'undefined') {
    duration = 4;
  }
  // vars
  let animeTimer = null;
  const fadeSpeed = speed;
  const fadeDuration = duration * 1000;
  const target = document.getElementById(id);
  const items = target.querySelectorAll('li');

  // functions
  const setFadeStyle = (item, duration) => {
    item.style.transitionDuration = `${duration}s`;
    item.style.transitionProperty = 'opacity';
    item.style.position = 'absolute';
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

  const setActive = (next) => {
    let active = ++next;
    if (active >= items.length) {
      active = 0;
    }
    items[active].classList.add('bg-active');
  }

  const fadeOut = (item, func) => {
    item.style.opacity = 0;
    setTimeout(function(){
      if (func) {
        func();
      }
      item.classList.remove('bg-active');
    }, fadeSpeed * 1000);
  };

  const animate = () => {
    const next = getNext();
    setActive(next);
    fadeOut(items[next], function(){
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
      target.style.position = 'relative';
      setZindex(items);
      setActive(-1);
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
