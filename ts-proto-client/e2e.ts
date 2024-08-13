import { makeGrpcClient } from '~/ts-proto-client/grpcClient.js';
import { EchoServiceClient } from '~/ts-proto/__proto__/echo/v1/echo.js';
import { makeGrpcServer } from '~/ts-proto/server.js';

const GRPC_SERVER_PORT = process.env.TS_PROTO_GRPC_SERVER_PORT ?? '8086';

async function main() {
  const grpcServer = makeGrpcServer();
  await grpcServer.start(`0.0.0.0:${GRPC_SERVER_PORT}`);
  console.log(`Start gRPC Server w/ ts-proto on port ${GRPC_SERVER_PORT}`);

  const client = makeGrpcClient(EchoServiceClient, `dns:///localhost:${GRPC_SERVER_PORT}`);

  const resp = await client.echo({ message: 'Hello, ts-proto!' });
  console.log(resp);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
