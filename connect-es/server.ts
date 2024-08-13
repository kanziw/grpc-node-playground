import { Timestamp } from '@bufbuild/protobuf';
import { GrpcEsServer, stdoutUnaryServerInterceptor } from '@kanziw/grpc-es/server';
import { EchoService } from './__proto__/echo/v1/echo_connect.js';

export const makeGrpcServer = () =>
  new GrpcEsServer({ jsonOptions: { useProtoFieldName: true } }).use(stdoutUnaryServerInterceptor()).register(EchoService, {
    echo: (req) => ({
      message: `you said: ${req.message}`,
      responseTime: Timestamp.fromDate(new Date()),
    }),
  });
