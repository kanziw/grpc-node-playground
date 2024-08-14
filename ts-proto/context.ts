import { to } from 'await-to-js';
import type { Context as MaliContext } from 'mali';
import type { Logger } from '~/lib/logger.js';

export interface AppContext {
  logger: Logger;
}

export interface Context<Request = unknown, Response = unknown> extends MaliContext<AppContext> {
  metadata: Record<string, unknown>;
  locals: Record<string, unknown>;
  req: Request;
  res: Response;
}

export type Handler<Request, Response> = (ctx: Context<Request, Response>) => Promise<Response>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const wrapHandlers = (handlers: Record<string, Handler<any, any>>) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const wrappedHandlers: Record<string, (ctx: Context<any, any>) => Promise<void>> = {};

  for (const [handlerName, handlerFn] of Object.entries(handlers)) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    wrappedHandlers[handlerName] = async (ctx: Context<any, any>) => {
      const [err, resp] = await to(handlerFn(ctx));
      ctx.res = err ?? resp;

      if (err) {
        throw err;
      }
    };
  }
  return wrappedHandlers;
};
