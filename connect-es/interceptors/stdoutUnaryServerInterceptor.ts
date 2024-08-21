import { performance } from 'node:perf_hooks';
import { Code, ConnectError, type Interceptor } from '@connectrpc/connect';
import { extractLogger } from '~/connect-es/context/logger.js';
import { extractCtxTags } from '~/connect-es/context/tags.js';

type Options = {
  privateMetadataKeys?: string[];
};

export const stdoutUnaryServerInterceptor = ({ privateMetadataKeys = [] }: Options = {}): Interceptor => {
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

      extractLogger(req.contextValues).info({
        kind: 'grpc',
        grpc: {
          code,
          method: req.method.name,
          kind: req.method.methodKind,
          service: req.service.typeName,
          start_time: startsAt.toISOString(),
          time_ms: (performance.now() - before).toFixed(3),
        },
        headers,
        msg: `finished unary call with code ${code}`,
        ...extractCtxTags(req.contextValues).values(),
        ...errLog,
      });
    }
  };
};
