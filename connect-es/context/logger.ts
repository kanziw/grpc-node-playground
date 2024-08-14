import { type ContextValues, createContextKey } from '@connectrpc/connect';
import { ConsoleLogger, type Logger, NoopLogger } from '~/lib/logger.js';
import type { SetContext } from './types.js';

const kLogger = createContextKey<Logger>(NoopLogger());

export const extractLogger = (ctxValues: ContextValues): Logger => ctxValues.get(kLogger);

export const SetLogger: SetContext = ({ ctxValues, req }) => {
  ctxValues.set(kLogger, ConsoleLogger());
  return { ctxValues, req };
};
