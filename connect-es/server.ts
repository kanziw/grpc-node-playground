import * as http2 from 'node:http2';
import { Timestamp } from '@bufbuild/protobuf';
import type { ConnectRouter } from '@connectrpc/connect';
import { connectNodeAdapter } from '@connectrpc/connect-node';
import { EchoService } from './__proto__/echo/v1/echo_connect.js';

export const makeGrpcServer = () => {
  const routes = (router: ConnectRouter) =>
    router.service(EchoService, {
      echo: (req) => ({
        message: `you said: ${req.message}`,
        responseTime: Timestamp.fromDate(new Date()),
      }),
    });
  const server = http2.createServer(connectNodeAdapter({ routes }));

  return {
    start: (port: number) => {
      server.listen(port);
    },
  };
};
