type Message = string | Record<string, unknown>;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type Extra = Record<string, unknown>;

export interface Logger {
  debug: (msg: Message, extra?: Extra) => void;
  info: (msg: Message, extra?: Extra) => void;
  warn: (msg: Message, extra?: Extra) => void;
  error: (err: Error | string, extra?: Extra) => void;
}

const toJsonFormattedOneLineText = (inputMsg: Message, { level, ...extra }: { level: LogLevel }): string => {
  let msg = inputMsg;
  if (typeof msg === 'string') {
    msg = { message: inputMsg };
  }

  const now = new Date();
  return JSON.stringify({
    ...extra,
    occurred_at_human: now.toISOString(),
    occurred_at_ms: now.getTime(),
    ...msg,
    level,
  });
};

export const ConsoleLogger: () => Logger = () => {
  const log = console.log.bind(console);
  return {
    debug: (msg, extra = {}) => {
      log(toJsonFormattedOneLineText(msg, { ...extra, level: 'debug' }));
    },
    info: (msg, extra = {}) => {
      log(toJsonFormattedOneLineText(msg, { ...extra, level: 'info' }));
    },
    warn: (msg, extra = {}) => {
      log(toJsonFormattedOneLineText(msg, { ...extra, level: 'warn' }));
    },
    error: (errOrStr, extra = {}) => {
      let msg: Message;
      let err: Error;

      if (errOrStr instanceof Error) {
        err = errOrStr;
        msg = { message: err.message, stack: err.stack };
      } else {
        err = new Error(errOrStr);
        msg = errOrStr;
      }

      log(toJsonFormattedOneLineText(msg, { ...extra, level: 'error' }));
    },
  };
};

const noop: () => void = () => undefined;

export const NoopLogger: () => Logger = () => ({
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
});
