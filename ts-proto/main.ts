import { makeGrpcServer } from './server.js';

const GRPC_SERVER_PORT = process.env.TS_PROTO_GRPC_SERVER_PORT ?? '8086';

async function main() {
  const grpcServer = makeGrpcServer();
  await grpcServer.start(`0.0.0.0:${GRPC_SERVER_PORT}`);
  console.log(`Start gRPC Server w/ ts-proto on port ${GRPC_SERVER_PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
