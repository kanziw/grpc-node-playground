import { MethodKind } from '@bufbuild/protobuf';
import { Code, ConnectError, type Interceptor } from '@connectrpc/connect';
import { NoopLogger } from '~/lib/logger.js';

export const statsUnaryServerInterceptor = (): Interceptor => {
  return (next) => async (req) => {
    const before = performance.now();
    let errCode: Code | null = null;

    try {
      return await next(req);
    } catch (unknownErr) {
      const err = ConnectError.from(unknownErr);
      errCode = err.code;
      throw err;
    } finally {
      const code = errCode ? Code[errCode] : 'Ok';

      const {
        service: { typeName },
        method: { name: method, kind },
      } = req;

      const typeNames = typeName.split('.');
      const service = typeNames.pop();

      // TODO: Use metric collector
      NoopLogger().info({
        method, // "Echo"
        code, // "Ok"
        kind: MethodKind[kind], // "Unary"
        elapsedMs: performance.now() - before, // 0.05637500000000273
        fullName: `/${req.service.typeName}/${method}`, // "/echo.v1.EchoService/Echo"
        package: typeNames.join('.'), // "echo.v1"
        service, // "EchoService"
      });
    }
  };
};
