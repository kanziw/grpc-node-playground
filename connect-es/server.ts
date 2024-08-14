import * as http2 from 'node:http2';
import { connectNodeAdapter } from '@connectrpc/connect-node';
import { EchoService } from './__proto__/echo/v1/echo_connect.js';
import * as echoService from './handlers/echoService.js';

export const makeGrpcServer = () => {
  const server = http2.createServer(
    connectNodeAdapter({
      routes: (router) => {
        router.service(EchoService, echoService);
      },
    }),
  );

  return {
    start: (port: number) => {
      server.listen(port);
    },
  };
};
