import { createPromiseClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { EchoService } from '~/connect-es/__proto__/echo/v1/echo_pb.js';
import { makeGrpcServer } from '~/connect-es/server.js';

const GRPC_SERVER_PORT = Number(process.env.CONNECT_ES_GRPC_SERVER_PORT) || 8085;

async function main() {
  const grpcServer = makeGrpcServer();
  grpcServer.start(GRPC_SERVER_PORT);

  const client = createPromiseClient(
    EchoService,
    createGrpcTransport({
      baseUrl: `http://localhost:${GRPC_SERVER_PORT}`,
      httpVersion: '2',
    }),
  );

  const resp = await client.echo({ message: 'Hello, connect-es!' });
  console.log(resp);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
