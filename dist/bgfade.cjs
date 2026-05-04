'use strict';

const mod = require('./bgfade-module.cjs');
const bgfade = mod.default || mod.createBgFade;

module.exports = bgfade;
module.exports.default = bgfade;
module.exports.createBgFade = mod.createBgFade || bgfade;
