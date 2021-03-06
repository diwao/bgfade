var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function (id, options) {
  'use strict';
  // default options value

  var speed = void 0,
      duration = void 0;

  if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
    speed = Number(options.speed);
    duration = Number(options.duration);
  }

  if (isNaN(speed)) {
    speed = 3;
  }

  if (isNaN(duration)) {
    duration = 4;
  }

  // vars
  var animeTimer = null;
  var fadeSpeed = Math.abs(speed);
  var fadeDuration = Math.abs(duration) * 1000;
  var target = document.getElementById(id);
  var items = target.querySelectorAll('li');

  // functions
  var setFadeStyle = function setFadeStyle(item, duration) {
    item.style.transitionDuration = duration + 's';
    item.style.transitionProperty = 'opacity';
    item.style.position = 'absolute';
  };

  var setZindex = function setZindex(items) {
    var max = items.length;
    for (var i = 0, len = items.length; i < len; i++) {
      items[i].style.zIndex = max - i;
      setFadeStyle(items[i], fadeSpeed);
    }
  };

  var getNext = function () {
    var current = -1;
    var next = void 0;
    return function () {
      next = ++current;
      if (next >= items.length) {
        current = 0;
        next = 0;
      }
      return next;
    };
  }();

  var setActive = function setActive(next) {
    var active = ++next;
    if (active >= items.length) {
      active = 0;
    }
    items[active].classList.add('bg-active');
  };

  var fadeOut = function fadeOut(item, func) {
    item.style.opacity = 0;
    setTimeout(function () {
      if (func) {
        func();
      }
      item.classList.remove('bg-active');
    }, fadeSpeed * 1000);
  };

  var animate = function animate() {
    var next = getNext();
    setActive(next);
    fadeOut(items[next], function () {
      if (next === 0) {
        items[next].style.zIndex = 0;
        items[next].style.opacity = 1;
      } else if (next + 1 >= items.length) {
        setZindex(items);
        for (var i = 0, len = items.length; i < len; i++) {
          items[i].style.opacity = 1;
        }
      }
    });

    animeTimer = setTimeout(function () {
      animate();
    }, fadeDuration);
  };

  var BgFade = function () {
    function BgFade() {
      _classCallCheck(this, BgFade);

      target.style.position = 'relative';
      setZindex(items);
      setActive(-1);
      setTimeout(function () {
        animate();
      }, fadeDuration);
    }

    _createClass(BgFade, [{
      key: 'stop',
      value: function stop() {
        clearTimeout(animeTimer);
        animeTimer = null;
      }
    }, {
      key: 'start',
      value: function start() {
        if (animeTimer === null) {
          animate();
        }
      }
    }]);

    return BgFade;
  }();

  return new BgFade();
};
