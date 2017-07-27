(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("library", [], factory);
	else if(typeof exports === 'object')
		exports["library"] = factory();
	else
		root["library"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * USAGE examples:
 * import { Logger } from './Logger';
 *
 * Logger.of('module').info("test", "2", "3")
 * Logger.of('module').warn(object)
 *
 * List of modules could be set up in localStorage
 */

var DEFAULT_LEVEL = 'WARN';
var MODULE_LEVELS = {};

if (typeof localStorage !== 'undefined') {
  // we could just sort them ascending - and sequential match will leave us with proper
  // eslint-disable-next-line
  Object.keys(localStorage).sort().forEach(function (key) {
    MODULE_LEVELS[key] = localStorage.getItem(key);
  });
}

var isLevelEnabled = exports.isLevelEnabled = function isLevelEnabled(actualLevel, levelToMatch) {
  if (levelToMatch === 'OFF') return false;
  if (levelToMatch === actualLevel) return true;
  switch (actualLevel) {
    case 'TRACE':
      return ['INFO', 'WARN', 'ERROR'].indexOf(levelToMatch) !== -1;
    case 'INFO':
      return ['WARN', 'ERROR'].indexOf(levelToMatch) !== -1;
    case 'WARN':
      return ['ERROR'].indexOf(levelToMatch) !== -1;
    default:
  }
  return false;
};

var isComponentMatch = exports.isComponentMatch = function isComponentMatch(component, rule) {
  var parts = component.split('.');

  if (parts.length > 1) {
    var accumulated = parts[0];

    if (rule === accumulated) return true;
    for (var i = 1; i < parts.length; i += 1) {
      accumulated += '.' + parts[i];
      if (rule === accumulated) return true;
    }
    return false;
  }
  return component === rule; // no mask support so far
};

var componentMatchesLevel = exports.componentMatchesLevel = function componentMatchesLevel(module, levelToMatch) {
  var map = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;

  var levels = map || MODULE_LEVELS;
  var levelDetected = DEFAULT_LEVEL;

  Object.keys(levels).forEach(function (rule) {
    if (isComponentMatch(module, rule)) {
      levelDetected = levels[rule];
    }
  });
  return isLevelEnabled(levelDetected, levelToMatch);
};

var LoggerInstance = function LoggerInstance() {
  _classCallCheck(this, LoggerInstance);
};

LoggerInstance.calls = { trace: 0, info: 0, warn: 0, error: 0 };
LoggerInstance.options = { output: (typeof jest === 'undefined' ? 'undefined' : _typeof(jest)) !== 'object' };


var setOption = function setOption(option, val) {
  LoggerInstance.options[option] = val;
};
var getOption = function getOption(option) {
  return LoggerInstance.options[option];
};

var of = function of(module) {
  var prefix = module + ' |';

  /* eslint-disable no-console */
  return {
    info: function info() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      LoggerInstance.calls.trace += 1;
      if (getOption('output') && componentMatchesLevel(module, 'INFO')) {
        var _console;

        (_console = console).info.apply(_console, [prefix].concat(args));
      }
    },
    warn: function warn() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      LoggerInstance.calls.warn += 1;
      if (getOption('output') && componentMatchesLevel(module, 'WARN')) {
        var _console2;

        (_console2 = console).warn.apply(_console2, [prefix].concat(args));
      }
    },
    error: function error() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      LoggerInstance.calls.error += 1;
      if (getOption('output') && componentMatchesLevel(module, 'ERROR')) {
        var _console3;

        (_console3 = console).error.apply(_console3, [prefix].concat(args));
      }
    },
    trace: function trace() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      LoggerInstance.calls.trace += 1;
      if (getOption('output') && componentMatchesLevel(module, 'TRACE')) {
        var _console4;

        (_console4 = console).log.apply(_console4, [prefix].concat(args));
      }
    }
  };
};

var Logger = exports.Logger = { of: of, calls: LoggerInstance.calls, setOption: setOption, getOption: getOption };

exports.default = { of: of, calls: LoggerInstance.calls, setOption: setOption, getOption: getOption };

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Logger = __webpack_require__(0);

var enableLogger = function enableLogger(wrapper) {
  if (typeof wrapper === 'function') {
    _Logger.Logger.calls.warn = 0;
    _Logger.Logger.calls.error = 0;
    _Logger.Logger.setOption('output', true);
    wrapper();
    _Logger.Logger.setOption('output', false);
  } else {
    _Logger.Logger.setOption('output', wrapper);
  }
};

exports.default = { Logger: _Logger.Logger, enableLogger: enableLogger };
module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=library.js.map