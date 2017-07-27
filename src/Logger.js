/**
 * USAGE examples:
 * import { Logger } from './Logger';
 *
 * Logger.of('module').info("test", "2", "3")
 * Logger.of('module').warn(object)
 *
 * List of modules could be set up in localStorage
 */

const DEFAULT_LEVEL = 'WARN';
const MODULE_LEVELS = {};

if (typeof localStorage !== 'undefined') {
  // we could just sort them ascending - and sequential match will leave us with proper
  // eslint-disable-next-line
  Object.keys(localStorage).sort().forEach((key) => { MODULE_LEVELS[key] = localStorage.getItem(key); });
}

export const isLevelEnabled = (actualLevel, levelToMatch) => {
  if (levelToMatch === 'OFF') return false;
  if (levelToMatch === actualLevel) return true;
  switch (actualLevel) {
    case 'TRACE':
      return (['INFO', 'WARN', 'ERROR'].indexOf(levelToMatch) !== -1);
    case 'INFO':
      return (['WARN', 'ERROR'].indexOf(levelToMatch) !== -1);
    case 'WARN':
      return (['ERROR'].indexOf(levelToMatch) !== -1);
    default:
  }
  return false;
};

export const isComponentMatch = (component, rule) => {
  const parts = component.split('.');

  if (parts.length > 1) {
    let accumulated = parts[0];

    if (rule === accumulated) return true;
    for (let i = 1; i < parts.length; i += 1) {
      accumulated += `.${parts[i]}`;
      if (rule === accumulated) return true;
    }
    return false;
  }
  return component === rule; // no mask support so far
};

export const componentMatchesLevel = (module, levelToMatch, map = undefined) => {
  const levels = map || MODULE_LEVELS;
  let levelDetected = DEFAULT_LEVEL;

  Object.keys(levels).forEach((rule) => {
    if (isComponentMatch(module, rule)) { levelDetected = levels[rule]; }
  });
  return isLevelEnabled(levelDetected, levelToMatch);
};

class LoggerInstance {
  static calls = { trace: 0, info: 0, warn: 0, error: 0 };
  static options = { output: (typeof jest !== 'object') };
}

const setOption = (option, val) => { LoggerInstance.options[option] = val; };
const getOption = option => (LoggerInstance.options[option]);

const of = (module) => {
  const prefix = `${module} |`;

  /* eslint-disable no-console */
  return {
    info: (...args) => {
      LoggerInstance.calls.trace += 1;
      if (getOption('output') && componentMatchesLevel(module, 'INFO')) { console.info(prefix, ...args); }
    },
    warn: (...args) => {
      LoggerInstance.calls.warn += 1;
      if (getOption('output') && componentMatchesLevel(module, 'WARN')) { console.warn(prefix, ...args); }
    },
    error: (...args) => {
      LoggerInstance.calls.error += 1;
      if (getOption('output') && componentMatchesLevel(module, 'ERROR')) { console.error(prefix, ...args); }
    },
    trace: (...args) => {
      LoggerInstance.calls.trace += 1;
      if (getOption('output') && componentMatchesLevel(module, 'TRACE')) { console.log(prefix, ...args); }
    }
  };
};

export const Logger = { of, calls: LoggerInstance.calls, setOption, getOption };

export default { of, calls: LoggerInstance.calls, setOption, getOption };
