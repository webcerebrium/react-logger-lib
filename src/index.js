import { Logger } from './Logger';

const enableLogger = (wrapper) => {
  if (typeof wrapper === 'function') {
    Logger.calls.warn = 0;
    Logger.calls.error = 0;
    Logger.setOption('output', true);
    wrapper();
    Logger.setOption('output', false);
  } else {
    Logger.setOption('output', wrapper);
  }
};

export default { Logger, enableLogger };
