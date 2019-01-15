'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsx2Json = require('./jsx-2-json');

Object.keys(_jsx2Json).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _jsx2Json[key];
    }
  });
});