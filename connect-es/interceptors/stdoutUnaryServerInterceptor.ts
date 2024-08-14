import { performance } from 'node:perf_hooks';
import { MethodKind } from '@bufbuild/protobuf';
import { Code, ConnectError, type Interceptor } from '@connectrpc/connect';
import { ConsoleLogger, type Logger } from '~/lib/logger.js';

type Options = {
  logger?: Logger;
  privateMetadataKeys?: string[];
};

export const stdoutUnaryServerInterceptor = ({ logger = ConsoleLogger(), privateMetadataKeys = [] }: Options = {}): Interceptor => {
  const privateMetadataKeySet = new Set(privateMetadataKeys);
  const isPrivateMetadataKey = (key: string) => privateMetadataKeySet.has(key);

  return (next) => async (req) => {
    const [startsAt, before] = [new Date(), performance.now()];
    let errCode: Code | null = null;
    let errLog: { error?: string; stacktrace?: string } = {};

    try {
      return await next(req);
    } catch (unknownErr) {
      const err = ConnectError.from(unknownErr);
      errCode = err.code;
      errLog = { error: err.message, stacktrace: err.stack };

      throw err;
    } finally {
      const code = errCode ? Code[errCode] : 'OK';

      const headers: Record<string, string> = {};
      for (const [key, value] of req.header.entries()) {
        if (isPrivateMetadataKey(key)) continue;
        headers[key] = value;
      }

      logger.info({
        kind: 'grpc',
        grpc: {
          code,
          method: req.method.name,
          kind: MethodKind[req.method.kind],
          service: req.service.typeName,
          start_time: startsAt.toISOString(),
          time_ms: (performance.now() - before).toFixed(3),
        },
        headers,
        msg: `finished unary call with code ${code}`,
        ...errLog,
      });
    }
  };
};
