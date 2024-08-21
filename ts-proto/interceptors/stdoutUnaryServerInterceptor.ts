import { performance } from 'node:perf_hooks';
import { status } from '@grpc/grpc-js';

import type { Context } from '~/ts-proto/context.js';
import { BaseError } from '~/ts-proto/error.js';
import { parseKind } from '~/ts-proto/interceptors/parseKind.js';

// Seems to be fixed at typescript 4.4.0-dev.20210627
// @see https://github.com/Microsoft/TypeScript/issues/24587#issuecomment-890314169
const KEY_FOR_TAGS: string = Symbol('GrcpCtxTags') as unknown as string;

type Tag = Record<string, unknown>;

interface GrpcCtxTags {
  set: (key: string, value: unknown) => GrpcCtxTags;
  sets: (tags: Tag) => GrpcCtxTags;
}

export const extractGrpcCtxTags = (ctx: Context): GrpcCtxTags => {
  const tags = (ctx.locals[KEY_FOR_TAGS] ?? {}) as Tag;
  return {
    set(key, value) {
      tags[key] = value ?? null;
      return this;
    },
    sets(tags) {
      for (const [key, value] of Object.entries(tags)) {
        this.set(key, value);
      }
      return this;
    },
  };
};

type Options = {
  privateMetadataKeys?: string[];
};

export const stdoutUnaryServerInterceptor = ({ privateMetadataKeys = [] }: Options = {}) => {
  const privateMetadataKeySet = new Set(privateMetadataKeys);
  const isPrivateMetadataKey = (key: string) => privateMetadataKeySet.has(key);

  return async (ctx: Context, next: () => Promise<void>): Promise<void> => {
    const {
      locals,
      name,
      service,
      package: pkg,
      app: {
        context: { logger },
      },
    } = ctx;
    locals[KEY_FOR_TAGS] = {};

    const [startsAt, before] = [new Date(), performance.now()];
    let code = status[status.OK];
    let errLog: { error?: string; stacktrace?: string } = {};

    try {
      await next();
    } catch (e) {
      code = status[status.UNKNOWN];
      if (e instanceof Error) {
        errLog = { error: e.message, stacktrace: e.stack };
        if (e instanceof BaseError) {
          code = status[e.code];
        }
      }
      throw e;
    } finally {

      const grpc = {
        code,
        method: name,
        kind: parseKind(ctx),
        service: `${pkg}.${service}`,
        start_time: startsAt.toISOString(),
        time_ms: (performance.now() - before).toFixed(3),
      };

      const headers: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(ctx.metadata)) {
        if (isPrivateMetadataKey(key)) continue;
        headers[key] = value;
      }

      logger.info({
        kind: 'grpc',
        grpc,
        headers,
        msg: `finished unary call with code ${code}`,
        ...errLog,
        ...(locals[KEY_FOR_TAGS] as Tag),
      });
    }
  };
};
