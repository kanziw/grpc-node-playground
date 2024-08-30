import { join } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from '@fastify/cors';
import { ChannelCredentials, type ClientOptions } from '@grpc/grpc-js';
import fastify, { type FastifyInstance } from 'fastify';
import type { Logger } from '~/lib/logger.js';
import * as idlMessageJsonConvertorModule from './__proto__/echo/v1/echo.js';
import { EchoServiceClient } from './__proto__/echo/v1/echo.js';
import { grpcGatewayFastifyPlugin } from './grpcGateway/fastify.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const makeHttpServer = async ({ logger, grpcServerPort }: { logger: Logger; grpcServerPort: number }): Promise<FastifyInstance> => {
  const app = fastify();
  await app.register(cors, {});

  app.addHook('onError', (_req, _reply, err, done) => {
    logger.error(err);
    done();
  });

  const GRPC_DEFAULT_PARAMETERS: Partial<ClientOptions> = {
    'grpc.keepalive_time_ms': 10000,
    'grpc.keepalive_timeout_ms': 5000,
    'grpc.keepalive_permit_without_calls': 1,
    'grpc.http2.max_pings_without_data': 0,
    'grpc.http2.min_time_between_pings_ms': 10000,
    'grpc.http2.min_ping_interval_without_data_ms': 5000,
  };

  const grpcClient = new EchoServiceClient(`dns:///localhost:${grpcServerPort}`, ChannelCredentials.createInsecure(), GRPC_DEFAULT_PARAMETERS);

  app.register(
    grpcGatewayFastifyPlugin({
      allowHeaders: [],
      protoFileAbsolutePath: join(__dirname, '../proto/echo/v1/echo.proto'),
      idlMessageJsonConvertorModule,
      grpcClient,
      // onLog: logger.info,
    }),
  );

  return app;
};
