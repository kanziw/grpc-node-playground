import Mali from 'mali';
import { EchoServiceService as EchoService } from '~/ts-proto/__proto__/echo/v1/echo.js';
import { type AppContext, wrapHandlers } from './context.js';
import * as echoService from './handlers/echoService.js';

const GRPC_SERVER_PORT = process.env.TS_PROTO_GRPC_SERVER_PORT ?? '8085';

async function main() {
  const app = new Mali<AppContext>([EchoService]);
  app.context = {};

  app.use({
    EchoService: wrapHandlers(echoService),
  });

  await app.start(`0.0.0.0:${GRPC_SERVER_PORT}`);
  console.log(`Start gRPC Server w/ ts-proto on port ${GRPC_SERVER_PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
