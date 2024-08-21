import { makeHttpServer } from '~/connect-es/httpServer.js';
import { makeGrpcServer } from './grpcServer.js';

const GRPC_SERVER_PORT = Number(process.env.CONNECT_ES_GRPC_SERVER_PORT) || 8085;
const HTTP_SERVER_PORT = Number(process.env.CONNECT_ES_HTTP_SERVER_PORT) || 8080;

const grpcServer = makeGrpcServer();
grpcServer.start(GRPC_SERVER_PORT);

console.log(`Start gRPC Server w/ connect-es on port ${GRPC_SERVER_PORT}`);

const httpServer = makeHttpServer({
  grpcServerPort: GRPC_SERVER_PORT,
});
const serverUrl = await httpServer.listen({ port: HTTP_SERVER_PORT, host: '0.0.0.0' });

console.log(`Start HTTP Server on ${serverUrl}`);
