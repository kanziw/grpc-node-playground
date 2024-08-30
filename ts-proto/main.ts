import { ConsoleLogger } from '~/lib/logger.js';
import { makeGrpcServer } from './grpcServer.js';
import { makeHttpServer } from './httpServer.js';

const GRPC_SERVER_PORT = Number(process.env.TS_PROTO_GRPC_SERVER_PORT) || 8086;
const HTTP_SERVER_PORT = Number(process.env.TS_PROTO_HTTP_SERVER_PORT) || 8081;

async function main() {
  const logger = ConsoleLogger();

  const grpcServer = makeGrpcServer({ logger });
  await grpcServer.start(`0.0.0.0:${GRPC_SERVER_PORT}`);
  console.log(`Start gRPC Server w/ ts-proto on port ${GRPC_SERVER_PORT}`);

  const httpServer = await makeHttpServer({ logger, grpcServerPort: GRPC_SERVER_PORT });
  const serverUrl = await httpServer.listen({ port: HTTP_SERVER_PORT, host: '0.0.0.0' });
  console.log(`Start HTTP Server w/ ts-proto on ${serverUrl}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
