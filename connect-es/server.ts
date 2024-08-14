import * as http2 from 'node:http2';
import { connectNodeAdapter } from '@connectrpc/connect-node';
import { EchoService } from './__proto__/echo/v1/echo_connect.js';
import * as echoService from './handlers/echoService.js';
import { stdoutUnaryServerInterceptor } from './interceptors/stdoutUnaryServerInterceptor.js';

export const makeGrpcServer = () => {
  const server = http2.createServer(
    connectNodeAdapter({
      routes: (router) => {
        router.service(EchoService, echoService);
      },
      interceptors: [stdoutUnaryServerInterceptor()],
    }),
  );

  return {
    start: (port: number) => {
      server.listen(port);
    },
  };
};
