import { status } from '@grpc/grpc-js';
import { NoopLogger } from '~/lib/logger.js';
import type { Context } from '~/ts-proto/context.js';
import { BaseError } from '~/ts-proto/error.js';
import { parseKind } from '~/ts-proto/interceptors/parseKind.js';

export const statsUnaryServerInterceptor = () => {
  return async (ctx: Context, next: () => Promise<void>): Promise<void> => {
    const before = performance.now();
    let code = status[status.OK];

    try {
      await next();
    } catch (e) {
      code = status[status.UNKNOWN];
      if (e instanceof BaseError) {
        code = status[e.code];
      }
      throw e;
    } finally {
      const elapsedMs = performance.now() - before;

      const { fullName, service, name: method, package: pkg } = ctx;

      // TODO: Use metric collector
      NoopLogger().info({
        method, // "Echo"
        code, // "OK"
        kind: parseKind(ctx), // "Unary"
        elapsedMs, // 0.05637500000000273
        fullName, // "/echo.v1.EchoService/Echo"
        package: pkg, // "echo.v1"
        service, // "EchoService"
      });
    }
  };
};
