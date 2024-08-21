import * as http2 from 'node:http2';
import { connectNodeAdapter } from '@connectrpc/connect-node';
import { statsUnaryServerInterceptor } from '~/connect-es/interceptors/statsUnaryServerInterceptor.js';
import { EchoService } from './__proto__/echo/v1/echo_pb.js';
import { SetLogger } from './context/logger.js';
import { SetTags } from './context/tags.js';
import { pipeCtxValues } from './context/types.js';
import * as echoService from './handlers/echoService.js';
import { stdoutUnaryServerInterceptor } from './interceptors/stdoutUnaryServerInterceptor.js';

export const makeGrpcServer = () => {
  const server = http2.createServer(
    connectNodeAdapter({
      routes: (router) => {
        router.service(EchoService, echoService);
      },
      contextValues: pipeCtxValues(SetTags, SetLogger),
      interceptors: [stdoutUnaryServerInterceptor(), statsUnaryServerInterceptor()],
    }),
  );

  return {
    start: (port: number) => {
      server.listen(port);
    },
  };
};
