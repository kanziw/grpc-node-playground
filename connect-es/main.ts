import { Timestamp } from '@bufbuild/protobuf';
import { GrpcEsServer, stdoutUnaryServerInterceptor } from '@kanziw/grpc-es/server';
import { EchoService } from './__proto__/echo/v1/echo_connect.js';

const GRPC_SERVER_PORT = Number(process.env.CONNECT_ES_GRPC_SERVER_PORT) || 8085;

new GrpcEsServer({ jsonOptions: { useProtoFieldName: true } })
  .use(stdoutUnaryServerInterceptor())
  .register(EchoService, {
    echo: (req) => ({
      message: `you said: ${req.message}`,
      responseTime: Timestamp.fromDate(new Date()),
    }),
  })
  .listenAndServe(GRPC_SERVER_PORT);

console.log(`Start gRPC Server w/ connect-es on port ${GRPC_SERVER_PORT}`);
